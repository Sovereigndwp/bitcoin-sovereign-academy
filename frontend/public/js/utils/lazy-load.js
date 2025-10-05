/**
 * Lazy Loading Utility
 * Implements Intersection Observer for images and iframes
 */

class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0.01,
      ...options
    };

    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        this.options
      );

      this.observeElements();
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadAllImmediate();
    }
  }

  observeElements() {
    // Observe images with loading="lazy" attribute
    const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        this.observer.observe(img);
      }
    });

    // Observe iframes with loading="lazy" attribute
    const lazyIframes = document.querySelectorAll('iframe[loading="lazy"], iframe[data-src]');
    lazyIframes.forEach(iframe => {
      if (iframe.dataset.src) {
        this.observer.observe(iframe);
      }
    });

    // Observe background images
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    lazyBackgrounds.forEach(el => this.observer.observe(el));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadElement(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  loadElement(element) {
    if (element.tagName === 'IMG') {
      this.loadImage(element);
    } else if (element.tagName === 'IFRAME') {
      this.loadIframe(element);
    } else if (element.dataset.bg) {
      this.loadBackground(element);
    }
  }

  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
    }

    if (srcset) {
      img.srcset = srcset;
      img.removeAttribute('data-srcset');
    }

    img.addEventListener('load', () => {
      img.classList.add('loaded');
      img.classList.remove('loading');
    });

    img.addEventListener('error', () => {
      img.classList.add('error');
      img.classList.remove('loading');
    });

    img.classList.add('loading');
  }

  loadIframe(iframe) {
    const src = iframe.dataset.src;

    if (src) {
      iframe.src = src;
      iframe.removeAttribute('data-src');
    }

    iframe.addEventListener('load', () => {
      iframe.classList.add('loaded');
    });
  }

  loadBackground(element) {
    const bg = element.dataset.bg;

    if (bg) {
      element.style.backgroundImage = `url(${bg})`;
      element.removeAttribute('data-bg');
      element.classList.add('bg-loaded');
    }
  }

  loadAllImmediate() {
    // Fallback: load all images immediately
    const allLazyElements = document.querySelectorAll('[data-src], [data-bg]');
    allLazyElements.forEach(el => this.loadElement(el));
  }

  // Public method to add new elements to observe
  observe(element) {
    if (this.observer) {
      this.observer.observe(element);
    } else {
      this.loadElement(element);
    }
  }

  // Public method to disconnect observer
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.lazyLoader = new LazyLoader();
    });
  } else {
    window.lazyLoader = new LazyLoader();
  }
}

export default LazyLoader;
