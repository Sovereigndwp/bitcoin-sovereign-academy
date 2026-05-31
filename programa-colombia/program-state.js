(function () {
    'use strict';

    const STORAGE_KEY = 'sovereign-colombia-program-state-v1';
    const TOTAL_WEEKS = 10;
    const COMPLETE_RATIO = 0.82;
    const WEEK_LABELS = [
        'Presupuesto real',
        'Mi comprobante de nómina',
        'Deuda sin drama',
        'Fondo de emergencia',
        'La inflación',
        'Fraudes y trampas',
        'Banco digital',
        'Metas de ahorro',
        'Historial crediticio',
        'Hacer crecer mi dinero'
    ];

    // Cross-week field map: each DOM id maps to a shared storage key.
    // When a value is entered on any week, it auto-fills the same logical
    // field on other weeks. Tunable: add/remove ids as the curriculum evolves.
    const SHARED_FIELDS = {
        'monthly-income':   'income.monthly',
        'gross-salary':     'income.monthly',
        'employer-salary':  'income.monthly',
        'monthly-expenses': 'expenses.basic',
        'sim-initial':      'savings.initial',
        'sim-monthly':      'savings.monthly',
        'commit-goal':      'goal.amount',
        'commit-saved':     'goal.saved',
        'commit-months':    'goal.months'
    };

    const normalizedPath = normalizePath(window.location.pathname);
    const currentWeek = getCurrentWeek(normalizedPath);
    const isWeekPage = currentWeek !== null;
    const isHubPage = normalizedPath === '/programa-colombia';
    const isWeekTenPage = currentWeek === 10;

    init();

    function init() {
        if (!isWeekPage && !isHubPage) {
            return;
        }

        injectStyles();

        const state = loadState();

        if (isWeekPage) {
            markVisited(state, currentWeek);
            initCompletionTracking(state, currentWeek);
            initTextareaAutosave(state, currentWeek);
            initCrossWeekSync(state);
            initCopyPlanButton(state, currentWeek);
            if (isWeekTenPage) {
                renderWeekTenSummary(state);
            }
        }

        if (isHubPage) {
            renderHubProgress(state);
        }
    }

    function normalizePath(pathname) {
        const cleaned = (pathname || '')
            .replace(/index\.html$/, '')
            .replace(/\/+$/, '');
        return cleaned || '/';
    }

    function getCurrentWeek(pathname) {
        const match = pathname.match(/\/semana-(\d+)$/);
        return match ? Number(match[1]) : null;
    }

    function createDefaultState() {
        const weeks = {};
        for (let i = 1; i <= TOTAL_WEEKS; i += 1) {
            weeks[i] = {
                visited: false,
                completed: false,
                visits: 0,
                visitedAt: null,
                lastOpenedAt: null,
                completedAt: null,
                scrollMax: 0
            };
        }

        return {
            version: 2,
            updatedAt: null,
            weeks,
            reflections: {},
            fields: {}
        };
    }

    function loadState() {
        const fallback = createDefaultState();

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return fallback;
            }

            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') {
                return fallback;
            }

            const merged = createDefaultState();

            if (parsed.weeks && typeof parsed.weeks === 'object') {
                for (let i = 1; i <= TOTAL_WEEKS; i += 1) {
                    const existing = parsed.weeks[i] || parsed.weeks[String(i)] || {};
                    merged.weeks[i] = {
                        ...merged.weeks[i],
                        ...existing
                    };
                }
            }

            if (parsed.reflections && typeof parsed.reflections === 'object') {
                merged.reflections = parsed.reflections;
            }

            if (parsed.fields && typeof parsed.fields === 'object') {
                merged.fields = parsed.fields;
            }

            merged.updatedAt = parsed.updatedAt || null;
            return merged;
        } catch (error) {
            return fallback;
        }
    }

    function saveState(state) {
        try {
            state.updatedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            // Ignore storage failures silently to avoid interrupting the lesson.
        }
    }

    function getWeekState(state, weekNumber) {
        if (!state.weeks[weekNumber]) {
            state.weeks[weekNumber] = createDefaultState().weeks[weekNumber];
        }
        return state.weeks[weekNumber];
    }

    function markVisited(state, weekNumber) {
        const week = getWeekState(state, weekNumber);
        const now = new Date().toISOString();
        const changed = !week.visited;

        if (!week.visited) {
            week.visited = true;
            week.visitedAt = now;
        }

        week.visits = (week.visits || 0) + 1;
        week.lastOpenedAt = now;
        saveState(state);

        if (changed && isHubPage) {
            renderHubProgress(state);
        }
    }

    function markCompleted(state, weekNumber, reason) {
        const week = getWeekState(state, weekNumber);
        const wasCompleted = !!week.completed;

        if (!week.completed) {
            week.completed = true;
            week.completedAt = new Date().toISOString();
            week.completedReason = reason || 'scroll';
            saveState(state);
        }

        if (!wasCompleted) {
            refreshCurrentPage(state);
        }
    }

    function refreshCurrentPage(state) {
        if (isHubPage) {
            renderHubProgress(state);
        }
        if (isWeekTenPage) {
            renderWeekTenSummary(state);
        }
    }

    function initCompletionTracking(state, weekNumber) {
        const updateFromScroll = () => {
            const doc = document.documentElement;
            const totalHeight = Math.max(doc.scrollHeight, document.body ? document.body.scrollHeight : 0);
            const visibleBottom = window.scrollY + window.innerHeight;
            const ratio = totalHeight > 0 ? Math.min(1, visibleBottom / totalHeight) : 1;
            const week = getWeekState(state, weekNumber);

            if (ratio >= ((week.scrollMax || 0) + 0.04)) {
                week.scrollMax = Number(ratio.toFixed(3));
                saveState(state);
            }

            if (ratio >= COMPLETE_RATIO) {
                markCompleted(state, weekNumber, 'scroll');
            }
        };

        let ticking = false;
        const onScroll = () => {
            if (ticking) {
                return;
            }
            ticking = true;
            window.requestAnimationFrame(() => {
                updateFromScroll();
                ticking = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('load', updateFromScroll, { once: true });
        updateFromScroll();

        document.querySelectorAll('.next-week a, .week-action a, .final-buttons a, .sim-card a').forEach((link) => {
            link.addEventListener('click', () => {
                markCompleted(state, weekNumber, 'continue');
            });
        });
    }

    function initTextareaAutosave(state, weekNumber) {
        const textareas = Array.from(document.querySelectorAll('textarea'));
        if (!textareas.length) {
            return;
        }

        const firstTextarea = textareas[0];
        if (firstTextarea && !document.querySelector('.colombia-autosave-note')) {
            const note = document.createElement('div');
            note.className = 'colombia-autosave-note';
            note.textContent = 'Tus respuestas se guardan automáticamente en este navegador.';
            firstTextarea.insertAdjacentElement('beforebegin', note);
        }

        textareas.forEach((textarea, index) => {
            const key = getReflectionKey(weekNumber, index);
            const savedValue = state.reflections[key];

            if (typeof savedValue === 'string' && !textarea.value) {
                textarea.value = savedValue;
            }

            if (!textarea.dataset.colombiaReflectionId) {
                textarea.dataset.colombiaReflectionId = key;
            }

            let status = textarea.nextElementSibling;
            if (!status || !status.classList.contains('colombia-save-status')) {
                status = document.createElement('div');
                status.className = 'colombia-save-status';
                status.textContent = 'Se guarda automáticamente en este navegador.';
                textarea.insertAdjacentElement('afterend', status);
            }

            let resetTimer;
            textarea.addEventListener('input', () => {
                state.reflections[key] = textarea.value;
                saveState(state);
                status.textContent = textarea.value.trim()
                    ? 'Guardado en este navegador.'
                    : 'Se guarda automáticamente en este navegador.';
                status.classList.add('saved');
                window.clearTimeout(resetTimer);
                resetTimer = window.setTimeout(() => {
                    status.textContent = 'Se guarda automáticamente en este navegador.';
                    status.classList.remove('saved');
                }, 1800);
            });
        });
    }

    function getReflectionKey(weekNumber, index) {
        return 'week-' + weekNumber + '-textarea-' + index;
    }

    // === NEW: Cross-week field sync ===
    // When a value is entered on any week's recognized input, save it to the
    // shared store. When that week (or another) loads, pre-fill matching
    // inputs. Triggers a synthetic 'input' event so dependent calculators
    // refresh automatically.
    function initCrossWeekSync(state) {
        if (!state.fields || typeof state.fields !== 'object') {
            state.fields = {};
        }

        Object.entries(SHARED_FIELDS).forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (!el) return;

            // Restore saved value if the input still has its hard-coded
            // default (we treat any pre-existing value as "default" since
            // weeks ship with placeholder examples).
            const saved = state.fields[key];
            const currentVal = parseFloat(el.value);
            const hasDefault = !isNaN(currentVal);
            // Mark default so we know it was the page-supplied example
            if (hasDefault && !el.dataset.coloFieldOriginal) {
                el.dataset.coloFieldOriginal = String(currentVal);
            }

            if (saved !== undefined && saved !== null && !isNaN(parseFloat(saved))) {
                // Only override if the current value is the original default
                // (i.e. user hasn't already typed something different in this
                // session). This prevents stomping on in-progress edits.
                const isOriginal = el.dataset.coloFieldOriginal !== undefined &&
                                   parseFloat(el.value) === parseFloat(el.dataset.coloFieldOriginal);
                if (!el.value || isOriginal) {
                    el.value = saved;
                    el.dataset.coloFieldRestored = 'true';
                    // Re-run any oninput handler so calculators refresh
                    try {
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                    } catch (e) { /* swallow */ }
                }
            }

            // Persist on subsequent edits
            el.addEventListener('input', () => {
                const v = parseFloat(el.value);
                if (!isNaN(v) && v > 0) {
                    state.fields[key] = v;
                    saveState(state);
                }
            });
        });

        // Small one-time toast when fields were restored
        const restored = document.querySelectorAll('[data-colo-field-restored="true"]');
        if (restored.length && !document.querySelector('.colombia-carryover-note')) {
            const note = document.createElement('div');
            note.className = 'colombia-carryover-note';
            note.textContent = '✓ Algunos campos se pre-llenaron con datos que guardaste antes.';
            // Place it just above the first restored input's parent section
            const firstRestored = restored[0];
            const section = firstRestored.closest('.section, .calculator-box, .planner-box, .program-lesson-section');
            if (section) {
                section.insertAdjacentElement('beforebegin', note);
            }
        }
    }

    // === NEW: Copy-my-plan button ===
    // Injects a button near the closure / next-week area that gathers the
    // user's reflections, key calculator outputs and shared fields, then
    // copies a readable text summary to the clipboard. Falls back to a
    // selectable textarea if clipboard API is unavailable.
    function initCopyPlanButton(state, weekNumber) {
        const closure = document.querySelector('.closure-box, .next-week, .reflection-box, .reflection');
        if (!closure) return;
        if (document.querySelector('.colombia-copy-plan-wrap')) return;

        function generateSummary() {
            const lines = [];
            const weekTitle = WEEK_LABELS[weekNumber - 1] || ('Semana ' + weekNumber);
            lines.push('📋 MI PLAN · Semana ' + weekNumber + ' · ' + weekTitle);
            lines.push('━'.repeat(48));
            lines.push('');

            // Reflections
            const filledReflections = Array.from(document.querySelectorAll('textarea'))
                .filter(t => t.value.trim().length > 0);

            if (filledReflections.length) {
                lines.push('Mis reflexiones:');
                filledReflections.forEach(t => {
                    let q = '';
                    // Try to find the question associated with this textarea
                    const card = t.closest('.reflection-q, .program-lesson-question, .refl-item');
                    if (card) {
                        const qEl = card.querySelector('.reflection-q-text, .refl-q, p strong, strong');
                        if (qEl) q = qEl.textContent.trim();
                    }
                    if (!q && t.placeholder) q = '(' + t.placeholder.slice(0, 60).replace(/\.\.\.$/, '') + ')';
                    if (q) lines.push('• ' + q);
                    lines.push('  ' + t.value.trim().split('\n').join('\n  '));
                    lines.push('');
                });
            }

            // Key calculator results (when visible)
            const resultBlocks = Array.from(document.querySelectorAll(
                '.action-result.visible, .planner-result, .calc-result, .final-amount, ' +
                '.compare-card.focus, .stages-grid, .closure-text, .erosion-box'
            ));
            const seen = new Set();
            const resultLines = [];
            resultBlocks.forEach(el => {
                // Skip if a parent block is already captured
                let p = el.parentElement;
                while (p) {
                    if (seen.has(p)) return;
                    p = p.parentElement;
                }
                seen.add(el);
                const text = el.innerText.replace(/\s+\n/g, '\n').trim();
                if (text && text.length < 600) {
                    resultLines.push(text);
                }
            });
            if (resultLines.length) {
                lines.push('Mis números:');
                resultLines.forEach(t => {
                    lines.push(t.split('\n').map(l => '  ' + l).join('\n'));
                    lines.push('');
                });
            }

            // Shared fields (carryover state)
            if (state.fields && Object.keys(state.fields).length) {
                lines.push('Mis datos guardados:');
                const labels = {
                    'income.monthly':   'Ingreso mensual',
                    'expenses.basic':   'Gastos básicos mensuales',
                    'savings.initial':  'Ahorro inicial',
                    'savings.monthly':  'Ahorro mensual',
                    'goal.amount':      'Meta total',
                    'goal.saved':       'Ya guardado',
                    'goal.months':      'Meses para meta'
                };
                Object.entries(state.fields).forEach(([k, v]) => {
                    const label = labels[k] || k;
                    const formatted = (k === 'goal.months')
                        ? Number(v).toLocaleString('es-CO') + ' meses'
                        : '$' + Number(v).toLocaleString('es-CO');
                    lines.push('  • ' + label + ': ' + formatted);
                });
                lines.push('');
            }

            lines.push('━'.repeat(48));
            lines.push('Programa: bitcoinsovereign.academy/programa-colombia');
            return lines.join('\n');
        }

        const wrap = document.createElement('div');
        wrap.className = 'colombia-copy-plan-wrap';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'colombia-copy-plan-btn';
        btn.innerHTML = '📋 Copiar mi plan de esta semana';

        btn.addEventListener('click', async () => {
            const text = generateSummary();
            let ok = false;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                    ok = true;
                }
            } catch (e) { ok = false; }

            if (ok) {
                btn.innerHTML = '✅ Copiado — pégalo en WhatsApp, notas, o donde quieras';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = '📋 Copiar mi plan de esta semana';
                    btn.classList.remove('copied');
                }, 3000);
            } else {
                // Fallback: show a textarea the user can manually copy from
                showFallback(text);
            }
        });

        function showFallback(text) {
            // Avoid stacking multiple fallbacks
            document.querySelector('.colombia-copy-fallback')?.remove();

            const overlay = document.createElement('div');
            overlay.className = 'colombia-copy-fallback';
            overlay.innerHTML = `
                <div class="colombia-copy-fallback-card">
                    <div class="colombia-copy-fallback-title">Selecciona y copia (Cmd/Ctrl + C)</div>
                    <textarea readonly></textarea>
                    <button type="button" class="colombia-copy-fallback-close">Cerrar</button>
                </div>
            `;
            overlay.querySelector('textarea').value = text;
            overlay.querySelector('.colombia-copy-fallback-close')
                .addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.remove();
            });
            document.body.appendChild(overlay);
            overlay.querySelector('textarea').select();
        }

        wrap.appendChild(btn);

        const helper = document.createElement('div');
        helper.className = 'colombia-copy-plan-helper';
        helper.textContent = 'Mándatelo por WhatsApp, pégalo en tus notas, o compártelo con tu pareja o tu familia.';
        wrap.appendChild(helper);

        closure.insertAdjacentElement('beforebegin', wrap);
    }

    function getStats(state) {
        let visitedCount = 0;
        let completedCount = 0;

        for (let i = 1; i <= TOTAL_WEEKS; i += 1) {
            const week = getWeekState(state, i);
            if (week.visited) {
                visitedCount += 1;
            }
            if (week.completed) {
                completedCount += 1;
            }
        }

        let nextWeek = null;
        for (let i = 1; i <= TOTAL_WEEKS; i += 1) {
            if (!getWeekState(state, i).completed) {
                nextWeek = i;
                break;
            }
        }

        return {
            visitedCount,
            completedCount,
            nextWeek,
            allCompleted: completedCount === TOTAL_WEEKS
        };
    }

    function weekHref(weekNumber) {
        return isHubPage ? 'semana-' + weekNumber + '/' : '../semana-' + weekNumber + '/';
    }

    function renderHubProgress(state) {
        const weeksSection = document.querySelector('.weeks-section');
        if (!weeksSection || !weeksSection.parentNode) {
            return;
        }

        const stats = getStats(state);
        const nextWeek = stats.nextWeek || TOTAL_WEEKS;
        let panel = document.getElementById('colombia-progress-panel');

        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'colombia-progress-panel';
            panel.className = 'colombia-progress-panel';
            weeksSection.parentNode.insertBefore(panel, weeksSection);
        }

        panel.innerHTML = `
            <div class="colombia-progress-copy">
                <div class="colombia-progress-kicker">Tu progreso en este navegador</div>
                <h3 class="colombia-progress-title">${stats.allCompleted ? 'Ruta completa guardada' : 'Sigue donde te convenga'}</h3>
                <p class="colombia-progress-text">${stats.allCompleted
                    ? 'Ya marcaste las 10 semanas como completadas en este navegador.'
                    : 'Has abierto ' + stats.visitedCount + ' de 10 semanas y completado ' + stats.completedCount + ' de 10.'}</p>
            </div>
            <div class="colombia-progress-stats">
                <div class="colombia-progress-stat">
                    <div class="colombia-progress-value">${stats.visitedCount}/10</div>
                    <div class="colombia-progress-label">Semanas abiertas</div>
                </div>
                <div class="colombia-progress-stat">
                    <div class="colombia-progress-value">${stats.completedCount}/10</div>
                    <div class="colombia-progress-label">Semanas completadas</div>
                </div>
                <div class="colombia-progress-stat">
                    <div class="colombia-progress-value">${stats.allCompleted ? '✓' : 'S' + nextWeek}</div>
                    <div class="colombia-progress-label">Próxima recomendada</div>
                </div>
            </div>
            <div class="colombia-progress-actions">
                <a href="${stats.allCompleted ? 'semana-10/' : 'semana-' + nextWeek + '/'}" class="btn-p">${stats.allCompleted ? 'Revisar la Semana 10' : (getWeekState(state, nextWeek).visited ? 'Continuar con la Semana ' + nextWeek : 'Empezar la Semana ' + nextWeek)}</a>
            </div>
        `;

        document.querySelectorAll('.week-accordion').forEach((accordion, index) => {
            const weekNumber = index + 1;
            const summaryInfo = accordion.querySelector('.week-info');
            const actionLink = accordion.querySelector('.btn-week');
            const week = getWeekState(state, weekNumber);
            if (!summaryInfo) {
                return;
            }

            let badge = summaryInfo.querySelector('.colombia-week-status');
            if (week.completed || week.visited) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'colombia-week-status';
                    summaryInfo.appendChild(badge);
                }
                badge.className = 'colombia-week-status ' + (week.completed ? 'is-complete' : 'is-visited');
                badge.textContent = week.completed ? 'Completada' : 'Vista';
            } else if (badge) {
                badge.remove();
            }

            if (actionLink) {
                actionLink.textContent = week.completed
                    ? 'Revisar semana ' + weekNumber + ' →'
                    : week.visited
                    ? 'Continuar semana ' + weekNumber + ' →'
                    : 'Empezar semana ' + weekNumber + ' →';
            }
        });
    }

    function renderWeekTenSummary(state) {
        const closureBox = document.querySelector('.closure-box');
        if (!closureBox) {
            return;
        }

        const stats = getStats(state);
        const title = closureBox.querySelector('.closure-title');
        const closureText = closureBox.querySelector('.closure-text');
        const detailSummary = closureBox.querySelector('.checklist-details summary');
        const checklistItems = Array.from(closureBox.querySelectorAll('.checklist-item'));
        const primaryGhostButton = closureBox.querySelector('.final-buttons .btn-ghost');

        let summaryBox = closureBox.querySelector('.colombia-finish-summary');
        if (!summaryBox && closureText) {
            summaryBox = document.createElement('div');
            summaryBox.className = 'colombia-finish-summary';
            closureText.insertAdjacentElement('afterend', summaryBox);
        }

        if (title) {
            title.textContent = stats.allCompleted ? 'Cierre de la ruta completa' : 'Lo que te llevas de esta ruta';
        }

        if (summaryBox) {
            summaryBox.innerHTML = `
                <div class="colombia-finish-kicker">${stats.allCompleted ? 'Ruta completa guardada' : 'Tu progreso guardado en este navegador'}</div>
                <div class="colombia-finish-copy">${stats.allCompleted
                    ? 'Ya marcaste las 10 semanas como completadas en este navegador.'
                    : 'Llevas ' + stats.completedCount + ' de 10 semanas completadas y ' + stats.visitedCount + ' abiertas en este navegador.'}</div>
            `;
        }

        if (detailSummary) {
            detailSummary.textContent = stats.allCompleted
                ? 'Ver las 10 semanas completadas ▶'
                : 'Ver el estado de tus 10 semanas ▶';
        }

        checklistItems.forEach((item, index) => {
            const weekNumber = index + 1;
            const week = getWeekState(state, weekNumber);
            const check = item.querySelector('.checklist-check');

            item.dataset.state = week.completed ? 'complete' : week.visited ? 'visited' : 'pending';

            if (check) {
                check.textContent = week.completed ? '✅' : week.visited ? '↺' : '○';
            }
        });

        if (primaryGhostButton) {
            if (stats.allCompleted) {
                primaryGhostButton.href = '../';
                primaryGhostButton.textContent = 'Repetir una semana clave';
            } else if (stats.nextWeek) {
                primaryGhostButton.href = weekHref(stats.nextWeek);
                primaryGhostButton.textContent = 'Continuar con la Semana ' + stats.nextWeek;
            }
        }
    }

    function injectStyles() {
        if (document.getElementById('colombia-program-state-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'colombia-program-state-styles';
        style.textContent = `
            .colombia-progress-panel {
                display: grid;
                gap: 1rem;
                margin: 0 0 1.5rem;
                padding: 1.25rem;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(252, 209, 22, 0.18);
                border-radius: 1rem;
            }
            .colombia-progress-kicker {
                font-size: 0.72rem;
                font-weight: 700;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: rgba(252, 209, 22, 0.72);
                margin-bottom: 0.4rem;
            }
            .colombia-progress-title {
                font-size: 1.15rem;
                color: var(--light, #eaeaea);
                margin: 0 0 0.35rem;
            }
            .colombia-progress-text {
                color: var(--dim, #a0a0a0);
                font-size: 0.92rem;
                line-height: 1.65;
                margin: 0;
            }
            .colombia-progress-stats {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 0.75rem;
            }
            .colombia-progress-stat {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(252, 209, 22, 0.12);
                border-radius: 0.85rem;
                padding: 0.9rem;
                text-align: center;
            }
            .colombia-progress-value {
                color: var(--light, #eaeaea);
                font-size: 1.25rem;
                font-weight: 800;
                margin-bottom: 0.2rem;
            }
            .colombia-progress-label {
                color: var(--dim, #a0a0a0);
                font-size: 0.76rem;
                line-height: 1.45;
            }
            .colombia-progress-actions {
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
            }
            .colombia-week-status {
                display: inline-flex;
                align-items: center;
                width: fit-content;
                margin-top: 0.45rem;
                padding: 0.2rem 0.55rem;
                border-radius: 999px;
                font-size: 0.72rem;
                font-weight: 700;
                letter-spacing: 0.02em;
            }
            .colombia-week-status.is-visited {
                background: rgba(59, 130, 246, 0.14);
                border: 1px solid rgba(59, 130, 246, 0.28);
                color: #93c5fd;
            }
            .colombia-week-status.is-complete {
                background: rgba(252, 209, 22, 0.14);
                border: 1px solid rgba(252, 209, 22, 0.28);
                color: #fde68a;
            }
            .colombia-autosave-note {
                color: var(--dim, #a0a0a0);
                font-size: 0.82rem;
                line-height: 1.6;
                margin-bottom: 0.9rem;
            }
            .colombia-save-status {
                color: var(--dim, #a0a0a0);
                font-size: 0.78rem;
                line-height: 1.5;
                margin-top: 0.4rem;
                margin-bottom: 0.9rem;
            }
            .colombia-save-status.saved {
                color: var(--primary, var(--co-yellow, #FCD116));
            }
            .colombia-finish-summary {
                margin: 1rem 0 1.1rem;
                padding: 1rem 1.1rem;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(252, 209, 22, 0.14);
                border-radius: 0.85rem;
                text-align: left;
            }
            .colombia-finish-kicker {
                color: rgba(252, 209, 22, 0.76);
                font-size: 0.72rem;
                font-weight: 700;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                margin-bottom: 0.35rem;
            }
            .colombia-finish-copy {
                color: var(--dim, #a0a0a0);
                font-size: 0.9rem;
                line-height: 1.65;
            }
            .checklist-item[data-state="pending"] .checklist-check {
                color: var(--dim, #a0a0a0);
            }
            .checklist-item[data-state="visited"] .checklist-check {
                color: #93c5fd;
            }
            .checklist-item[data-state="complete"] .checklist-check {
                color: var(--red, #CE1126);
            }

            /* === NEW: carryover toast === */
            .colombia-carryover-note {
                background: rgba(34, 197, 94, 0.08);
                border: 1px solid rgba(34, 197, 94, 0.3);
                color: #86efac;
                border-radius: 8px;
                padding: 0.6rem 0.9rem;
                font-size: 0.85rem;
                margin: 0 0 1rem;
                line-height: 1.55;
            }

            /* === NEW: copy-my-plan button === */
            .colombia-copy-plan-wrap {
                margin: 1.5rem 0;
                text-align: center;
            }
            .colombia-copy-plan-btn {
                display: block;
                width: 100%;
                padding: 0.95rem 1.25rem;
                background: rgba(252, 209, 22, 0.08);
                color: var(--primary, #FCD116);
                border: 1.5px solid rgba(252, 209, 22, 0.32);
                border-radius: 0.85rem;
                font-size: 0.96rem;
                font-weight: 700;
                cursor: pointer;
                font-family: inherit;
                transition: background 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
            }
            .colombia-copy-plan-btn:hover {
                background: rgba(252, 209, 22, 0.16);
                border-color: rgba(252, 209, 22, 0.55);
                transform: translateY(-1px);
            }
            .colombia-copy-plan-btn.copied {
                background: rgba(34, 197, 94, 0.12);
                color: #86efac;
                border-color: rgba(34, 197, 94, 0.4);
            }
            .colombia-copy-plan-helper {
                color: var(--dim, #a0a0a0);
                font-size: 0.82rem;
                line-height: 1.55;
                margin-top: 0.5rem;
            }

            /* === NEW: clipboard fallback overlay === */
            .colombia-copy-fallback {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            .colombia-copy-fallback-card {
                background: #1a1a1a;
                border: 1px solid rgba(252, 209, 22, 0.3);
                border-radius: 12px;
                padding: 1.25rem;
                max-width: 560px;
                width: 100%;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            .colombia-copy-fallback-title {
                color: var(--primary, #FCD116);
                font-weight: 700;
                font-size: 0.95rem;
            }
            .colombia-copy-fallback-card textarea {
                flex: 1;
                min-height: 220px;
                width: 100%;
                background: #0b0d12;
                border: 1px solid rgba(252, 209, 22, 0.2);
                border-radius: 8px;
                padding: 0.75rem;
                color: #e8ecf3;
                font-family: ui-monospace, Menlo, Consolas, monospace;
                font-size: 0.85rem;
                line-height: 1.55;
                resize: none;
            }
            .colombia-copy-fallback-close {
                align-self: flex-end;
                background: rgba(252, 209, 22, 0.12);
                color: var(--primary, #FCD116);
                border: 1px solid rgba(252, 209, 22, 0.3);
                border-radius: 8px;
                padding: 0.5rem 1rem;
                font-weight: 700;
                cursor: pointer;
                font-family: inherit;
            }

            @media (max-width: 768px) {
                .colombia-progress-stats {
                    grid-template-columns: 1fr;
                }
                .colombia-progress-actions {
                    flex-direction: column;
                }
                .colombia-progress-actions .btn-p {
                    width: 100%;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
})();
