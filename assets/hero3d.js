/**
 * Progressive 3D hero enhancement.
 * Renders a subtle rotating coin when conditions allow,
 * otherwise falls back to the static hero layout.
 */

const container = document.getElementById('hero3d');
let fallbackEl = document.getElementById('hero3d-fallback');

if (!container) {
  console.warn('[hero3d] container not found');
}

const prefersReduced = (typeof window !== 'undefined' && typeof window.matchMedia === 'function')
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;
const tooSmall = (typeof window !== 'undefined' && typeof window.matchMedia === 'function')
  ? window.matchMedia('(max-width: 380px)')
  : null;

let cleanup = null;
let initializing = false;

const listeners = [];

function getSkipReason() {
  if (!container) return 'Unavailable';
  if (prefersReduced?.matches) return 'Reduced motion enabled';
  if (tooSmall?.matches) return 'Lightweight mode';
  if (!webglSupported()) return 'Static mode';
  return null;
}

function webglSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (error) {
    return false;
  }
}

async function init3D() {
  if (!container) return null;

  const THREE = await import('https://unpkg.com/three@0.159.0/build/three.module.js');

  if (fallbackEl?.parentNode === container) {
    fallbackEl.remove();
  }

  const { clientWidth: width, clientHeight: height } = container;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
  camera.position.set(0, 0.45, 3.1);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.inset = '0';
  renderer.domElement.style.zIndex = '1';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.prepend(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x111111, 0.65);
  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(2.4, 2.1, 2.2);
  const rim = new THREE.DirectionalLight(0xf7931a, 0.4);
  rim.position.set(-2.5, 1.6, -2.2);
  scene.add(hemi, key, rim);

  const coinGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.12, 96);
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0xf9a84d,
    metalness: 0.92,
    roughness: 0.22,
    emissive: 0x221400,
    emissiveIntensity: 0.18
  });
  const coin = new THREE.Mesh(coinGeo, coinMat);
  coin.rotation.x = Math.PI * 0.5;
  coin.rotation.z = 0.22;
  scene.add(coin);

  const haloGeo = new THREE.PlaneGeometry(5, 5, 1, 1);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x1a1409,
    transparent: true,
    opacity: 0.65
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.position.z = -1.25;
  halo.renderOrder = -1;
  scene.add(halo);

  let raf = 0;
  let running = false;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        running = entry.isIntersecting;
        if (running) {
          loop();
        } else {
          cancelAnimationFrame(raf);
        }
      }
    },
    { threshold: 0.2 }
  );
  observer.observe(container);

  function loop() {
    coin.rotation.y += 0.006;
    coin.position.y = Math.sin(performance.now() / 1200) * 0.05;
    renderer.render(scene, camera);
    if (running) {
      raf = requestAnimationFrame(loop);
    }
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', resize);

  const teardown = (reason = 'Lightweight mode') => {
    observer.disconnect();
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    renderer.dispose();
    coinGeo.dispose();
    haloGeo.dispose();
    coinMat.dispose();
    haloMat.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
    if (fallbackEl) {
      fallbackEl.textContent = reason;
    } else {
      fallbackEl = document.createElement('div');
      fallbackEl.id = 'hero3d-fallback';
      fallbackEl.className = 'hero3d__fallback';
      fallbackEl.textContent = reason;
    }
    if (!fallbackEl.parentNode) {
      container.appendChild(fallbackEl);
    }
  };

  window.addEventListener('beforeunload', teardown, { once: true });

  return teardown;
}

async function evaluate() {
  if (!container) return;
  const reason = getSkipReason();

  if (reason) {
    if (cleanup) {
      cleanup(reason);
      cleanup = null;
    } else if (fallbackEl) {
      fallbackEl.textContent = reason;
    }
    return;
  }

  if (cleanup || initializing) return;
  initializing = true;
  try {
    cleanup = await init3D();
  } catch (error) {
    console.error('[hero3d] unable to initialise 3D hero', error);
    if (fallbackEl) {
      fallbackEl.textContent = 'Lightweight mode';
      if (!fallbackEl.parentNode && container) {
        container.appendChild(fallbackEl);
      }
    }
  } finally {
    initializing = false;
  }
}

if (container) {
  evaluate();

  if (prefersReduced?.addEventListener) {
    const handler = () => {
      if (cleanup) {
        cleanup('Reduced motion enabled');
        cleanup = null;
      }
      evaluate();
    };
    prefersReduced.addEventListener('change', handler);
    listeners.push(() => prefersReduced.removeEventListener('change', handler));
  }

  if (tooSmall?.addEventListener) {
    const handler = () => {
      if (cleanup) {
        cleanup('Lightweight mode');
        cleanup = null;
      }
      evaluate();
    };
    tooSmall.addEventListener('change', handler);
    listeners.push(() => tooSmall.removeEventListener('change', handler));
  }

  window.addEventListener('unload', () => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    listeners.forEach((off) => {
      try { off(); } catch {}
    });
  }, { once: true });
}
