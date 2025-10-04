class JourneyManager {
  constructor(mcpClient) {
    this.mcp = mcpClient;
    this.storageKey = 'journey-state-v1';

    this.personas = this.buildPersonaCatalog();
    this.stageOrder = ['discover', 'practice', 'apply'];
    this.stageMeta = this.buildStageMeta();
    this.personaStages = this.buildPersonaStages();
    this.dynamicStages = {};
    this.state = this.loadState();

    this.heroPersonaEl = document.getElementById('journey-persona');
    this.nextActionBtn = document.getElementById('journey-next-action');
    this.ctaStartBtn = document.getElementById('cta-start-journey');
    this.ctaDemosBtn = document.getElementById('cta-browse-demos');

    this.progressFill = document.getElementById('journey-progress-fill');
    this.progressText = document.getElementById('journey-progress-text');
    this.progressStage = document.getElementById('journey-stage');
    this.progressNextBtn = document.getElementById('journey-progress-button');

    this.mapGrid = document.getElementById('journey-map-grid');
    this.mapIntro = document.getElementById('journey-map-intro');

    this.modal = document.getElementById('persona-modal');
    this.modalGrid = document.getElementById('persona-grid');
    this.modalContinue = document.getElementById('persona-continue');
    this.modalSkip = document.getElementById('persona-skip');
    this.modalClose = document.getElementById('persona-close');

    this.selectedPersona = null;

    this.init();
  }

  buildPersonaCatalog() {
    return [
      {
        id: 'curious',
        label: 'Bitcoin Curious',
        description: 'New to Bitcoin. Looking for plain-language explanations and first steps.',
      },
      {
        id: 'investor',
        label: 'Traditional Investor',
        description: 'Understands markets and wants to evaluate Bitcoin as an asset.',
      },
      {
        id: 'builder',
        label: 'Builder / Developer',
        description: 'Comfortable with technology, interested in Lightning, multisig, and building on Bitcoin.',
      },
      {
        id: 'sovereign',
        label: 'Sovereignty Seeker',
        description: 'Focused on self-custody, security practices, and geopolitical resilience.',
      },
    ];
  }

  buildStageMeta() {
    return {
      discover: { label: 'Discover', subtitle: 'Understand the why' },
      practice: { label: 'Practice', subtitle: 'Learn by doing' },
      apply: { label: 'Apply', subtitle: 'Put it into real life' },
    };
  }

  buildPersonaStages() {
    const fallback = {
      discover: [
        {
          title: 'Understand Bitcoin fundamentals',
          description: 'Start with first-principles lessons and digestible explainers.',
          tag: 'Watch & Read',
          anchor: '#learn',
        },
      ],
      practice: [
        {
          title: 'Run transaction & fee simulations',
          description: 'Experiment with building transactions and choosing feerates safely.',
          tag: 'Simulate',
          anchor: '#simulate',
        },
      ],
      apply: [
        {
          title: 'Set up your security plan',
          description: 'Review intelligence dashboards and walk through self-custody steps.',
          tag: 'Secure',
          anchor: '#intelligence',
        },
      ],
    };

    return {
      fallback,
      curious: fallback,
      investor: {
        discover: [
          {
            title: 'Study Bitcoin’s monetary properties',
            description: 'Compare scarcity, issuance schedules, and macro narratives.',
            tag: 'Research',
            anchor: '#why-bitcoin',
          },
        ],
        practice: [
          {
            title: 'Model Bitcoin allocations',
            description: 'Use generated courses and simulations to test portfolio scenarios.',
            tag: 'Model',
            anchor: '#courses',
          },
        ],
        apply: [
          {
            title: 'Create your custody & reporting plan',
            description: 'Map out storage, liquidity, and tax reporting considerations.',
            tag: 'Plan',
            anchor: '#intelligence',
          },
        ],
      },
      builder: {
        discover: [
          {
            title: 'Review protocol & Lightning basics',
            description: 'Refresh core concepts before diving into code.',
            tag: 'Docs',
            anchor: '#learn',
          },
        ],
        practice: [
          {
            title: 'Experiment in interactive labs',
            description: 'Use the transaction builder and Lightning demos to test flows.',
            tag: 'Build',
            anchor: '#simulate',
          },
        ],
        apply: [
          {
            title: 'Ship a prototype with AI tutors',
            description: 'Leverage AI agents to storyboard your product and security model.',
            tag: 'Ship',
            anchor: '#ai-agents',
          },
        ],
      },
      sovereign: {
        discover: [
          {
            title: 'Understand why self-custody matters',
            description: 'Explore stories and philosophy around financial sovereignty.',
            tag: 'Reflect',
            anchor: '#ai-agents',
          },
        ],
        practice: [
          {
            title: 'Walk through threat simulations',
            description: 'Run through wallet security trainers and recovery drills.',
            tag: 'Train',
            anchor: '#simulate',
          },
        ],
        apply: [
          {
            title: 'Implement your resilience plan',
            description: 'Use the intelligence dashboard to build monitoring and escalation checklists.',
            tag: 'Secure',
            anchor: '#intelligence',
          },
        ],
      },
    };
  }

  init() {
    this.renderPersonaOptions();
    this.bindEvents();
    this.applyStateToUI();
    if (this.state.personaId) {
      this.fetchPersonaRecommendations(this.state.personaId);
    }
    this.autoLaunchIfNeeded();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.personaId) {
          parsed.started = parsed.started || {};
          return parsed;
        }
      }
    } catch (error) {
      console.warn('JourneyManager: Unable to read stored state', error);
    }
    return {
      personaId: null,
      progress: 0,
      stage: null,
      started: {},
      updatedAt: Date.now(),
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (error) {
      console.warn('JourneyManager: Unable to persist state', error);
    }
  }

  bindEvents() {
    this.ctaStartBtn?.addEventListener('click', () => this.openModal());
    this.ctaDemosBtn?.addEventListener('click', () => this.scrollTo('#simulate'));
    this.nextActionBtn?.addEventListener('click', () => this.handleNextAction());
    this.progressNextBtn?.addEventListener('click', () => this.handleNextAction());

    this.modalContinue?.addEventListener('click', () => this.commitPersonaSelection());
    this.modalSkip?.addEventListener('click', () => {
      this.closeModal();
      this.updateJourneyMessaging();
    });
    this.modalClose?.addEventListener('click', () => this.closeModal());

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.closeModal();
    });
  }

  renderPersonaOptions() {
    if (!this.modalGrid) return;
    this.modalGrid.innerHTML = '';
    this.personas.forEach((persona) => {
      const card = document.createElement('button');
      card.className = 'persona-card';
      card.type = 'button';
      card.dataset.personaId = persona.id;
      card.innerHTML = `
        <span class="persona-card__label">${persona.label}</span>
        <span class="persona-card__desc">${persona.description}</span>
      `;
      card.addEventListener('click', () => this.selectPersona(persona.id));
      this.modalGrid.appendChild(card);
    });
  }

  selectPersona(personaId) {
    this.selectedPersona = this.personas.find((p) => p.id === personaId) || null;
    if (!this.selectedPersona) return;

    this.modalGrid?.querySelectorAll('.persona-card').forEach((card) => {
      card.classList.toggle('persona-card--active', card.dataset.personaId === personaId);
    });

    if (this.modalContinue) {
      this.modalContinue.disabled = false;
      this.modalContinue.textContent = `Continue as ${this.selectedPersona.label}`;
    }
  }

  commitPersonaSelection() {
    if (!this.selectedPersona) return;

    this.state.personaId = this.selectedPersona.id;
    this.state.stage = null;
    this.state.progress = 0;
    this.state.started = {};
    this.state.updatedAt = Date.now();
    this.saveState();

    this.closeModal();
    this.applyStateToUI();
    this.announcePersona();
    this.fetchPersonaRecommendations(this.state.personaId);
  }

  announcePersona() {
    if (this.mcp && typeof this.mcp.emit === 'function') {
      try {
        this.mcp.emit('personaChanged', { personaId: this.state.personaId });
      } catch (error) {
        console.warn('JourneyManager: Unable to emit persona change', error);
      }
    }
  }

  applyStateToUI() {
    document.body.classList.toggle('journey-active', !!this.state.personaId);
    this.updateJourneyMessaging();
    this.updateProgressUI();
    this.renderStages();
  }

  updateJourneyMessaging() {
    const persona = this.getPersona();
    if (this.heroPersonaEl) {
      this.heroPersonaEl.textContent = persona ? persona.label : 'Select a persona to begin';
    }

    if (this.ctaStartBtn) {
      this.ctaStartBtn.textContent = persona ? 'Change persona' : 'Start My Guided Path';
    }

    const nextCard = this.getNextActionCard(persona?.id);
    const label = nextCard ? `Start: ${nextCard.title}` : persona ? 'Review your guided path' : 'Choose your starting path';

    if (this.nextActionBtn) this.nextActionBtn.textContent = label;
    if (this.progressNextBtn) this.progressNextBtn.textContent = label;

    if (this.mapIntro) {
      this.mapIntro.textContent = persona
        ? `Your path as ${persona.label}: follow each stage from top to bottom.`
        : 'Pick a persona to unlock a curated flow.';
    }
  }

  updateProgressUI() {
    const persona = this.getPersona();
    const progress = persona ? this.state.progress : 0;
    const stageLabel = persona ? this.formatStageLabel(this.state.stage) : 'Stage: Discover';

    if (this.progressFill) this.progressFill.style.width = `${Math.min(progress, 100)}%`;
    if (this.progressText) this.progressText.textContent = `${Math.min(progress, 100)}% complete`;
    if (this.progressStage) this.progressStage.textContent = stageLabel;
  }

  formatStageLabel(stage) {
    if (!stage) return 'Stage: Discover';
    const meta = this.stageMeta[stage];
    return meta ? `Stage: ${meta.label}` : 'Stage: Discover';
  }

  renderStages() {
    if (!this.mapGrid) return;
    const persona = this.getPersona();
    const content = this.getPersonaContent(persona?.id);

    this.mapGrid.innerHTML = '';

    this.stageOrder.forEach((stageId) => {
      const meta = this.stageMeta[stageId];
      const cards = content[stageId] || [];

      const stageEl = document.createElement('section');
      stageEl.className = `journey-stage journey-stage--${stageId}`;
      if (this.state.started[stageId]) {
        stageEl.classList.add('journey-stage--active');
      }

      stageEl.innerHTML = `
        <header class="journey-stage__header">
          <span class="journey-stage__badge">${meta.label}</span>
          <h3>${meta.subtitle}</h3>
        </header>
        <div class="journey-stage__cards"></div>
      `;

      const cardsContainer = stageEl.querySelector('.journey-stage__cards');
      cards.forEach((card) => {
        const cardEl = document.createElement('article');
        cardEl.className = 'journey-card';
        const started = !!this.state.started[stageId];
        const buttonLabel = started ? 'Review stage' : 'Start stage';
        cardEl.innerHTML = `
          <span class="journey-card__tag">${card.tag}</span>
          <h4>${card.title}</h4>
          <p>${card.description}</p>
          <button class="journey-card__action" data-stage="${stageId}" data-anchor="${card.anchor}">${buttonLabel}</button>
        `;
        cardsContainer.appendChild(cardEl);
      });

      this.mapGrid.appendChild(stageEl);
    });

    this.mapGrid.querySelectorAll('.journey-card__action').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        const stage = event.currentTarget.dataset.stage;
        const anchor = event.currentTarget.dataset.anchor;
        this.launchStage(stage, anchor);
      });
    });
  }

  handleNextAction() {
    const persona = this.getPersona();
    if (!persona) {
      this.openModal();
      return;
    }

    const nextCard = this.getNextActionCard(persona.id);
    if (nextCard) {
      this.launchStage(nextCard.stage, nextCard.anchor);
    } else if (persona) {
      this.scrollTo('#courses');
    }
  }

  getNextActionCard(personaId) {
    const content = this.getPersonaContent(personaId);

    for (const stageId of this.stageOrder) {
      if (!this.state.started[stageId]) {
        const [firstCard] = content[stageId] || [];
        if (firstCard) {
          return { ...firstCard, stage: stageId };
        }
      }
    }

    // All stages started; suggest revisiting apply
    const [applyCard] = content.apply || [];
    return applyCard ? { ...applyCard, stage: 'apply' } : null;
  }

  launchStage(stageId, anchor) {
    if (!stageId) return;

    this.state.started[stageId] = true;
    this.state.stage = stageId;
    const stageProgress = this.progressForStage(stageId);
    this.state.progress = Math.max(this.state.progress, stageProgress);
    this.state.updatedAt = Date.now();
    this.saveState();

    this.applyStateToUI();
    this.highlightStage(stageId);
    if (anchor) this.scrollTo(anchor);
  }

  highlightStage(stageId) {
    if (!this.mapGrid) return;
    const stageEl = this.mapGrid.querySelector(`.journey-stage--${stageId}`);
    if (!stageEl) return;
    stageEl.classList.add('journey-stage--highlight');
    setTimeout(() => stageEl.classList.remove('journey-stage--highlight'), 1600);
  }

  progressForStage(stageId) {
    switch (stageId) {
      case 'practice':
        return 66;
      case 'apply':
        return 100;
      default:
        return 33;
    }
  }

  getPersonaContent(personaId) {
    if (!personaId) {
      return this.personaStages.fallback;
    }
    return this.dynamicStages[personaId] || this.personaStages[personaId] || this.personaStages.fallback;
  }

  cloneStageContent(content) {
    return JSON.parse(JSON.stringify(content));
  }

  async fetchPersonaRecommendations(personaId) {
    if (!personaId || !this.mcp || typeof this.mcp.generateCourse !== 'function') return;

    const topicMap = {
      curious: 'fundamentals',
      investor: 'economics',
      builder: 'development',
      sovereign: 'security',
    };

    const topic = topicMap[personaId] || 'fundamentals';
    const level = personaId === 'builder' ? 'intermediate' : 'beginner';

    try {
      const course = await this.mcp.generateCourse({ topic, level });
      if (!course || !Array.isArray(course.modules) || !course.modules.length) return;

      const base = this.personaStages[personaId] || this.personaStages.fallback;
      const cloned = this.cloneStageContent(base);

      const [moduleOne, moduleTwo] = course.modules;
      if (moduleOne && cloned.practice && cloned.practice[0]) {
        cloned.practice[0] = {
          ...cloned.practice[0],
          title: moduleOne.title || cloned.practice[0].title,
          description: moduleOne.description || cloned.practice[0].description,
        };
      }

      if (moduleTwo && cloned.apply && cloned.apply[0]) {
        cloned.apply[0] = {
          ...cloned.apply[0],
          title: moduleTwo.title || cloned.apply[0].title,
          description: moduleTwo.description || cloned.apply[0].description,
        };
      }

      this.dynamicStages[personaId] = cloned;
      this.applyStateToUI();
    } catch (error) {
      console.warn('JourneyManager: Unable to fetch persona recommendations', error);
    }
  }

  scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getPersona() {
    return this.state.personaId
      ? this.personas.find((p) => p.id === this.state.personaId)
      : null;
  }

  openModal() {
    if (!this.modal) return;

    if (this.state.personaId) {
      this.selectPersona(this.state.personaId);
    } else {
      this.selectedPersona = null;
      if (this.modalContinue) {
        this.modalContinue.disabled = true;
        this.modalContinue.textContent = 'Continue with this path';
      }
      this.modalGrid?.querySelectorAll('.persona-card').forEach((card) => {
        card.classList.remove('persona-card--active');
      });
    }

    this.modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }

  closeModal() {
    this.modal?.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }

  autoLaunchIfNeeded() {
    if (!this.state.personaId) {
      setTimeout(() => this.openModal(), 600);
    }
  }
}

(function initJourney() {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cta-start-journey')) {
      window.journeyManager = new JourneyManager(window.mcpClient);
    }
  });
})();
