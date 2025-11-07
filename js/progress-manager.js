/**
 * Bitcoin Sovereign Academy - Unified Progress Manager
 *
 * @version 1.0.0
 * @description Central progress tracking system that unifies all localStorage operations
 * across the entire platform. Migrates from 15+ different key formats to a single schema.
 *
 * @usage
 * const pm = new ProgressManager();
 * pm.init(); // Initialize or migrate existing data
 * pm.setModuleComplete('curious', 1, 2, { score: 85, timeSpent: 300 });
 * const progress = pm.getPathProgress('curious'); // Returns 0-100 percentage
 *
 * @author Bitcoin Sovereign Academy
 * @license MIT
 */

class ProgressManager {
    constructor() {
        // Configuration
        this.STORAGE_KEY = 'bsa-unified-progress';
        this.VERSION = '1.0.0';
        this.LEGACY_MODE = true; // Set to false after 30 days of migration
        this.LEGACY_MODE_DAYS = 30;

        // Path definitions with module counts
        this.PATH_DEFINITIONS = {
            curious: { stages: 4, modulesPerStage: 3, totalModules: 12 },
            builder: { stages: 4, modulesPerStage: 3, totalModules: 12 },
            sovereign: { stages: 4, modulesPerStage: 3, totalModules: 12 },
            principled: { stages: 5, modulesPerStage: 3, totalModules: 15 },
            hurried: { stages: 3, modulesPerStage: [3, 3, 1], totalModules: 7 },
            pragmatist: { stages: 2, modulesPerStage: [3, 1], totalModules: 4 },
            observer: { stages: 1, modulesPerStage: [3], totalModules: 3 }
        };

        // Legacy storage keys to migrate from
        this.LEGACY_KEYS = {
            progress: 'learningProgress',
            persona: 'btc-academy-persona',
            onboarding: 'btc-academy-onboarding-completed',
            fullAccess: 'bsa_full_access',
            principled: 'principled-path-progress',
            pragmatist: 'pragmatist-progress',
            hurried: [
                'hurried_module1_progress',
                'hurried_module2_progress',
                'hurried_module3_progress',
                'hurried_module4_progress',
                'hurried_module5_progress',
                'hurried_module6_progress',
                'hurried_module7_progress'
            ],
            pragmatistModules: [
                'pragmatist-m1-',
                'pragmatist-m2-',
                'pragmatist-m3-',
                'pragmatist-m6-'
            ]
        };

        // Event listeners for progress updates
        this.listeners = [];

        // Cache for performance
        this.cache = null;
        this.cacheExpiry = null;
        this.CACHE_DURATION = 5000; // 5 seconds
    }

    /**
     * Initialize the progress manager
     * Loads existing data or creates new structure
     * Performs migration if legacy data detected
     *
     * @returns {Object} The initialized progress data
     */
    init() {
        try {
            // Check if unified data exists
            const existingData = this._loadFromStorage(this.STORAGE_KEY);

            if (existingData && existingData.version === this.VERSION) {
                // Valid unified data exists
                this._log('info', 'Loaded existing unified progress data');
                this.cache = existingData;
                this.cacheExpiry = Date.now() + this.CACHE_DURATION;
                return existingData;
            }

            // Check for legacy data
            if (this._hasLegacyData()) {
                this._log('info', 'Legacy data detected, starting migration...');
                return this.migrate();
            }

            // No data exists, create fresh structure
            this._log('info', 'No existing data found, creating fresh structure');
            const freshData = this._createFreshStructure();
            this._saveToStorage(this.STORAGE_KEY, freshData);
            this.cache = freshData;
            this.cacheExpiry = Date.now() + this.CACHE_DURATION;
            return freshData;

        } catch (error) {
            this._handleError('init', error);
            return this._createFreshStructure();
        }
    }

    /**
     * Get progress data for a specific path
     *
     * @param {string} pathId - The path identifier (curious, builder, etc.)
     * @returns {Object|null} Path progress data or null if not found
     */
    getProgress(pathId) {
        try {
            const data = this._getData();
            if (!data.paths[pathId]) {
                this._log('warn', `Path '${pathId}' not found in progress data`);
                return null;
            }
            return data.paths[pathId];
        } catch (error) {
            this._handleError('getProgress', error);
            return null;
        }
    }

    /**
     * Mark a module as complete
     *
     * @param {string} pathId - Path identifier
     * @param {number} stageNum - Stage number (1-based)
     * @param {number} moduleNum - Module number (1-based)
     * @param {Object} metadata - Optional metadata (score, timeSpent, etc.)
     * @returns {boolean} Success status
     */
    setModuleComplete(pathId, stageNum, moduleNum, metadata = {}) {
        try {
            const data = this._getData();

            if (!data.paths[pathId]) {
                this._log('error', `Invalid path: ${pathId}`);
                return false;
            }

            const moduleKey = `s${stageNum}m${moduleNum}`;
            const now = new Date().toISOString();

            // Initialize module data if it doesn't exist
            if (!data.paths[pathId].modules[moduleKey]) {
                data.paths[pathId].modules[moduleKey] = {
                    completed: false,
                    visited: false,
                    startedAt: now,
                    completedAt: null,
                    attempts: 0,
                    timeSpent: 0,
                    score: null,
                    reflections: {}
                };
            }

            // Update module completion
            data.paths[pathId].modules[moduleKey].completed = true;
            data.paths[pathId].modules[moduleKey].completedAt = now;

            // Merge metadata
            if (metadata.score !== undefined) {
                data.paths[pathId].modules[moduleKey].score = metadata.score;
            }
            if (metadata.timeSpent !== undefined) {
                data.paths[pathId].modules[moduleKey].timeSpent += metadata.timeSpent;
            }

            // Update path-level tracking
            if (!data.paths[pathId].startedAt) {
                data.paths[pathId].startedAt = now;
            }
            data.paths[pathId].currentStage = Math.max(
                data.paths[pathId].currentStage || 1,
                stageNum
            );

            // Save changes
            this._saveData(data);

            // Write to legacy format if in legacy mode
            if (this.LEGACY_MODE) {
                this._writeLegacyFormat(pathId, stageNum, moduleNum, true);
            }

            // Emit event
            this._emit('moduleComplete', { pathId, stageNum, moduleNum, metadata });

            this._log('info', `Module ${pathId} S${stageNum}M${moduleNum} marked complete`);
            return true;

        } catch (error) {
            this._handleError('setModuleComplete', error);
            return false;
        }
    }

    /**
     * Track module visit (user opened but didn't complete)
     *
     * @param {string} pathId - Path identifier
     * @param {number} stageNum - Stage number
     * @param {number} moduleNum - Module number
     * @returns {boolean} Success status
     */
    setModuleVisited(pathId, stageNum, moduleNum) {
        try {
            const data = this._getData();

            if (!data.paths[pathId]) {
                this._log('error', `Invalid path: ${pathId}`);
                return false;
            }

            const moduleKey = `s${stageNum}m${moduleNum}`;
            const now = new Date().toISOString();

            // Initialize if needed
            if (!data.paths[pathId].modules[moduleKey]) {
                data.paths[pathId].modules[moduleKey] = {
                    completed: false,
                    visited: true,
                    startedAt: now,
                    completedAt: null,
                    attempts: 1,
                    timeSpent: 0,
                    score: null,
                    reflections: {}
                };
            } else {
                data.paths[pathId].modules[moduleKey].visited = true;
                data.paths[pathId].modules[moduleKey].attempts += 1;
            }

            // Update path tracking
            if (!data.paths[pathId].startedAt) {
                data.paths[pathId].startedAt = now;
            }
            data.paths[pathId].status = 'in_progress';

            // Update global last activity
            data.global.lastActivity = now;

            this._saveData(data);
            this._emit('moduleVisited', { pathId, stageNum, moduleNum });

            return true;

        } catch (error) {
            this._handleError('setModuleVisited', error);
            return false;
        }
    }

    /**
     * Check if a module is complete
     *
     * @param {string} pathId - Path identifier
     * @param {number} stageNum - Stage number
     * @param {number} moduleNum - Module number
     * @returns {boolean} Completion status
     */
    isModuleComplete(pathId, stageNum, moduleNum) {
        try {
            const data = this._getData();
            const moduleKey = `s${stageNum}m${moduleNum}`;

            if (!data.paths[pathId] || !data.paths[pathId].modules[moduleKey]) {
                return false;
            }

            return data.paths[pathId].modules[moduleKey].completed === true;

        } catch (error) {
            this._handleError('isModuleComplete', error);
            return false;
        }
    }

    /**
     * Get completion percentage for a path
     *
     * @param {string} pathId - Path identifier
     * @returns {number} Percentage complete (0-100)
     */
    getPathProgress(pathId) {
        try {
            const data = this._getData();

            if (!data.paths[pathId]) {
                this._log('warn', `Path '${pathId}' not found`);
                return 0;
            }

            const pathDef = this.PATH_DEFINITIONS[pathId];
            if (!pathDef) {
                this._log('warn', `No definition found for path '${pathId}'`);
                return 0;
            }

            const totalModules = pathDef.totalModules;
            const completedModules = Object.values(data.paths[pathId].modules)
                .filter(m => m.completed === true)
                .length;

            return Math.round((completedModules / totalModules) * 100);

        } catch (error) {
            this._handleError('getPathProgress', error);
            return 0;
        }
    }

    /**
     * Mark entire path as complete
     *
     * @param {string} pathId - Path identifier
     * @returns {boolean} Success status
     */
    setPathComplete(pathId) {
        try {
            const data = this._getData();

            if (!data.paths[pathId]) {
                this._log('error', `Invalid path: ${pathId}`);
                return false;
            }

            const now = new Date().toISOString();
            data.paths[pathId].status = 'completed';
            data.paths[pathId].completedAt = now;

            this._saveData(data);
            this._emit('pathComplete', { pathId });

            this._log('info', `Path ${pathId} marked complete`);
            return true;

        } catch (error) {
            this._handleError('setPathComplete', error);
            return false;
        }
    }

    /**
     * Save a reflection/answer to a module question
     *
     * @param {string} pathId - Path identifier
     * @param {number} stageNum - Stage number
     * @param {number} moduleNum - Module number
     * @param {string} questionId - Question identifier
     * @param {string|Object} text - Reflection text or answer object
     * @returns {boolean} Success status
     */
    saveReflection(pathId, stageNum, moduleNum, questionId, text) {
        try {
            const data = this._getData();
            const moduleKey = `s${stageNum}m${moduleNum}`;

            if (!data.paths[pathId]) {
                this._log('error', `Invalid path: ${pathId}`);
                return false;
            }

            // Initialize module if needed
            if (!data.paths[pathId].modules[moduleKey]) {
                this.setModuleVisited(pathId, stageNum, moduleNum);
            }

            // Save reflection
            data.paths[pathId].modules[moduleKey].reflections[questionId] = {
                text: text,
                savedAt: new Date().toISOString()
            };

            this._saveData(data);

            // Write to legacy format if in legacy mode
            if (this.LEGACY_MODE) {
                this._writeLegacyReflection(pathId, stageNum, moduleNum, questionId, text);
            }

            this._log('info', `Reflection saved for ${pathId} S${stageNum}M${moduleNum} Q${questionId}`);
            return true;

        } catch (error) {
            this._handleError('saveReflection', error);
            return false;
        }
    }

    /**
     * Get all reflections for a module
     *
     * @param {string} pathId - Path identifier
     * @param {number} stageNum - Stage number
     * @param {number} moduleNum - Module number
     * @returns {Object} Reflections object with question IDs as keys
     */
    getReflections(pathId, stageNum, moduleNum) {
        try {
            const data = this._getData();
            const moduleKey = `s${stageNum}m${moduleNum}`;

            if (!data.paths[pathId] || !data.paths[pathId].modules[moduleKey]) {
                return {};
            }

            return data.paths[pathId].modules[moduleKey].reflections || {};

        } catch (error) {
            this._handleError('getReflections', error);
            return {};
        }
    }

    /**
     * Set user persona
     *
     * @param {string} personaId - Persona identifier
     * @returns {boolean} Success status
     */
    setPersona(personaId) {
        try {
            const data = this._getData();
            data.user.persona = personaId;
            this._saveData(data);

            // Write to legacy format
            if (this.LEGACY_MODE) {
                localStorage.setItem(this.LEGACY_KEYS.persona, personaId);
            }

            this._emit('personaChanged', { personaId });
            this._log('info', `Persona set to: ${personaId}`);
            return true;

        } catch (error) {
            this._handleError('setPersona', error);
            return false;
        }
    }

    /**
     * Get current user persona
     *
     * @returns {string|null} Persona ID or null
     */
    getPersona() {
        try {
            const data = this._getData();
            return data.user.persona;
        } catch (error) {
            this._handleError('getPersona', error);
            return null;
        }
    }

    /**
     * Mark onboarding as completed
     *
     * @returns {boolean} Success status
     */
    setOnboardingComplete() {
        try {
            const data = this._getData();
            data.user.onboardingCompleted = true;
            this._saveData(data);

            // Write to legacy format
            if (this.LEGACY_MODE) {
                localStorage.setItem(this.LEGACY_KEYS.onboarding, 'true');
            }

            this._emit('onboardingComplete', {});
            return true;

        } catch (error) {
            this._handleError('setOnboardingComplete', error);
            return false;
        }
    }

    /**
     * Set full access flag (for unlocked content)
     *
     * @param {boolean} enabled - Whether full access is enabled
     * @returns {boolean} Success status
     */
    setFullAccess(enabled) {
        try {
            const data = this._getData();
            data.global.fullAccess = enabled;
            this._saveData(data);

            // Write to legacy format
            if (this.LEGACY_MODE) {
                if (enabled) {
                    localStorage.setItem(this.LEGACY_KEYS.fullAccess, 'yes');
                } else {
                    localStorage.removeItem(this.LEGACY_KEYS.fullAccess);
                }
            }

            this._log('info', `Full access ${enabled ? 'enabled' : 'disabled'}`);
            return true;

        } catch (error) {
            this._handleError('setFullAccess', error);
            return false;
        }
    }

    /**
     * Check if full access is enabled
     *
     * @returns {boolean} Full access status
     */
    hasFullAccess() {
        try {
            const data = this._getData();
            return data.global.fullAccess === true;
        } catch (error) {
            this._handleError('hasFullAccess', error);
            return false;
        }
    }

    /**
     * Export all progress data as JSON
     *
     * @returns {string} JSON string of all progress data
     */
    exportProgress() {
        try {
            const data = this._getData();
            return JSON.stringify(data, null, 2);
        } catch (error) {
            this._handleError('exportProgress', error);
            return null;
        }
    }

    /**
     * Import progress data from JSON
     *
     * @param {string|Object} data - JSON string or object to import
     * @returns {boolean} Success status
     */
    importProgress(data) {
        try {
            let parsedData;

            if (typeof data === 'string') {
                parsedData = JSON.parse(data);
            } else {
                parsedData = data;
            }

            // Validate structure
            if (!this._validateDataStructure(parsedData)) {
                this._log('error', 'Invalid data structure for import');
                return false;
            }

            // Save imported data
            this._saveToStorage(this.STORAGE_KEY, parsedData);
            this.cache = parsedData;
            this.cacheExpiry = Date.now() + this.CACHE_DURATION;

            this._emit('progressImported', {});
            this._log('info', 'Progress data imported successfully');
            return true;

        } catch (error) {
            this._handleError('importProgress', error);
            return false;
        }
    }

    /**
     * Migrate from legacy storage formats to unified format
     *
     * @returns {Object} The migrated data structure
     */
    migrate() {
        try {
            this._log('info', 'Starting migration from legacy formats...');
            const data = this._createFreshStructure();

            // Migrate persona
            const persona = localStorage.getItem(this.LEGACY_KEYS.persona);
            if (persona) {
                data.user.persona = persona;
                this._log('info', `Migrated persona: ${persona}`);
            }

            // Migrate onboarding status
            const onboarding = localStorage.getItem(this.LEGACY_KEYS.onboarding);
            if (onboarding === 'true') {
                data.user.onboardingCompleted = true;
                this._log('info', 'Migrated onboarding status');
            }

            // Migrate full access
            const fullAccess = localStorage.getItem(this.LEGACY_KEYS.fullAccess);
            if (fullAccess === 'yes') {
                data.global.fullAccess = true;
                this._log('info', 'Migrated full access flag');
            }

            // Migrate Curious/Builder/Sovereign progress (learningProgress)
            this._migrateLearningProgress(data);

            // Migrate Principled progress
            this._migratePrincipledProgress(data);

            // Migrate Pragmatist progress
            this._migratePragmatistProgress(data);

            // Migrate Hurried progress
            this._migrateHurriedProgress(data);

            // Set migration timestamp
            data.global.migratedAt = new Date().toISOString();

            // Save migrated data
            this._saveToStorage(this.STORAGE_KEY, data);
            this.cache = data;
            this.cacheExpiry = Date.now() + this.CACHE_DURATION;

            this._log('info', 'Migration completed successfully');
            this._emit('migrationComplete', { data });

            return data;

        } catch (error) {
            this._handleError('migrate', error);
            return this._createFreshStructure();
        }
    }

    /**
     * Clear all progress data (reset)
     *
     * @param {boolean} includeLegacy - Whether to also clear legacy keys
     * @returns {boolean} Success status
     */
    clearAllProgress(includeLegacy = false) {
        try {
            // Clear unified data
            localStorage.removeItem(this.STORAGE_KEY);
            this.cache = null;
            this.cacheExpiry = null;

            // Clear legacy data if requested
            if (includeLegacy) {
                localStorage.removeItem(this.LEGACY_KEYS.progress);
                localStorage.removeItem(this.LEGACY_KEYS.persona);
                localStorage.removeItem(this.LEGACY_KEYS.onboarding);
                localStorage.removeItem(this.LEGACY_KEYS.fullAccess);
                localStorage.removeItem(this.LEGACY_KEYS.principled);
                localStorage.removeItem(this.LEGACY_KEYS.pragmatist);

                // Clear hurried keys
                this.LEGACY_KEYS.hurried.forEach(key => {
                    localStorage.removeItem(key);
                });

                // Clear pragmatist module keys (requires scanning)
                this.LEGACY_KEYS.pragmatistModules.forEach(prefix => {
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                            localStorage.removeItem(key);
                        }
                    });
                });
            }

            this._emit('progressCleared', { includeLegacy });
            this._log('info', 'All progress cleared');
            return true;

        } catch (error) {
            this._handleError('clearAllProgress', error);
            return false;
        }
    }

    /**
     * Add event listener for progress updates
     *
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (typeof callback === 'function') {
            this.listeners.push({ event, callback });
        }
    }

    /**
     * Remove event listener
     *
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
        this.listeners = this.listeners.filter(
            l => !(l.event === event && l.callback === callback)
        );
    }

    // ==================== PRIVATE METHODS ====================

    /**
     * Create fresh data structure
     * @private
     */
    _createFreshStructure() {
        const now = new Date().toISOString();

        return {
            version: this.VERSION,
            createdAt: now,
            user: {
                id: 'anonymous',
                persona: null,
                onboardingCompleted: false
            },
            paths: {
                curious: this._createPathStructure(),
                builder: this._createPathStructure(),
                sovereign: this._createPathStructure(),
                principled: this._createPathStructure(),
                hurried: this._createPathStructure(),
                pragmatist: this._createPathStructure(),
                observer: this._createPathStructure()
            },
            global: {
                fullAccess: false,
                lastActivity: now,
                migratedAt: null
            }
        };
    }

    /**
     * Create path structure template
     * @private
     */
    _createPathStructure() {
        return {
            status: 'not_started', // not_started, in_progress, completed
            startedAt: null,
            completedAt: null,
            currentStage: null,
            modules: {}, // moduleKey: moduleData
            achievements: []
        };
    }

    /**
     * Get current data (from cache or storage)
     * @private
     */
    _getData() {
        // Check cache
        if (this.cache && this.cacheExpiry && Date.now() < this.cacheExpiry) {
            return this.cache;
        }

        // Load from storage
        const data = this._loadFromStorage(this.STORAGE_KEY);

        if (!data) {
            return this.init();
        }

        // Update cache
        this.cache = data;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;

        return data;
    }

    /**
     * Save data to storage
     * @private
     */
    _saveData(data) {
        // Update cache
        this.cache = data;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;

        // Save to storage
        this._saveToStorage(this.STORAGE_KEY, data);
    }

    /**
     * Load from localStorage with error handling
     * @private
     */
    _loadFromStorage(key) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (error) {
            this._log('error', `Failed to load from storage: ${error.message}`);
            return null;
        }
    }

    /**
     * Save to localStorage with error handling and quota management
     * @private
     */
    _saveToStorage(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                this._log('error', 'localStorage quota exceeded');
                // Try to clear old data and retry
                this._clearOldData();
                try {
                    localStorage.setItem(key, JSON.stringify(data));
                    return true;
                } catch (retryError) {
                    this._log('error', 'Failed to save even after cleanup');
                    return false;
                }
            } else {
                this._log('error', `Failed to save to storage: ${error.message}`);
                return false;
            }
        }
    }

    /**
     * Check if legacy data exists
     * @private
     */
    _hasLegacyData() {
        return !!(
            localStorage.getItem(this.LEGACY_KEYS.progress) ||
            localStorage.getItem(this.LEGACY_KEYS.persona) ||
            localStorage.getItem(this.LEGACY_KEYS.principled) ||
            localStorage.getItem(this.LEGACY_KEYS.pragmatist) ||
            localStorage.getItem(this.LEGACY_KEYS.hurried[0])
        );
    }

    /**
     * Migrate learningProgress (Curious/Builder/Sovereign)
     * @private
     */
    _migrateLearningProgress(data) {
        const legacy = this._loadFromStorage(this.LEGACY_KEYS.progress);
        if (!legacy) return;

        ['curious', 'builder', 'sovereign'].forEach(pathId => {
            if (legacy[pathId]) {
                const pathData = legacy[pathId];

                // Migrate modules
                if (pathData.modules) {
                    Object.keys(pathData.modules).forEach(moduleKey => {
                        const moduleData = pathData.modules[moduleKey];

                        // Parse module key (format: "stage1_module2" or "s1m2")
                        const match = moduleKey.match(/(?:stage|s)(\d+)[-_]?(?:module|m)?(\d+)/);
                        if (match) {
                            const stage = parseInt(match[1]);
                            const module = parseInt(match[2]);
                            const key = `s${stage}m${module}`;

                            data.paths[pathId].modules[key] = {
                                completed: moduleData.completed || false,
                                visited: moduleData.visited || false,
                                startedAt: moduleData.startedAt || null,
                                completedAt: moduleData.completedAt || null,
                                attempts: moduleData.attempts || 1,
                                timeSpent: moduleData.timeSpent || 0,
                                score: moduleData.score || null,
                                reflections: moduleData.reflections || {}
                            };
                        }
                    });
                }

                // Migrate path metadata
                if (pathData.startedAt) {
                    data.paths[pathId].startedAt = pathData.startedAt;
                    data.paths[pathId].status = 'in_progress';
                }
                if (pathData.completedAt) {
                    data.paths[pathId].completedAt = pathData.completedAt;
                    data.paths[pathId].status = 'completed';
                }
            }
        });

        this._log('info', 'Migrated learningProgress data');
    }

    /**
     * Migrate principled-path-progress
     * @private
     */
    _migratePrincipledProgress(data) {
        const legacy = this._loadFromStorage(this.LEGACY_KEYS.principled);
        if (!legacy) return;

        // Format: { stage1: { module1: true, module2: true }, stage2: {...} }
        Object.keys(legacy).forEach(stageKey => {
            const match = stageKey.match(/stage(\d+)/);
            if (match) {
                const stageNum = parseInt(match[1]);
                const stageData = legacy[stageKey];

                Object.keys(stageData).forEach(moduleKey => {
                    const moduleMatch = moduleKey.match(/module(\d+)/);
                    if (moduleMatch && stageData[moduleKey] === true) {
                        const moduleNum = parseInt(moduleMatch[1]);
                        const key = `s${stageNum}m${moduleNum}`;

                        data.paths.principled.modules[key] = {
                            completed: true,
                            visited: true,
                            startedAt: null,
                            completedAt: null,
                            attempts: 1,
                            timeSpent: 0,
                            score: null,
                            reflections: {}
                        };
                    }
                });
            }
        });

        if (Object.keys(data.paths.principled.modules).length > 0) {
            data.paths.principled.status = 'in_progress';
        }

        this._log('info', 'Migrated principled-path-progress data');
    }

    /**
     * Migrate pragmatist-progress
     * @private
     */
    _migratePragmatistProgress(data) {
        const legacy = this._loadFromStorage(this.LEGACY_KEYS.pragmatist);
        if (!legacy) return;

        // Format varies, try to parse
        if (legacy.modules) {
            Object.keys(legacy.modules).forEach(moduleKey => {
                const match = moduleKey.match(/s(\d+)m(\d+)/);
                if (match) {
                    const stageNum = parseInt(match[1]);
                    const moduleNum = parseInt(match[2]);
                    const key = `s${stageNum}m${moduleNum}`;

                    data.paths.pragmatist.modules[key] = {
                        completed: legacy.modules[moduleKey].completed || false,
                        visited: true,
                        startedAt: legacy.modules[moduleKey].startedAt || null,
                        completedAt: legacy.modules[moduleKey].completedAt || null,
                        attempts: 1,
                        timeSpent: 0,
                        score: null,
                        reflections: {}
                    };
                }
            });
        }

        // Migrate individual module reflection keys (pragmatist-m1-, pragmatist-m2-, etc.)
        this.LEGACY_KEYS.pragmatistModules.forEach(prefix => {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(prefix)) {
                    // Extract the suffix (question ID)
                    const questionId = key.substring(prefix.length);
                    const value = localStorage.getItem(key);

                    // Determine module number from prefix
                    const moduleMatch = prefix.match(/m(\d+)/);
                    if (moduleMatch) {
                        const moduleNum = parseInt(moduleMatch[1]);
                        // Map to actual stage/module based on pragmatist structure
                        // m1-m3 are stage 1, m6 is stage 2
                        const stageNum = moduleNum <= 3 ? 1 : 2;
                        const actualModuleNum = moduleNum <= 3 ? moduleNum : 1;
                        const moduleKey = `s${stageNum}m${actualModuleNum}`;

                        if (!data.paths.pragmatist.modules[moduleKey]) {
                            data.paths.pragmatist.modules[moduleKey] = {
                                completed: false,
                                visited: true,
                                startedAt: null,
                                completedAt: null,
                                attempts: 1,
                                timeSpent: 0,
                                score: null,
                                reflections: {}
                            };
                        }

                        data.paths.pragmatist.modules[moduleKey].reflections[questionId] = {
                            text: value,
                            savedAt: null
                        };
                    }
                }
            });
        });

        if (Object.keys(data.paths.pragmatist.modules).length > 0) {
            data.paths.pragmatist.status = 'in_progress';
        }

        this._log('info', 'Migrated pragmatist-progress data');
    }

    /**
     * Migrate hurried_module*_progress
     * @private
     */
    _migrateHurriedProgress(data) {
        this.LEGACY_KEYS.hurried.forEach((key, index) => {
            const moduleProgress = this._loadFromStorage(key);
            if (!moduleProgress) return;

            // Determine stage and module based on index (0-6)
            // Modules 1-3 = Stage 1, Modules 4-6 = Stage 2, Module 7 = Stage 3
            let stageNum, moduleNum;
            if (index < 3) {
                stageNum = 1;
                moduleNum = index + 1;
            } else if (index < 6) {
                stageNum = 2;
                moduleNum = index - 2;
            } else {
                stageNum = 3;
                moduleNum = 1;
            }

            const moduleKey = `s${stageNum}m${moduleNum}`;

            // Hurried progress is stored as array of checked items
            // Consider complete if it exists (user engaged with it)
            data.paths.hurried.modules[moduleKey] = {
                completed: Array.isArray(moduleProgress) && moduleProgress.length > 0,
                visited: true,
                startedAt: null,
                completedAt: null,
                attempts: 1,
                timeSpent: 0,
                score: null,
                reflections: {
                    checkedItems: moduleProgress
                }
            };
        });

        if (Object.keys(data.paths.hurried.modules).length > 0) {
            data.paths.hurried.status = 'in_progress';
        }

        this._log('info', 'Migrated hurried module progress data');
    }

    /**
     * Write to legacy format for backward compatibility
     * @private
     */
    _writeLegacyFormat(pathId, stageNum, moduleNum, completed) {
        try {
            // Only write to legacy for paths that use learningProgress
            if (['curious', 'builder', 'sovereign'].includes(pathId)) {
                const legacy = this._loadFromStorage(this.LEGACY_KEYS.progress) || {};

                if (!legacy[pathId]) {
                    legacy[pathId] = { modules: {} };
                }

                const moduleKey = `stage${stageNum}_module${moduleNum}`;

                if (!legacy[pathId].modules[moduleKey]) {
                    legacy[pathId].modules[moduleKey] = {};
                }

                legacy[pathId].modules[moduleKey].completed = completed;
                legacy[pathId].modules[moduleKey].completedAt = new Date().toISOString();

                this._saveToStorage(this.LEGACY_KEYS.progress, legacy);
            }
            // Handle other path-specific legacy formats
            else if (pathId === 'principled') {
                const legacy = this._loadFromStorage(this.LEGACY_KEYS.principled) || {};
                const stageKey = `stage${stageNum}`;
                const moduleKey = `module${moduleNum}`;

                if (!legacy[stageKey]) {
                    legacy[stageKey] = {};
                }

                legacy[stageKey][moduleKey] = completed;
                this._saveToStorage(this.LEGACY_KEYS.principled, legacy);
            }
            else if (pathId === 'hurried') {
                // Hurried uses individual keys per module
                const globalModuleNum = this._getHurriedGlobalModuleNum(stageNum, moduleNum);
                const key = this.LEGACY_KEYS.hurried[globalModuleNum - 1];

                if (key) {
                    const data = this._getData();
                    const moduleKey = `s${stageNum}m${moduleNum}`;
                    const checkedItems = data.paths.hurried.modules[moduleKey]?.reflections?.checkedItems || [];
                    this._saveToStorage(key, checkedItems);
                }
            }
        } catch (error) {
            this._log('warn', `Failed to write legacy format: ${error.message}`);
        }
    }

    /**
     * Write reflection to legacy format
     * @private
     */
    _writeLegacyReflection(pathId, stageNum, moduleNum, questionId, text) {
        try {
            if (pathId === 'pragmatist') {
                // Map to legacy module number
                const legacyModuleNum = stageNum === 1 ? moduleNum : (moduleNum + 5);
                const key = `pragmatist-m${legacyModuleNum}-${questionId}`;
                localStorage.setItem(key, typeof text === 'string' ? text : JSON.stringify(text));
            }
        } catch (error) {
            this._log('warn', `Failed to write legacy reflection: ${error.message}`);
        }
    }

    /**
     * Get hurried global module number from stage/module
     * @private
     */
    _getHurriedGlobalModuleNum(stageNum, moduleNum) {
        if (stageNum === 1) return moduleNum;
        if (stageNum === 2) return moduleNum + 3;
        if (stageNum === 3) return 7;
        return 1;
    }

    /**
     * Validate data structure
     * @private
     */
    _validateDataStructure(data) {
        return !!(
            data &&
            data.version &&
            data.user &&
            data.paths &&
            data.global
        );
    }

    /**
     * Clear old data to free up space
     * @private
     */
    _clearOldData() {
        try {
            // Remove legacy keys if we're past migration period
            if (this.LEGACY_MODE === false) {
                Object.values(this.LEGACY_KEYS).forEach(key => {
                    if (Array.isArray(key)) {
                        key.forEach(k => localStorage.removeItem(k));
                    } else {
                        localStorage.removeItem(key);
                    }
                });
            }
        } catch (error) {
            this._log('warn', `Failed to clear old data: ${error.message}`);
        }
    }

    /**
     * Emit event to listeners
     * @private
     */
    _emit(event, data) {
        this.listeners
            .filter(l => l.event === event)
            .forEach(l => {
                try {
                    l.callback(data);
                } catch (error) {
                    this._log('error', `Error in event listener: ${error.message}`);
                }
            });
    }

    /**
     * Log messages
     * @private
     */
    _log(level, message) {
        const prefix = '[ProgressManager]';

        if (level === 'error') {
            console.error(prefix, message);
        } else if (level === 'warn') {
            console.warn(prefix, message);
        } else {
            console.log(prefix, message);
        }
    }

    /**
     * Handle errors consistently
     * @private
     */
    _handleError(method, error) {
        this._log('error', `Error in ${method}: ${error.message}`);
        console.error(error);
    }
}

// Export for use in modules or global scope
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressManager;
} else {
    window.ProgressManager = ProgressManager;
}
