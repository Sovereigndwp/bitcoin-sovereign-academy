(function () {
    'use strict';

    const STORAGE_KEY = 'sovereign-colombia-program-state-v1';
    const TOTAL_WEEKS = 10;
    const COMPLETE_RATIO = 0.82;
    const WEEK_LABELS = [
        'Presupuesto real',
        'Mi recibo de pago',
        'Deuda sin drama',
        'Fondo de emergencia',
        'La inflación',
        'Fraudes y trampas',
        'Banco digital',
        'Metas de ahorro',
        'Historial crediticio',
        'Hacer crecer mi dinero'
    ];

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
            version: 1,
            updatedAt: null,
            weeks,
            reflections: {}
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
