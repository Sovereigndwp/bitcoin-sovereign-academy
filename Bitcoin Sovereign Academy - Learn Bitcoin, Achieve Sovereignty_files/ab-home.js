(function(){
  const isDataFirst = location.hash.includes('ab=data-first');
  const data = document.getElementById('bitcoin-data');
  const tutors = document.getElementById('agents');
  if (!data || !tutors) return;
  const parent = data.parentElement && data.parentElement.parentElement ? data.parentElement.parentElement : data.parentElement || document.body;
  // Ensure both are siblings of the same parent; if not, default to body order
  try {
    if (isDataFirst) {
      parent.insertBefore(data, tutors);
    } else {
      parent.insertBefore(tutors, data);
    }
  } catch {}

  // Minimal click tracking hook (console only; integrate with Plausible if desired)
  window.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    try { console.log('track:click', { href: a.getAttribute('href'), ab: isDataFirst ? 'data-first' : 'experience-first' }); } catch {}
  });
})();
