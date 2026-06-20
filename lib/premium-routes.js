const PREMIUM_PATH_IDS = Object.freeze([
  'builder',
  'curious',
  'hurried',
  'pragmatist',
  'principled',
  'sovereign'
]);


function stripQueryAndHash(pathname) {
  return pathname.split('?')[0].split('#')[0];
}

export function normalizePathname(pathname = '/') {
  const rawPathname = typeof pathname === 'string' && pathname.length > 0 ? pathname : '/';
  let normalized = stripQueryAndHash(rawPathname).trim();

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  normalized = normalized.replace(/\/{2,}/g, '/');

  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized || '/';
}

function isStageOneFreeModule(segment) {
  return segment === 'module-1' || segment === 'module-1.html';
}

function isProtectedStageOneModule(segment) {
  return segment.startsWith('module-') && !isStageOneFreeModule(segment);
}

export function getProtectedRouteDetails(inputPathname) {
  const pathname = normalizePathname(inputPathname);

  if (
    pathname === '/deep-dives/rules-under-the-game' ||
    pathname.startsWith('/deep-dives/rules-under-the-game/')
  ) {
    return {
      protected: false,
      pathname,
      area: 'deep-dive',
      pathId: null,
      reason: 'rules-under-the-game-free'
    };
  }

  if (
    pathname === '/deep-dives' ||
    pathname === '/deep-dives/index.html' ||
    pathname.startsWith('/deep-dives/')
  ) {
    return {
      protected: true,
      pathname,
      area: 'deep-dive',
      pathId: null,
      reason: 'deep-dives'
    };
  }

  if (!pathname.startsWith('/paths/')) {
    return {
      protected: false,
      pathname,
      area: null,
      pathId: null,
      reason: 'outside-premium-scope'
    };
  }

  // Learning paths are free — education-first model; revenue comes from kits
  // + advisory, not from gating lessons (decided 2026-06-15). Only the
  // standalone /deep-dives/ section stays gated (handled above), keeping the
  // paths an open funnel toward the products.
  const segments = pathname.split('/').filter(Boolean);
  const pathId = segments[1] || null;
  return {
    protected: false,
    pathname,
    area: 'path',
    pathId,
    reason: 'paths-free'
  };
}

export function isProtectedPremiumRoute(inputPathname) {
  return getProtectedRouteDetails(inputPathname).protected;
}

export function getPremiumPathIds() {
  return [...PREMIUM_PATH_IDS];
}
