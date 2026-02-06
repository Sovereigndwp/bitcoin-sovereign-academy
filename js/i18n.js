/**
 * Internationalization (i18n) System
 * Supports English and Spanish
 */

const translations = {
  en: {
    // Navigation
    nav: {
      learn: 'Learn',
      path: 'Path',
      demos: 'Demos',
      about: 'About'
    },
    
    // Hero Section
    hero: {
      title: 'Master Bitcoin Through Experience',
      subtitle: 'From Zero to Sovereign in Your Own Time',
      description: 'Welcome to the world\'s most comprehensive Bitcoin education platform. Learn through interactive simulations, AI-powered tutors, and real-world scenarios. No fluff, no hype – just pure Bitcoin knowledge from first principles.',
      playGame: '🎮 Play SOVEREIGN Journey',
      explorePaths: '📚 Explore Learning Paths'
    },
    
    // Features
    features: {
      title: 'Interactive Learning Experiences',
      subtitle: 'Learn by doing, not just reading',
      
      sovereign: {
        title: 'SOVEREIGN Journey',
        description: 'Experience 20 years of economic history (2005-2025). Make critical decisions, learn from consequences, and discover why Bitcoin emerged from the 2008 crisis.',
        badge: 'PLAY NOW'
      },
      
      ai: {
        title: 'AI Learning Agents',
        description: 'Six specialized AI tutors guide your journey: Socratic questioning, personalized assessments, market analysis, and more.',
        badge: 'BETA'
      },
      
      analytics: {
        title: 'On-Chain Analytics',
        description: 'Real-time Bitcoin metrics, MVRV ratios, NUPL indicators, and network statistics. Understand Bitcoin through data.',
        badge: 'BETA'
      },
      
      lightning: {
        title: 'Lightning Lab',
        description: 'Interactive Lightning Network simulator. Understand channels, routing, and instant payments.',
        badge: 'COMING SOON'
      },
      
      security: {
        title: 'Security Training Lab',
        description: 'Train through hands-on security stations: phishing defense, backup drills, and hardware wallet masterclass.',
        badge: 'COMING SOON'
      },
      
      utxo: {
        title: 'UTXO Visualizer',
        description: 'See how Bitcoin really works under the hood. Interactive UTXO management and transaction construction.',
        badge: 'COMING SOON'
      }
    },
    
    // Learning Path
    path: {
      title: 'Your Path to Sovereignty',
      subtitle: 'A structured journey from curiosity to confidence',
      
      steps: {
        foundation: {
          title: 'Foundation',
          description: 'Understand money, banking, and why the current system is broken. Learn the problems Bitcoin solves.'
        },
        basics: {
          title: 'Bitcoin Basics',
          description: 'How Bitcoin works, blockchain fundamentals, wallets, and your first transactions.'
        },
        deeper: {
          title: 'Going Deeper',
          description: 'UTXOs, mining, consensus, and the technical architecture that makes Bitcoin unstoppable.'
        },
        custody: {
          title: 'Self-Custody',
          description: 'Hardware wallets, multi-sig, backup strategies, and becoming your own bank.'
        },
        advanced: {
          title: 'Advanced Topics',
          description: 'Lightning Network, running nodes, privacy techniques, and contributing to Bitcoin.'
        }
      }
    },
    
    // Footer
    footer: {
      about: {
        title: 'About Bitcoin Sovereign Academy',
        description: 'We\'re building the most comprehensive Bitcoin education platform in the world. Our mission is simple: help everyone understand Bitcoin from first principles and achieve financial sovereignty.'
      },
      learn: 'Learn',
      community: 'Community',
      resources: 'Resources',
      copyright: '© 2025 Bitcoin Sovereign Academy. Educational content only, not financial advice.',
      quote: '"Get your Bitcoin off exchanges. Not your knowledge, not your sovereignty."'
    },
    
    // Stats
    stats: {
      yearsHistory: 'Years of History',
      aiTutors: 'AI Tutors',
      lessons: 'Lessons',
      available: 'Available'
    }
  },
  
  es: {
    // Navegación
    nav: {
      learn: 'Aprender',
      path: 'Camino',
      demos: 'Demos',
      about: 'Acerca'
    },
    
    // Sección Hero
    hero: {
      title: 'Domina Bitcoin a Través de la Experiencia',
      subtitle: 'De Cero a Soberano a Tu Propio Ritmo',
      description: 'Bienvenido a la plataforma de educación Bitcoin más completa del mundo. Aprende a través de simulaciones interactivas, tutores con IA y escenarios del mundo real. Sin relleno, sin exageraciones – solo conocimiento puro de Bitcoin desde los primeros principios.',
      playGame: '🎮 Jugar Viaje SOBERANO',
      explorePaths: '📚 Explorar Rutas de Aprendizaje'
    },
    
    // Características
    features: {
      title: 'Experiencias de Aprendizaje Interactivo',
      subtitle: 'Aprende haciendo, no solo leyendo',
      
      sovereign: {
        title: 'Viaje SOBERANO',
        description: 'Experimenta 20 años de historia económica (2005-2025). Toma decisiones críticas, aprende de las consecuencias y descubre por qué Bitcoin surgió de la crisis de 2008.',
        badge: 'JUGAR AHORA'
      },
      
      ai: {
        title: 'Agentes de Aprendizaje IA',
        description: 'Seis tutores especializados de IA guían tu viaje: cuestionamiento socrático, evaluaciones personalizadas, análisis de mercado y más.',
        badge: 'BETA'
      },
      
      analytics: {
        title: 'Análisis On-Chain',
        description: 'Métricas de Bitcoin en tiempo real, ratios MVRV, indicadores NUPL y estadísticas de red. Entiende Bitcoin a través de datos.',
        badge: 'BETA'
      },
      
      lightning: {
        title: 'Laboratorio Lightning',
        description: 'Simulador interactivo de Lightning Network. Comprende los canales, el enrutamiento y los pagos instantáneos.',
        badge: 'PRÓXIMAMENTE'
      },
      
      security: {
        title: 'Dojo de Seguridad',
        description: 'Domina la autocustodia, configuraciones multi-sig y seguridad operacional a través de simulaciones seguras.',
        badge: 'PRÓXIMAMENTE'
      },
      
      utxo: {
        title: 'Visualizador UTXO',
        description: 'Ve cómo funciona Bitcoin realmente bajo el capó. Gestión interactiva de UTXO y construcción de transacciones.',
        badge: 'PRÓXIMAMENTE'
      }
    },
    
    // Ruta de Aprendizaje
    path: {
      title: 'Tu Camino hacia la Soberanía',
      subtitle: 'Un viaje estructurado desde la curiosidad hasta la confianza',
      
      steps: {
        foundation: {
          title: 'Fundamentos',
          description: 'Comprende el dinero, la banca y por qué el sistema actual está roto. Aprende los problemas que Bitcoin resuelve.'
        },
        basics: {
          title: 'Básicos de Bitcoin',
          description: 'Cómo funciona Bitcoin, fundamentos de blockchain, billeteras y tus primeras transacciones.'
        },
        deeper: {
          title: 'Profundizando',
          description: 'UTXOs, minería, consenso y la arquitectura técnica que hace a Bitcoin imparable.'
        },
        custody: {
          title: 'Autocustodia',
          description: 'Billeteras de hardware, multi-sig, estrategias de respaldo y conviértete en tu propio banco.'
        },
        advanced: {
          title: 'Temas Avanzados',
          description: 'Lightning Network, ejecutar nodos, técnicas de privacidad y contribuir a Bitcoin.'
        }
      }
    },
    
    // Pie de página
    footer: {
      about: {
        title: 'Acerca de Bitcoin Sovereign Academy',
        description: 'Estamos construyendo la plataforma de educación Bitcoin más completa del mundo. Nuestra misión es simple: ayudar a todos a entender Bitcoin desde los primeros principios y lograr la soberanía financiera.'
      },
      learn: 'Aprender',
      community: 'Comunidad',
      resources: 'Recursos',
      copyright: '© 2025 Bitcoin Sovereign Academy. Solo contenido educativo, no asesoramiento financiero.',
      quote: '"No son tus llaves, no son tus monedas. No es tu conocimiento, no es tu soberanía."'
    },
    
    // Estadísticas
    stats: {
      yearsHistory: 'Años de Historia',
      aiTutors: 'Tutores IA',
      lessons: 'Lecciones',
      available: 'Disponible'
    }
  }
};

// Current language (default to English)
let currentLang = localStorage.getItem('language') || 'en';

/**
 * Get translation for a key path
 */
function t(path) {
  const keys = path.split('.');
  let value = translations[currentLang];
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value || path;
}

/**
 * Set the current language
 */
function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updatePageTranslations();
    
    // Track language change
    if (window.trackEvent) {
      window.trackEvent('LanguageChange', { language: lang });
    }
  }
}

/**
 * Update all translations on the page
 */
function updatePageTranslations() {
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
  
  // Update HTML lang attribute
  document.documentElement.lang = currentLang;
  
  // Update language selector if exists
  const langSelector = document.getElementById('language-selector');
  if (langSelector) {
    langSelector.value = currentLang;
  }
}

/**
 * Initialize i18n system
 */
function initI18n() {
  // Add language selector to page
  const selector = createLanguageSelector();
  
  // Find header or create container for selector
  const header = document.querySelector('.header-content');
  if (header) {
    const langContainer = document.createElement('div');
    langContainer.className = 'language-selector-container';
    langContainer.appendChild(selector);
    header.appendChild(langContainer);
  }
  
  // Apply initial translations
  updatePageTranslations();
}

/**
 * Create language selector element
 */
function createLanguageSelector() {
  const container = document.createElement('div');
  container.className = 'language-selector';
  container.innerHTML = `
    <select id="language-selector" onchange="setLanguage(this.value)">
      <option value="en">🇬🇧 EN</option>
      <option value="es">🇪🇸 ES</option>
    </select>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .language-selector-container {
      position: absolute;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);
    }
    
    .language-selector select {
      background: transparent;
      color: var(--primary-orange);
      border: 1px solid var(--primary-orange);
      border-radius: 20px;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .language-selector select:hover {
      background: var(--primary-orange);
      color: var(--primary-dark);
    }
    
    @media (max-width: 768px) {
      .language-selector-container {
        position: static;
        transform: none;
        margin-top: 1rem;
      }
    }
  `;
  document.head.appendChild(style);
  
  return container;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}

// Export for use in other scripts
window.i18n = {
  t,
  setLanguage,
  currentLang: () => currentLang,
  init: initI18n
};