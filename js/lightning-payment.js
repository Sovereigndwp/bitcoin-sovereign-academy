(function () {
  'use strict';

  const MEMBERSHIP_KEY = 'bsa-membership';
  const COMPLETED_KEY = 'bsa-completed-modules';
  const EARNED_KEY = 'bsa-earned-sats';
  const APPRENTICE_DEPOSIT = 50000;
  const REFUND_PERCENTAGE = 0.80;

  function getMembership() {
    try {
      const data = localStorage.getItem(MEMBERSHIP_KEY);
      return data ? JSON.parse(data) : { tier: 'explorer', activated: null };
    } catch {
      return { tier: 'explorer', activated: null };
    }
  }

  function getCompletedModules() {
    try {
      const data = localStorage.getItem(COMPLETED_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function getEarnedSats() {
    return parseInt(localStorage.getItem(EARNED_KEY) || '0', 10);
  }

  function getTotalModules() {
    return 20;
  }

  function getRefundProgress() {
    const membership = getMembership();
    if (membership.tier !== 'apprentice') return null;
    const completed = getCompletedModules().length;
    const total = getTotalModules();
    const maxRefund = Math.floor(APPRENTICE_DEPOSIT * REFUND_PERCENTAGE);
    const earned = getEarnedSats();
    return {
      completedModules: completed,
      totalModules: total,
      percentComplete: Math.round((completed / total) * 100),
      earnedSats: earned,
      maxRefund,
      remainingToEarn: maxRefund - earned
    };
  }

  function completeModule(moduleId) {
    const completed = getCompletedModules();
    if (!completed.includes(moduleId)) {
      completed.push(moduleId);
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
      const earnedPerModule = Math.floor((APPRENTICE_DEPOSIT * REFUND_PERCENTAGE) / getTotalModules());
      localStorage.setItem(EARNED_KEY, String(getEarnedSats() + earnedPerModule));
      window.dispatchEvent(new CustomEvent('moduleCompleted', {
        detail: { moduleId, earnedSats: earnedPerModule }
      }));
    }
  }

  window.lightningPayment = {
    getMembership,
    hasPremiumAccess: function () {
      const membership = getMembership();
      return membership.tier === 'apprentice' || membership.tier === 'sovereign';
    },
    getRefundProgress,
    getCompletedModules,
    getEarnedSats,
    getTotalModules,
    completeModule,
    stopPolling: function () {},
    createApprenticeInvoice: async function () {
      throw new Error('Lightning checkout now uses BTCPay Server.');
    },
    generateQRCode: async function () { return ''; },
    waitForPayment: async function () {
      throw new Error('Lightning checkout now uses BTCPay Server.');
    },
    confirmPaymentManually: function () {
      return { success: false, error: 'Manual confirmation is disabled. Use the Bitcoin or Lightning checkout button.' };
    }
  };

  window.BSA_PAYMENT_CONFIG = {
    apprenticeDeposit: APPRENTICE_DEPOSIT,
    refundPercentage: REFUND_PERCENTAGE,
    storageKeys: {
      membership: MEMBERSHIP_KEY,
      completedModules: COMPLETED_KEY,
      earnedSats: EARNED_KEY
    }
  };

  function loadMembershipBTCPay() {
    if (document.querySelector('script[src="/js/membership-btcpay.js"]')) return;
    const script = document.createElement('script');
    script.src = '/js/membership-btcpay.js';
    script.defer = true;
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMembershipBTCPay);
  } else {
    loadMembershipBTCPay();
  }
})();
