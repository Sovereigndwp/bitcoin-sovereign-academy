class JourneyManager {
  constructor(mcpClient) {
    this.mcp = mcpClient;
    this.storageKey = 'journey-state-v1';
    this.personas = this.buildPersonaCatalog();
    this.state = this.loadState();

    this.heroPersonaEl = document.getElementById('journey-persona');
    this.nextActionBtn = document.getElementById('journey-next-action');
    this.ctaStartBtn = document.getElementById('cta-start-journey');
    this.ctaDemosBtn = document.getElementById('cta-browse-demos');

    this.progressFill = document.getElementById('journey-progress-fill');
    this.progressText = document.getElementById('journey-progress-text');
    this.progressStage = document.getElementById('journey-stage');
    this.progressNextBtn = document.getElementById('journey-progress-button');

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
        nextLabel: 'Begin with Bitcoin fundamentals',
        nextAnchor: '#learn',
      },
      {
        id: 'investor',
        label: 'Traditional Investor',
        description: 'Understands markets, wants to evaluate Bitcoin as part of a portfolio.',
        nextLabel: 'Explore the investment case',
        nextAnchor: '#courses',
      },
      {
        id: 'builder',
        label: 'Builder / Developer',
        description: 'Comfortable with technology, interested in Lightning, multisig, or building on Bitcoin.',
        nextLabel: 'Dive into interactive simulations',
        nextAnchor: '#simulate',
      },
      {
        id: 'sovereign',
        label: 'Sovereignty Seeker',
        description: 'Focused on self-custody, security practices, and geopolitical resilience.',
        nextLabel: 'Follow the sovereignty starter kit',
        nextAnchor: '#intelligence',
      },
    ];
  }

  init() {
    this.renderPersonaOptions();
    this.bindEvents();
    this.applyStateToUI();
    this.autoLaunchIfNeeded();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.personaId) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('JourneyManager: Unable to read stored state', error);
    }
    return {
      personaId: null,
      progress: 0,
      stage: 'discover',
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
    if (this.ctaStartBtn) {
      this.ctaStartBtn.addEventListener('click', () => this.openModal());
    }

    if (this.ctaDemosBtn) {
      this.ctaDemosBtn.addEventListener('click', () => this.scrollTo('#simulate'));
    }

    if (this.nextActionBtn) {
      this.nextActionBtn.addEventListener('click', () => this.handleNextAction());
    }

    if (this.progressNextBtn) {
      this.progressNextBtn.addEventListener('click', () => this.handleNextAction());
    }

    if (this.modalContinue) {
      this.modalContinue.addEventListener('click', () => this.commitPersonaSelection());
    }

    if (this.modalSkip) {
      this.modalSkip.addEventListener('click', () => {
        this.closeModal();
        this.updateJourneyMessaging();
      });
    }

    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeModal());
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeModal();
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

    this.modalGrid.querySelectorAll('.persona-card').forEach((card) => {
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
    this.state.stage = 'discover';
    this.state.progress = 30;
    this.state.updatedAt = Date.now();
    this.saveState();

    this.closeModal();
    this.applyStateToUI();
    this.announcePersona();
  }

  announcePersona() {
    if (window.mcpClient && typeof window.mcpClient.emit === 'function') {
      try {
        window.mcpClient.emit('personaChanged', { personaId: this.state.personaId });
      } catch (error) {
        console.warn('JourneyManager: Unable to emit persona change', error);
      }
    }
  }

  applyStateToUI() {
    this.updateJourneyMessaging();
    this.updateProgressUI();
  }

  updateJourneyMessaging() {
    const persona = this.state.personaId
      ? this.personas.find((p) => p.id === this.state.personaId)
      : null;

    if (this.heroPersonaEl) {
      this.heroPersonaEl.textContent = persona
        ? persona.label
        : 'Select a persona to begin';
    }

    const targetBtn = this.nextActionBtn;
    const progressBtn = this.progressNextBtn;

    if (persona) {
      const label = persona.nextLabel;
      if (targetBtn) targetBtn.textContent = label;
      if (progressBtn) progressBtn.textContent = label;
    } else {
      if (targetBtn) targetBtn.textContent = 'Choose your starting path';
      if (progressBtn) progressBtn.textContent = 'Choose your starting path';
    }
  }

  updateProgressUI() {
    const persona = this.state.personaId
      ? this.personas.find((p) => p.id === this.state.personaId)
      : null;

    const progress = persona ? this.state.progress : 0;
    const stageLabel = persona ? this.formatStageLabel(this.state.stage) : 'Stage: Discover';

    if (this.progressFill) {
      this.progressFill.style.width = `${Math.min(progress, 100)}%`;
    }

    if (this.progressText) {
      this.progressText.textContent = `${Math.min(progress, 100)}% complete`;
    }

    if (this.progressStage) {
      this.progressStage.textContent = stageLabel;
    }
  }

  formatStageLabel(stage) {
    switch (stage) {
      case 'practice':
        return 'Stage: Practice';
      case 'apply':
        return 'Stage: Apply';
      default:
        return 'Stage: Discover';
    }
  }

  handleNextAction() {
    const persona = this.state.personaId
      ? this.personas.find((p) => p.id === this.state.personaId)
      : null;

    if (!persona) {
      this.openModal();
      return;
    }

    if (persona.nextAnchor) {
      this.scrollTo(persona.nextAnchor);
    }
  }

  scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      if (this.modalGrid) {
        this.modalGrid.querySelectorAll('.persona-card').forEach((card) => {
          card.classList.remove('persona-card--active');
        });
      }
    }
    this.modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
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
