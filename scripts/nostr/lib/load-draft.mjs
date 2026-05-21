// Convert a draft JSON object into an unsigned Nostr event template.
//
// Kind 1 (short note): the body becomes the event content. Tags include
// "t" entries for each draft tag, "r" entries for each link.
//
// Kind 30023 (long form): includes a "d" tag (slug), "title", "summary",
// "published_at".

export function draftToEventTemplate(draft) {
  const tags = [];

  for (const t of draft.tags || []) {
    if (typeof t === 'string' && t.length) tags.push(['t', t.toLowerCase()]);
  }

  for (const url of draft.links || []) {
    tags.push(['r', url]);
  }

  // Identify BSA-origin posts for our own indexing (does not affect display)
  tags.push(['client', 'bsa-nostr-automation', 'v1']);

  if (draft.kind === 30023) {
    tags.push(['d', draft.slug]);
    if (draft.title) tags.push(['title', draft.title]);
    if (draft.summary) tags.push(['summary', draft.summary]);
    if (draft.image) tags.push(['image', draft.image]);
    const publishedAt = draft.published_at
      ? Math.floor(new Date(draft.published_at).getTime() / 1000)
      : Math.floor(Date.now() / 1000);
    tags.push(['published_at', String(publishedAt)]);
  }

  if (draft.lang) tags.push(['L', 'ISO-639-1'], ['l', draft.lang, 'ISO-639-1']);

  return {
    kind: draft.kind || 1,
    created_at: Math.floor(Date.now() / 1000),
    content: draft.body,
    tags,
  };
}
