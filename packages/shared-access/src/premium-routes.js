const PREMIUM_PATH_IDS = Object.freeze([
  'builder',
  'curious',
  'hurried',
  'pragmatist',
  'principled',
  'skeptic',
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

  const segments = pathname.split('/').filter(Boolean);
  const [, pathId, section, child] = segments;

  if (!PREMIUM_PATH_IDS.includes(pathId)) {
    return {
      protected: false,
      pathname,
      area: 'path',
      pathId: null,
      reason: 'unknown-path'
    };
  }

  if (section === 'capstone') {
    return {
      protected: true,
      pathname,
      area: 'path',
      pathId,
      reason: 'capstone'
    };
  }

  if (section === 'stage-1') {
    if (!child || child === 'index.html') {
      return {
        protected: false,
        pathname,
        area: 'path',
        pathId,
        reason: 'stage-1-index'
      };
    }

    if (child === 'deep-dives') {
      return {
        protected: true,
        pathname,
        area: 'path',
        pathId,
        reason: 'stage-1-deep-dive'
      };
    }

    if (isProtectedStageOneModule(child)) {
      return {
        protected: true,
        pathname,
        area: 'path',
        pathId,
        reason: 'stage-1-premium-module'
      };
    }

    return {
      protected: false,
      pathname,
      area: 'path',
      pathId,
      reason: 'stage-1-preview'
    };
  }

  const stageMatch = /^stage-(\d+)$/.exec(section || '');
  if (stageMatch) {
    const stageNumber = Number(stageMatch[1]);
    if (Number.isFinite(stageNumber) && stageNumber >= 2) {
      return {
        protected: true,
        pathname,
        area: 'path',
        pathId,
        reason: 'stage-2-plus'
      };
    }
  }

  return {
    protected: false,
    pathname,
    area: 'path',
    pathId,
    reason: 'path-orientation'
  };
}

export function isProtectedPremiumRoute(inputPathname) {
  return getProtectedRouteDetails(inputPathname).protected;
}

export function getPremiumPathIds() {
  return [...PREMIUM_PATH_IDS];
}
