(function () {
  var meetingUrl = 'https://meetings.hubspot.com/dalia-platt';
  var contactEmail = 'thesovereign.academy@proton.me';
  var contactHref = 'mailto:' + contactEmail;
  var meetingPatterns = [
    'calendly.com',
    'meetings.hubspot.com',
    'thebitcoinadviser.com/dalia'
  ];
  var emailPattern = /mailto:|dalia@thebitcoinadviser\.com|sponsor|sponsorship|contact/i;

  function looksLikeMeeting(link) {
    var href = (link.getAttribute('href') || '').toLowerCase();
    var text = (link.textContent || '').toLowerCase();
    return meetingPatterns.some(function (pattern) { return href.indexOf(pattern) !== -1; }) ||
      /schedule|book|meeting|consultation|call|pick a time/.test(text);
  }

  function looksLikeContact(link) {
    var href = link.getAttribute('href') || '';
    var text = link.textContent || '';
    return emailPattern.test(href) || /contact|inquiry|inquiries|sponsor|sponsorship/.test(text.toLowerCase());
  }

  function normalizeLinks() {
    document.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (looksLikeMeeting(link)) {
        link.setAttribute('href', meetingUrl);
        return;
      }
      if (href.indexOf('mailto:') === 0 || looksLikeContact(link)) {
        link.setAttribute('href', contactHref);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normalizeLinks);
  } else {
    normalizeLinks();
  }
})();
