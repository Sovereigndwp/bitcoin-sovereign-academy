(function () {
  const el = document.getElementById('hero-cta');
  if (!el) return;

  const defaults = [
    { href: '/interactive-demos/', label: 'Try a Demo' },
    { href: '/deep-dives/', label: 'Start Learning' },
    { href: '/deep-dives/first-principles/', label: 'Bitcoin MVP' },
  ];

  function render(chips) {
    el.innerHTML = chips.slice(0, 3)
      .map(c => `<a class="chip" href="${c.href}">${c.label}</a>`)
      .join('');
  }

  function getPersonaId() {
    try {
      if (window.mcpService && window.mcpService.currentPersona) {
        return window.mcpService.currentPersona;
      }
    } catch {}

    try {
      const stored = localStorage.getItem('btc-academy-persona');
      if (stored) return stored;
    } catch {}

    return null;
  }

  const map = {
    'student': [
      { href: '/interactive-demos/bitcoin-sovereign-game/', label: 'Play the Game' },
      { href: '/deep-dives/first-principles/', label: 'Bitcoin MVP' },
      { href: '/interactive-demos/wallet-security-workshop/', label: 'Wallet Security Workshop' },
    ],
    'business-owner': [
      { href: '/interactive-demos/lightning-lab.html', label: 'Accept Payments' },
      { href: '/interactive-demos/transaction-builder/', label: 'Understand Fees' },
      { href: '/deep-dives/first-principles/', label: 'Custody Options' },
    ],
    'investor': [
      { href: '/deep-dives/first-principles/', label: 'Why Scarcity Matters' },
      { href: '/interactive-demos/bitcoin-sovereign-game/', label: 'Play the Sovereign Game' },
      { href: '/interactive-demos/wallet-security-workshop/', label: 'Self-Custody in 10 Minutes' },
    ],
    'skeptic': [
      { href: '/deep-dives/first-principles/', label: 'Bitcoin MVP' },
      { href: '/interactive-demos/consensus-game/', label: 'Consensus, Explained' },
      { href: '/interactive-demos/bitcoin-sovereign-game/', label: 'Compare to Banks' },
    ],
    'libertarian': [
      { href: '/deep-dives/sovereign-tools/', label: 'Sovereign Tools' },
      { href: '/interactive-demos/wallet-security-workshop/', label: 'Wallet Security Workshop' },
      { href: '/deep-dives/first-principles/', label: 'Censorship Resistance' },
    ],
    'parent': [
      { href: '/interactive-demos/wallet-security-workshop/', label: 'Try a Wallet' },
      { href: '/deep-dives/first-principles/', label: 'Basics in Plain English' },
      { href: '/interactive-demos/consensus-game/', label: 'Consensus Game' },
    ],
    'developer': [
      { href: '/interactive-demos/transaction-builder/', label: 'Build a TX' },
      { href: '/interactive-demos/consensus-game/', label: 'Consensus Game' },
      { href: '/interactive-demos/mining-simulator/', label: 'Mining Simulator' },
    ],
    'entrepreneur': [
      { href: '/interactive-demos/lightning-lab.html', label: 'Accept Bitcoin (Lightning)' },
      { href: '/interactive-demos/transaction-builder/', label: 'Cut Payment Fees' },
      { href: '/deep-dives/sovereign-tools/', label: 'Sovereign Tools' },
    ],
    'retiree': [
      { href: '/deep-dives/philosophy-economics/', label: 'Protect Savings' },
      { href: '/deep-dives/first-principles/', label: 'Bitcoin MVP' },
      { href: '/interactive-demos/wallet-security-workshop/', label: 'Safe Wallet Setup' },
    ],
    'global': [
      { href: '/interactive-demos/lightning-lab.html', label: 'Send Money Abroad' },
      { href: '/interactive-demos/consensus-game/', label: 'Why Decentralization Matters' },
      { href: '/deep-dives/first-principles/', label: 'Bitcoin MVP' },
    ],
    'global-citizen': [
      { href: '/interactive-demos/lightning-lab.html', label: 'Send Money Abroad' },
      { href: '/interactive-demos/consensus-game/', label: 'Why Decentralization Matters' },
      { href: '/deep-dives/first-principles/', label: 'Bitcoin MVP' },
    ],
  };

  try {
    const pid = getPersonaId();
    if (map['investor']) {
      map['investor'] = [
        { href: '/deep-dives/philosophy-economics/', label: 'Philosophy & Economics' },
        ...map['investor']
      ];
    }
    if (map['skeptic']) {
      map['skeptic'] = [
        { href: '/deep-dives/philosophy-economics/', label: 'Why Bitcoin Matters' },
        ...map['skeptic']
      ];
    }

    const chips = (pid && map[pid]) ? map[pid] : defaults;
    render(chips);
  } catch {
    render(defaults);
  }
})();

(function () {
  function updateHomepageHeroCopy() {
    const title = document.querySelector('.hero-sovereign__title');
    const subtitle = document.querySelector('.hero-sovereign__sub');

    if (title) {
      title.innerHTML = 'Bitcoin education,<br>without the confusion.';
      title.setAttribute('aria-label', 'Bitcoin education, without the confusion.');
    }

    if (subtitle) {
      subtitle.textContent = 'Interactive lessons for understanding money, Bitcoin, self custody, recovery, inheritance, privacy, and security before mistakes become expensive.';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHomepageHeroCopy);
  } else {
    updateHomepageHeroCopy();
  }
})();
