(function () {
  const el = document.getElementById('hero-cta');
  if (!el) return;

  const defaults = [
    { href: '/interactive-demos/', label: 'Try a Demo' },
    { href: '/curriculum/', label: 'Start Learning' },
    { href: '/curriculum/first-principles/', label: 'First Principles' },
  ];

  function render(chips) {
    el.innerHTML = chips.slice(0, 3)
      .map(c => `<a class="chip" href="${c.href}">${c.label}</a>`)
      .join('');
  }

  function getPersonaId() {
    // Prefer MCP service if available
    try {
      if (window.mcpService && window.mcpService.currentPersona) {
        return window.mcpService.currentPersona; // e.g. 'student'
      }
    } catch {}

    // Fallback to stored persona mapping
    try {
      const stored = localStorage.getItem('btc-academy-persona');
      if (stored) return stored; // e.g. 'student', 'business-owner'
    } catch {}

    return null;
  }

  const map = {
    'student': [
      { href: '/interactive-demos/bitcoin-sovereign-game/', label: 'Play the Game' },
      { href: '/curriculum/first-principles/', label: 'First Principles' },
      { href: '/interactive-demos/wallet-workshop/', label: 'Wallet Workshop' },
    ],
    'business-owner': [
      { href: '/interactive-demos/lightning-lab.html', label: 'Accept Payments' },
      { href: '/interactive-demos/transaction-builder/', label: 'Understand Fees' },
      { href: '/curriculum/first-principles/', label: 'Custody Options' },
    ],
    'investor': [
      { href: '/curriculum/first-principles/', label: 'Why Scarcity Matters' },
      { href: '/interactive-demos/bitcoin-sovereign-game/', label: 'Play the Sovereign Game' },
      { href: '/interactive-demos/wallet-workshop/', label: 'Self-Custody in 10 Minutes' },
    ],
    'skeptic': [
      { href: '/curriculum/first-principles/', label: 'First Principles' },
      { href: '/interactive-demos/consensus-game/', label: 'Consensus, Explained' },
      { href: '/interactive-demos/bitcoin-sovereign-game/', label: 'Compare to Banks' },
    ],
    'libertarian': [
      { href: '/curriculum/sovereign-tools/', label: 'Sovereign Tools' },
      { href: '/interactive-demos/wallet-workshop/', label: 'Wallet Workshop' },
      { href: '/curriculum/first-principles/', label: 'Censorship Resistance' },
    ],
    'parent': [
      { href: '/interactive-demos/wallet-workshop/', label: 'Try a Wallet' },
      { href: '/curriculum/first-principles/', label: 'Basics in Plain English' },
      { href: '/interactive-demos/consensus-game/', label: 'Consensus Game' },
    ],
    'developer': [
      { href: '/interactive-demos/transaction-builder/', label: 'Build a TX' },
      { href: '/interactive-demos/consensus-game/', label: 'Consensus Game' },
      { href: '/interactive-demos/mining-simulator/', label: 'Mining Simulator' },
    ],
  };

  try {
    const pid = getPersonaId();
    const chips = (pid && map[pid]) ? map[pid] : defaults;
    render(chips);
  } catch {
    render(defaults);
  }
})();
