class JourneyManager {
  constructor(mcpClient) {
    this.mcp = mcpClient;

    this.stageOrder = ['foundation', 'basics', 'deeper', 'custody', 'advanced'];
    this.stageMeta = this.buildStageMeta();
    this.personas = this.buildPersonaCatalog();
    this.personaStages = this.buildPersonaStages();
    this.dynamicStages = {};

    this.heroPersonaEl = document.getElementById('journey-persona');
    this.nextActionBtn = document.getElementById('journey-next-action');
    this.ctaStartBtn = document.getElementById('cta-start-journey');
    this.ctaDemosBtn = document.getElementById('cta-browse-demos');

    this.progressFill = document.getElementById('journey-progress-fill');
    this.progressText = document.getElementById('journey-progress-text');
    this.progressStage = document.getElementById('journey-stage');
    this.progressNextBtn = document.getElementById('journey-progress-button');

    this.guidePane = document.getElementById('journey-guide');
    this.guideTitle = document.getElementById('journey-guide-title');
    this.guideDescription = document.getElementById('journey-guide-description');
    this.guideStartBtn = document.getElementById('journey-guide-start');
    this.guideSkipBtn = document.getElementById('journey-guide-skip');

    this.mapGrid = document.getElementById('journey-map-grid');
    this.mapIntro = document.getElementById('journey-map-intro');

    this.modal = document.getElementById('persona-modal');
    this.modalGrid = document.getElementById('persona-grid');
    this.modalContinue = document.getElementById('persona-continue');
    this.modalSkip = document.getElementById('persona-skip');
    this.modalClose = document.getElementById('persona-close');

    this.stageModal = document.getElementById('journey-stage-modal');
    this.stageModalBadge = document.getElementById('journey-stage-badge');
    this.stageModalTitle = document.getElementById('journey-stage-title');
    this.stageModalDescription = document.getElementById('journey-stage-description');
    this.stageModalList = document.getElementById('journey-stage-list');
    this.stageModalStart = document.getElementById('journey-stage-start');
    this.stageModalComplete = document.getElementById('journey-stage-complete');
    this.stageModalClose = document.getElementById('journey-stage-close');

    this.selectedPersona = null;
    this.currentStageForModal = null;
    this.currentCardForModal = null;

    this.state = this.loadState();

    this.renderPersonaOptions();
    this.bindEvents();
    this.applyStateToUI();

    if (this.state.personaId) {
      this.fetchPersonaRecommendations(this.state.personaId);
    }

    this.autoLaunchIfNeeded();
  }

  buildPersonaCatalog() {
    return [
      {
        id: 'curious',
        label: 'Bitcoin Curious',
        description: 'New to Bitcoin. Looking for plain-language explanations and first steps.'
      },
      {
        id: 'investor',
        label: 'Traditional Investor',
        description: 'Understands markets and wants to evaluate Bitcoin as an asset.'
      },
      {
        id: 'builder',
        label: 'Builder / Developer',
        description: 'Comfortable with technology, interested in Lightning, multisig, and building on Bitcoin.'
      },
      {
        id: 'sovereign',
        label: 'Sovereignty Seeker',
        description: 'Focused on self-custody, security practices, and geopolitical resilience.'
      }
    ];
  }

  buildStageMeta() {
    return {
      foundation: { label: 'Foundation', subtitle: 'Understand the why' },
      basics: { label: 'Step 1', subtitle: 'Bitcoin basics' },
      deeper: { label: 'Step 2', subtitle: 'Going deeper' },
      custody: { label: 'Step 3', subtitle: 'Self-custody' },
      advanced: { label: 'Step 4', subtitle: 'Advanced topics' }
    };
  }

  buildPersonaStages() {
    const fallback = {
      foundation: [
        {
          title: 'Understand the Why',
          description: 'Review the foundation card and study why Bitcoin emerged as a response to failing monetary systems.',
          tag: 'Learn',
          anchor: '#foundation-intro',
          guidance: [
            'Scroll to the “Your Path to Sovereignty” section and read the Foundation card carefully.',
            'Open the “Why Bitcoin” section below and capture the key problems Bitcoin is solving.'
          ]
        }
      ],
      basics: [
        {
          title: 'Bitcoin Basics',
          description: 'Learn wallets, keys, addresses, and practice sending a transaction safely.',
          tag: 'Practice',
          anchor: '#foundation-basics',
          guidance: [
            'Complete the Bitcoin Basics card steps and spin up a test wallet.',
            'Use the Story agent to retell what you learned in your own words.'
          ]
        }
      ],
      deeper: [
        {
          title: 'Going Deeper',
          description: 'Explore UTXOs, mining, and consensus to understand what makes Bitcoin unstoppable.',
          tag: 'Explore',
          anchor: '#foundation-deeper',
          guidance: [
            'Scroll to “Going Deeper” and study the callouts inside the section.',
            'Run at least one simulation (Transaction Builder or Mining) to reinforce the concept.'
          ]
        }
      ],
      custody: [
        {
          title: 'Self-Custody Mastery',
          description: 'Design your personal custody plan with hardware wallets, backups, and risk drills.',
          tag: 'Secure',
          anchor: '#foundation-custody',
          guidance: [
            'Read the Self-Custody card and jot down what hardware or multisig setup you plan to use.',
            'Visit the security trainer simulation and practice a recovery drill.'
          ]
        }
      ],
      advanced: [
        {
          title: 'Advanced Topics',
          description: 'Bring nodes, Lightning, and privacy techniques together to operate independently.',
          tag: 'Build',
          anchor: '#foundation-advanced',
          guidance: [
            'Review the Advanced Topics card and identify one advanced capability to try this week.',
            'Use the AI advisors to outline your next experiment (Lightning channel, privacy hardening, or node setup).'
          ]
        }
      ]
    };

    return {
      fallback,
      curious: fallback,
      investor: fallback,
      builder: fallback,
      sovereign: fallback
    };
  }

  loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem('journey-state-v1')) || null;
      if (stored) {
        return this.normalizeState(stored);
      }
    } catch (error) {
      console.warn('JourneyManager: Unable to read stored state', error);
    }

    const initial = {
      personaId: null,
      progress: 0,
      stage: this.stageOrder[0],
      started: {},
      completed: {},
      updatedAt: Date.now()
    };

    return this.normalizeState(initial);
  }

  normalizeState(state) {
    state.started = state.started || {};
    state.completed = state.completed || {};
    this.stageOrder.forEach((stage) => {
      state.started[stage] = Boolean(state.started[stage]);
      state.completed[stage] = Boolean(state.completed[stage]);
    });

    if (!this.stageOrder.includes(state.stage)) {
      state.stage = this.stageOrder.find((stage) => !state.completed[stage]) || this.stageOrder[this.stageOrder.length - 1];
    }

    return state;
  }

  saveState() {
    try {
      localStorage.setItem('journey-state-v1', JSON.stringify(this.state));
    } catch (error) {
      console.warn('JourneyManager: Unable to persist state', error);
    }
  }

  bindEvents() {
    if (this.ctaStartBtn) {
      this.ctaStartBtn.addEventListener('click', () => this.openPersonaModal());
    }

    if (this.ctaDemosBtn) {
      if (this.ctaDemosBtn.tagName === 'BUTTON') {
        this.ctaDemosBtn.addEventListener('click', () => this.scrollTo('#foundation-deeper'));
      } else {
        this.ctaDemosBtn.addEventListener('click', (event) => {
          const href = this.ctaDemosBtn.getAttribute('href');
          if (href) {
            event.preventDefault();
            window.location.assign(href);
          }
        });
      }
    }

    this.nextActionBtn?.addEventListener('click', () => this.handleNextAction());
    this.progressNextBtn?.addEventListener('click', () => this.handleNextAction());

    this.modalContinue?.addEventListener('click', () => this.commitPersonaSelection());
    this.modalSkip?.addEventListener('click', () => {
      this.closePersonaModal();
      this.updateGuidePanel();
    });
    this.modalClose?.addEventListener('click', () => this.closePersonaModal());

    this.stageModalStart?.addEventListener('click', () => {
      if (this.currentCardForModal?.anchor) {
        this.scrollTo(this.currentCardForModal.anchor);
      }
      this.closeStageModal();
    });

    this.stageModalComplete?.addEventListener('click', () => {
      if (this.currentStageForModal) {
        this.markStageComplete(this.currentStageForModal);
      }
    });

    this.stageModalClose?.addEventListener('click', () => this.closeStageModal());

    this.stageModal?.addEventListener('click', (event) => {
      if (event.target === this.stageModal) {
        this.closeStageModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closePersonaModal();
        this.closeStageModal();
      }
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
    if (!this.selectedPersona) {
      this.openPersonaModal();
      return;
    }

    this.state.personaId = this.selectedPersona.id;
    this.state.stage = this.stageOrder[0];
    this.state.progress = 0;
    this.state.started = {};
    this.state.completed = {};
    this.stageOrder.forEach((stage) => {
      this.state.started[stage] = false;
      this.state.completed[stage] = false;
    });
    this.state.updatedAt = Date.now();
    this.saveState();

    this.closePersonaModal();
    this.applyStateToUI();
    this.fetchPersonaRecommendations(this.state.personaId);
  }

  getPersona() {
    return this.state.personaId
      ? this.personas.find((p) => p.id === this.state.personaId)
      : null;
  }

  getPersonaContent(personaId) {
    if (!personaId) return this.personaStages.fallback;
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
      sovereign: 'security'
    };

    try {
      const course = await this.mcp.generateCourse({
        topic: topicMap[personaId] || 'fundamentals',
        level: personaId === 'builder' ? 'intermediate' : 'beginner',
        duration: 4
      });

      if (!course || !Array.isArray(course.modules) || course.modules.length === 0) return;

      const base = this.personaStages[personaId] || this.personaStages.fallback;
      const cloned = this.cloneStageContent(base);
      const [moduleOne, moduleTwo, moduleThree] = course.modules;

      if (moduleOne && cloned.basics?.[0]) {
        cloned.basics[0].title = moduleOne.title || cloned.basics[0].title;
        cloned.basics[0].description = moduleOne.description || cloned.basics[0].description;
        cloned.basics[0].guidance = [
          `Work through the generated module “${moduleOne.title}”.`,
          'Summarize three insights and save them to your learning journal.'
        ];
      }

      if (moduleTwo && cloned.deeper?.[0]) {
        cloned.deeper[0].title = moduleTwo.title || cloned.deeper[0].title;
        cloned.deeper[0].description = moduleTwo.description || cloned.deeper[0].description;
        cloned.deeper[0].guidance = [
          `Complete the advanced exercises in “${moduleTwo.title}”.`,
          'Use at least one interactive simulation to validate what you learned.'
        ];
      }

      if (moduleThree && cloned.advanced?.[0]) {
        cloned.advanced[0].title = moduleThree.title || cloned.advanced[0].title;
        cloned.advanced[0].description = moduleThree.description || cloned.advanced[0].description;
        cloned.advanced[0].guidance = [
          `Apply “${moduleThree.title}” by outlining your own implementation plan.`,
          'Book a follow-up session with the AI advisor to stress-test your plan.'
        ];
      }

      this.dynamicStages[personaId] = cloned;
      this.applyStateToUI();
    } catch (error) {
      console.warn('JourneyManager: Unable to fetch persona recommendations', error);
    }
  }

  applyStateToUI() {
    const hasPersona = Boolean(this.state.personaId);
    document.body.classList.toggle('journey-active', hasPersona);

    this.updateJourneyMessaging();
    this.updateGuidePanel();
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

    if (this.mapIntro) {
      this.mapIntro.textContent = persona
        ? `Your path as ${persona.label}: follow each stage from top to bottom.`
        : 'Pick a persona to unlock a curated flow.';
    }
  }

  updateGuidePanel() {
    if (!this.guideTitle || !this.guideStartBtn || !this.guideDescription) return;

    const persona = this.getPersona();
    const nextCard = persona ? this.getNextActionCard(persona.id) : null;

    if (!persona) {
      this.guideTitle.textContent = 'Select a persona to begin';
      this.guideDescription.textContent = 'Choose a learner profile so we can recommend the first step.';
      this.guideStartBtn.textContent = 'Choose persona';
      this.guideStartBtn.disabled = false;
      this.guideStartBtn.onclick = () => this.openPersonaModal();
      this.guideSkipBtn && (this.guideSkipBtn.onclick = () => this.scrollTo('#journey-map'));
      return;
    }

    if (!nextCard) {
      this.guideTitle.textContent = 'Journey complete!';
      this.guideDescription.textContent = 'Review your journey map or revisit any stage to go even deeper.';
      this.guideStartBtn.textContent = 'Review journey map';
      this.guideStartBtn.disabled = false;
      this.guideStartBtn.onclick = () => this.scrollTo('#journey-map');
      this.guideSkipBtn && (this.guideSkipBtn.onclick = () => this.scrollTo('#foundation'));
      return;
    }

    const meta = this.stageMeta[nextCard.stage] || { label: 'Next', subtitle: '' };
    this.guideTitle.textContent = `Next: ${nextCard.title}`;
    this.guideDescription.textContent = nextCard.guidance?.[0] || nextCard.description || 'Let’s move to your next milestone.';
    this.guideStartBtn.textContent = `Start ${meta.label}`;
    this.guideStartBtn.disabled = false;
    this.guideStartBtn.onclick = () => this.launchStage(nextCard.stage, nextCard.anchor, nextCard);
    this.guideSkipBtn && (this.guideSkipBtn.onclick = () => this.scrollTo('#journey-map'));
  }

  updateProgressUI() {
    const progress = this.progressFromCompleted();
    this.state.progress = progress;

    if (this.progressFill) {
      this.progressFill.style.width = `${Math.min(progress, 100)}%`;
    }

    if (this.progressText) {
      this.progressText.textContent = `${Math.min(progress, 100)}% complete`;
    }

    if (this.progressStage) {
      const stageMeta = this.stageMeta[this.state.stage];
      this.progressStage.textContent = stageMeta ? `Stage: ${stageMeta.label}` : 'Stage: Foundation';
    }
  }

  progressFromCompleted() {
    let progress = 0;
    this.stageOrder.forEach((stage) => {
      if (this.state.completed[stage]) {
        progress = Math.max(progress, this.progressForStage(stage));
      }
    });
    return progress;
  }

  renderStages() {
    if (!this.mapGrid) return;

    const persona = this.getPersona();
    const content = this.getPersonaContent(persona?.id);

    this.mapGrid.innerHTML = '';

    this.stageOrder.forEach((stageId) => {
      const meta = this.stageMeta[stageId];
      const cards = content[stageId] || [];

      const isCompleted = Boolean(this.state.completed[stageId]);
      const isStarted = Boolean(this.state.started[stageId]);
      const isCurrent = this.state.stage === stageId && !isCompleted;

      const stageEl = document.createElement('section');
      stageEl.className = `journey-stage journey-stage--${stageId}`;
      if (isCompleted) stageEl.classList.add('journey-stage--completed');
      if (isCurrent) stageEl.classList.add('journey-stage--current');

      stageEl.innerHTML = `
        <header class="journey-stage__header">
          <span class="journey-stage__badge">${meta.label}</span>
          <h3>${meta.subtitle}</h3>
        </header>
        <div class="journey-stage__cards"></div>
      `;

      const cardsContainer = stageEl.querySelector('.journey-stage__cards');

      cards.forEach((card) => {
        const buttonLabel = isCompleted
          ? 'Review stage'
          : isStarted
            ? 'Continue stage'
            : 'Start stage';
        const cardEl = document.createElement('article');
        cardEl.className = 'journey-card';
        cardEl.innerHTML = `
          <span class="journey-card__tag">${card.tag}</span>
          <h4>${card.title}</h4>
          <p>${card.description}</p>
          <button class="journey-card__action" type="button">${buttonLabel}</button>
        `;
        const button = cardEl.querySelector('.journey-card__action');
        button.addEventListener('click', () => this.launchStage(stageId, card.anchor, card));
        cardsContainer.appendChild(cardEl);
      });

      this.mapGrid.appendChild(stageEl);
    });
  }

  getNextActionCard(personaId) {
    const content = this.getPersonaContent(personaId);
    for (const stageId of this.stageOrder) {
      if (!this.state.completed[stageId]) {
        const card = content[stageId]?.[0];
        if (card) {
          return { ...card, stage: stageId };
        }
      }
    }
    return null;
  }

  handleNextAction() {
    const persona = this.getPersona();
    if (!persona) {
      this.openPersonaModal();
      return;
    }

    const nextCard = this.getNextActionCard(persona.id);
    if (nextCard) {
      this.launchStage(nextCard.stage, nextCard.anchor, nextCard);
    } else {
      this.scrollTo('#journey-map');
    }
  }

  launchStage(stageId, anchor, card) {
    const persona = this.getPersona();
    if (!persona) {
      this.openPersonaModal();
      return;
    }

    const content = this.getPersonaContent(persona.id);
    const stageCard = card || content[stageId]?.[0];
    if (!stageCard) return;

    this.state.stage = stageId;
    this.state.started[stageId] = true;
    this.state.updatedAt = Date.now();
    this.saveState();

    this.applyStateToUI();
    this.openStageModal(stageId, stageCard);

    if (anchor) {
      this.highlightStage(stageId);
    }
  }

  openStageModal(stageId, card) {
    if (!this.stageModal || !card) {
      if (card?.anchor) {
        this.scrollTo(card.anchor);
      }
      return;
    }

    const meta = this.stageMeta[stageId] || { label: 'Stage', subtitle: '' };

    this.currentStageForModal = stageId;
    this.currentCardForModal = card;

    if (this.stageModalBadge) this.stageModalBadge.textContent = meta.label;
    if (this.stageModalTitle) this.stageModalTitle.textContent = card.title;
    if (this.stageModalDescription) this.stageModalDescription.textContent = card.description;

    if (this.stageModalList) {
      this.stageModalList.innerHTML = '';
      const guidance = card.guidance && card.guidance.length ? card.guidance : ['Scroll to the recommended section and capture your takeaways.'];
      guidance.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        this.stageModalList.appendChild(li);
      });
    }

    this.stageModal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }

  closeStageModal() {
    if (!this.stageModal) return;
    this.stageModal.classList.add('hidden');
    if (!this.modal || this.modal.classList.contains('hidden')) {
      document.body.classList.remove('no-scroll');
    }
  }

  markStageComplete(stageId) {
    if (!this.stageOrder.includes(stageId)) return;

    this.state.completed[stageId] = true;
    this.state.started[stageId] = true;
    this.state.progress = Math.max(this.state.progress, this.progressForStage(stageId));

    const nextStage = this.stageOrder.find((stage) => !this.state.completed[stage]);
    this.state.stage = nextStage || stageId;
    this.state.updatedAt = Date.now();

    this.saveState();
    this.closeStageModal();
    this.applyStateToUI();
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
      case 'foundation':
        return 20;
      case 'basics':
        return 40;
      case 'deeper':
        return 60;
      case 'custody':
        return 80;
      case 'advanced':
        return 100;
      default:
        return 0;
    }
  }

  scrollTo(selector) {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openPersonaModal() {
    if (!this.modal) return;

    if (this.state.personaId) {
      this.selectPersona(this.state.personaId);
    } else if (this.modalContinue) {
      this.modalContinue.disabled = true;
      this.modalContinue.textContent = 'Continue with this path';
      this.modalGrid?.querySelectorAll('.persona-card').forEach((card) => card.classList.remove('persona-card--active'));
    }

    this.modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }

  closePersonaModal() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
    if (!this.stageModal || this.stageModal.classList.contains('hidden')) {
      document.body.classList.remove('no-scroll');
    }
  }

  autoLaunchIfNeeded() {
    if (!this.state.personaId) {
      setTimeout(() => this.openPersonaModal(), 600);
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
