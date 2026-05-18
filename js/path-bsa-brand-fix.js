document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('bsa-path-brand-fix-link')) return;
  var path = document.location.pathname;
  if (path.indexOf('/paths/') !== 0) return;

  var link = document.createElement('link');
  link.id = 'bsa-path-brand-fix-link';
  link.rel = 'stylesheet';
  link.href = '/css/path-bsa-brand-fix.css';
  document.head.appendChild(link);
});
