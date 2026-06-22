/* The Rules Under the Game - shared data-driven interaction engine.
   One engine, six tools, two languages (EN, ES). No scores, no badges, no completion percentages.
   Student acts before any principle is named. No sensitive data is ever requested or stored.
   Content comes from a per-language data file. UI chrome comes from the UI table below. */
(function () {
  "use strict";

  var BASE_PATH = "/deep-dives/rules-under-the-game/data/";

  /* ---- UI chrome strings (content lives in the data files) ---- */
  var UI = {
    en: {
      langLabel: "Language", en: "English", es: "Espanol",
      previous: "Previous", next: "Next", backTo: "Back to", overview: "Overview",
      reachedEnd: "You reached the end", whereNext: "Where to go next",
      whatHappened: "What just happened", idea: "The idea: ",
      connectMoney: "Connect it to money", connectBitcoin: "Connect it to Bitcoin",
      thinkThrough: "Think it through",
      predict: "Predict", explain: "Explain", compare: "Compare",
      journalPlaceholder: "Your thoughts (optional). This stays on your device.",
      journalNote: "Optional. Nothing is sent anywhere. It is saved only in this browser, on this device.",
      loadError: "This interactive could not load. Please open this page through the site (not as a local file) so the activity can start.",
      moneyName: "Money", timeName: "Time", batteryName: "Battery",
      seeNight: "See how the night went", startOver: "Start the evening over",
      fridayInfo: "Money in dollars, time in minutes (you have three hours), battery in percent. Adding something subtracts from your budgets. Charging your phone gives battery back but costs time.",
      gained: "What you gained", gaveUp: "What you gave up", showedLater: "What showed up later",
      gaveUpSuffix: "The night only had room for so much.",
      doingNothing: "You did not add anything. Doing nothing is also a choice, and it has its own cost.",
      noScoreFriday: "There is no score here, and no grade. You protected something, you gave up something else, and the cost stayed hidden until the night was over.",
      costsPrefix: "Costs ", costsNothing: "Costs nothing", inPlan: "in your plan",
      minutes: "min", batteryUnit: "% battery",
      reasonMoney: "Not enough money left for this.", reasonTime: "Not enough time left in the evening.",
      reasonDead: "Your phone is dead. Charge it first or skip this.", reasonBattery: "Not enough battery for this.",
      pickObject: "Pick an object", pickSituation: "Pick a situation",
      valuePredictHint: "Before you reveal, make a quick prediction: how much is it worth in this situation?",
      reveal: "Reveal the reading", readingPrefix: "Reading: ",
      predictedPrefix: "You predicted ", predictClose: "Close to the reading here.",
      predictFar: "Different from the reading here.",
      noScoreValue: "There is no score. The point is the reason the situation moved the value.",
      switchRule: "Switch on a rule",
      incentivePredict: "Before you reveal: who do you think changes their behavior first under this rule?",
      guessPlaceholder: "Your guess (optional). Stays on your device.",
      runRule: "Run the rule",
      rightAway: "Right away", hiddenCost: "Hidden cost", whoBenefits: "Who benefits", whoPays: "Who pays", overTimeLabel: "Over time",
      incentiveHint: "Same students, different rule. Nobody here has to be a bad person for this to happen. The rule produced the behavior.",
      pickScenario: "Pick a scenario", adjust: "Adjust the scoreboard",
      scoreboardSays: "What the scoreboard says", actuallyHappening: "What is actually happening",
      howRespond: "How people respond", leadsTo: "What it leads to",
      scoreboardHint: "When the measure drifts, people are not being foolish. They are reading a stick that lies.",
      pumpRate: "How fast the scoreboard is pumped up", periodsLabel: "How long this goes on",
      scoreboardNum: "Scoreboard reads", actuallyThere: "Actually there", gapLabel: "Gap",
      buysLabel: "What a fixed amount buys", pctPerPeriod: "percent per period",
      unitYears: "years", unitInnings: "innings", unitRounds: "rounds",
      illustrativeNote: "Illustrative model. The base of 100 is a unit for this demo, not a real price.",
      howComputed: "How this is computed",
      howComputedBody: "Reported is 100 multiplied by (1 plus the rate) once for each period. What is actually there stays at 100. The gap is the difference.",
      band1: "The scoreboard still roughly tells the truth. People plan normally.",
      band2: "People start trusting the number over what they can see. The ones quietly falling behind do not notice yet.",
      band3: "Decisions made on the number turn out wrong. People who felt ahead can afford less than they thought.",
      band4: "The measure has stopped meaning much. People stop trusting it and look for something that holds its value.",
      chooseHolders: "Choose two or more holders, then compare them across the same six questions.",
      compareThem: "Compare them", questionCol: "Question", pickTwo: "Pick at least two holders to compare.",
      trustHint: "No holder is simply best. More control usually means more responsibility, not less risk.",
      systemA: "System A", systemB: "System B",
      systemADesc: "The supply of money can change when leaders decide.",
      systemBDesc: "The supply follows a fixed, public rule no central actor can easily change. Bitcoin is built like System B.",
      runComparison: "Run the comparison", tradeoffLabel: "Tradeoff.",
      rulelabHint: "Neither column is perfect. System B is not utopian. It moves some costs and some power around, and it asks more of the holder.",
      alsoCalled: "also called: "
    },
    es: {
      langLabel: "Idioma", en: "English", es: "Español",
      previous: "Anterior", next: "Siguiente", backTo: "Volver a", overview: "Inicio",
      reachedEnd: "Llegaste al final", whereNext: "Adónde seguir",
      whatHappened: "Qué acaba de pasar", idea: "La idea: ",
      connectMoney: "Conéctalo con el dinero", connectBitcoin: "Conéctalo con Bitcoin",
      thinkThrough: "Piénsalo a fondo",
      predict: "Predice", explain: "Explica", compare: "Compara",
      journalPlaceholder: "Tus ideas (opcional). Esto se queda en tu dispositivo.",
      journalNote: "Opcional. No se envía a ningún lado. Se guarda solo en este navegador, en este dispositivo.",
      loadError: "Esta actividad no pudo cargar. Abre esta página desde el sitio (no como archivo local) para que la actividad funcione.",
      moneyName: "Dinero", timeName: "Tiempo", batteryName: "Batería",
      seeNight: "Ver cómo salió la noche", startOver: "Empezar la noche de nuevo",
      fridayInfo: "Dinero en dólares, tiempo en minutos (tienes tres horas), batería en porcentaje. Cada cosa que agregas resta de tus recursos. Cargar el teléfono devuelve batería pero cuesta tiempo.",
      gained: "Lo que ganaste", gaveUp: "Lo que dejaste ir", showedLater: "Lo que apareció después",
      gaveUpSuffix: "La noche solo daba para cierto número de cosas.",
      doingNothing: "No agregaste nada. No hacer nada también es una decisión, y tiene su propio costo.",
      noScoreFriday: "Aquí no hay puntaje ni calificación. Protegiste algo, dejaste ir otra cosa, y el costo quedó escondido hasta que la noche terminó.",
      costsPrefix: "Cuesta ", costsNothing: "No cuesta nada", inPlan: "en tu plan",
      minutes: "min", batteryUnit: "% batería",
      reasonMoney: "No te queda suficiente dinero para esto.", reasonTime: "No te queda suficiente tiempo en la noche.",
      reasonDead: "Tu teléfono está sin batería. Cárgalo primero o sáltate esto.", reasonBattery: "No hay suficiente batería para esto.",
      pickObject: "Elige un objeto", pickSituation: "Elige una situación",
      valuePredictHint: "Antes de revelar, haz una predicción rápida: ¿cuánto vale en esta situación?",
      reveal: "Revelar la lectura", readingPrefix: "Lectura: ",
      predictedPrefix: "Predijiste ", predictClose: "Cerca de la lectura aquí.",
      predictFar: "Distinto de la lectura aquí.",
      noScoreValue: "No hay puntaje. Lo importante es la razón por la que la situación movió el valor.",
      switchRule: "Activa una regla",
      incentivePredict: "Antes de revelar: ¿quién crees que cambia su comportamiento primero con esta regla?",
      guessPlaceholder: "Tu predicción (opcional). Se queda en tu dispositivo.",
      runRule: "Aplicar la regla",
      rightAway: "De inmediato", hiddenCost: "Costo oculto", whoBenefits: "Quién gana", whoPays: "Quién paga", overTimeLabel: "Con el tiempo",
      incentiveHint: "Los mismos estudiantes, otra regla. Nadie aquí tiene que ser una mala persona para que esto pase. La regla produjo el comportamiento.",
      pickScenario: "Elige un escenario", adjust: "Ajustar el marcador",
      scoreboardSays: "Lo que dice el marcador", actuallyHappening: "Lo que realmente pasa",
      howRespond: "Cómo responde la gente", leadsTo: "A qué lleva",
      scoreboardHint: "Cuando la medida se desvía, la gente no es tonta. Está leyendo una regla que miente.",
      pumpRate: "Qué tan rápido se infla el marcador", periodsLabel: "Cuánto tiempo dura esto",
      scoreboardNum: "El marcador marca", actuallyThere: "Lo que de verdad hay", gapLabel: "Brecha",
      buysLabel: "Lo que alcanza a comprar una cantidad fija", pctPerPeriod: "por ciento por periodo",
      unitYears: "años", unitInnings: "entradas", unitRounds: "rondas",
      illustrativeNote: "Modelo ilustrativo. La base de 100 es una unidad para esta demostración, no un precio real.",
      howComputed: "Cómo se calcula",
      howComputedBody: "Lo reportado es 100 multiplicado por (1 más la tasa) una vez por cada periodo. Lo que de verdad hay se queda en 100. La brecha es la diferencia.",
      band1: "El marcador todavía dice más o menos la verdad. La gente planea normal.",
      band2: "La gente empieza a creerle al número más que a lo que ve. Los que se están quedando atrás todavía no lo notan.",
      band3: "Las decisiones tomadas según el número salen mal. Quienes se sentían adelante pueden comprar menos de lo que creían.",
      band4: "La medida ya casi no significa nada. La gente deja de confiar en ella y busca algo que conserve su valor.",
      chooseHolders: "Elige dos o más guardianes y compáralos con las mismas seis preguntas.",
      compareThem: "Compararlos", questionCol: "Pregunta", pickTwo: "Elige al menos dos guardianes para comparar.",
      trustHint: "Ningún guardián es simplemente el mejor. Más control suele significar más responsabilidad, no menos riesgo.",
      systemA: "Sistema A", systemB: "Sistema B",
      systemADesc: "La cantidad de dinero puede cambiar cuando los líderes lo deciden.",
      systemBDesc: "La cantidad sigue una regla fija y pública que ningún actor central puede cambiar fácilmente. Bitcoin está hecho como el Sistema B.",
      runComparison: "Ver la comparación", tradeoffLabel: "Contrapartida.",
      rulelabHint: "Ninguna columna es perfecta. El Sistema B no es utópico. Mueve algunos costos y algo de poder, y le pide más al que guarda.",
      alsoCalled: "también llamado: "
    }
  };

  var LANG = detectLang();
  var T = UI[LANG];
  var DATA = null;

  function detectLang() {
    try {
      var q = new URLSearchParams(window.location.search).get("lang");
      if (q === "es" || q === "en") { try { localStorage.setItem("rutg_lang", q); } catch (e) {} return q; }
      var s = localStorage.getItem("rutg_lang");
      if (s === "es" || s === "en") return s;
    } catch (e) {}
    var hl = (document.documentElement.lang || "").slice(0, 2).toLowerCase();
    return hl === "es" ? "es" : "en";
  }

  function elt(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function byId(id) { return document.getElementById(id); }

  /* ---- local-only journal (non-identifying, this device only) ---- */
  var JKEY = "rutg_journal";
  function loadJournal() { try { return JSON.parse(localStorage.getItem(JKEY) || "{}"); } catch (e) { return {}; } }
  function saveJournal(k, v) { try { var j = loadJournal(); j[k] = v; localStorage.setItem(JKEY, JSON.stringify(j)); } catch (e) {} }

  var started = false;
  function boot() {
    if (started) return;
    started = true;
    document.documentElement.lang = LANG;
    var mod = byId("rutg-module");
    var hub = byId("rutg-hub");
    if (!mod && !hub) return;
    var url = BASE_PATH + (LANG === "es" ? "rules-under-the-game.es.json" : "rules-under-the-game.json");
    fetch(url, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("load"); return r.json(); })
      .then(function (d) {
        DATA = d;
        if (mod) renderModule(mod);
        if (hub) renderHub(hub);
      })
      .catch(function () {
        var t = mod || hub;
        if (t) t.innerHTML = '<div class="panel"><strong>' + esc(T.loadError) + "</strong></div>";
      });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* ---- language toggle ---- */
  function langToggle() {
    var wrap = elt("div", "langbar");
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", T.langLabel);
    [["en", T.en], ["es", T.es]].forEach(function (pair) {
      var b = elt("button", "langbtn" + (pair[0] === LANG ? " on" : ""));
      b.type = "button";
      b.textContent = pair[1];
      b.setAttribute("aria-pressed", pair[0] === LANG ? "true" : "false");
      b.setAttribute("lang", pair[0]);
      if (pair[0] !== LANG) {
        b.addEventListener("click", function () {
          try { localStorage.setItem("rutg_lang", pair[0]); } catch (e) {}
          var u = new URL(window.location.href);
          u.searchParams.set("lang", pair[0]);
          window.location.href = u.toString();
        });
      }
      wrap.appendChild(b);
    });
    return wrap;
  }

  function prefersReduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  /* =========================================================
     MODULE PAGE
     ========================================================= */
  function renderModule(mount) {
    var num = parseInt(mount.getAttribute("data-module"), 10);
    var m = null;
    for (var i = 0; i < DATA.modules.length; i++) if (DATA.modules[i].num === num) m = DATA.modules[i];
    if (!m) return;
    document.title = m.title + " | The Rules Under the Game";
    mount.innerHTML = "";
    mount.appendChild(langToggle());

    var dots = elt("div", "progress-dots");
    DATA.modules.forEach(function (x) {
      var s = elt("span", x.num === num ? "on" : "");
      s.setAttribute("aria-hidden", "true");
      dots.appendChild(s);
    });
    mount.appendChild(dots);

    mount.appendChild(elt("div", "eyebrow", esc(m.eyebrow)));
    mount.appendChild(elt("h1", null, esc(m.title)));
    mount.appendChild(elt("p", "question", esc(m.core_question)));

    var scen = elt("div", "panel scenario");
    scen.appendChild(elt("p", null, esc(m.hook)));
    if (m.instruction) scen.appendChild(elt("p", "hint", esc(m.instruction)));
    mount.appendChild(scen);

    mount.appendChild(reflectBlock("predict", T.predict, m.reflection.predict, m.id));

    var tool = elt("div", "tool");
    var toolBody = elt("div");
    tool.appendChild(toolBody);
    mount.appendChild(tool);

    var lesson = elt("section", "lesson");
    lesson.hidden = true;
    lesson.setAttribute("aria-live", "polite");
    var pattern = elt("div", "pattern");
    pattern.appendChild(elt("h3", null, esc(T.whatHappened)));
    pattern.appendChild(elt("p", null, esc(m.pattern || "")));
    lesson.appendChild(pattern);

    var concept = elt("div", "panel concept");
    concept.appendChild(elt("span", "name", esc(T.idea) + esc(m.concept_name)));
    concept.appendChild(elt("p", null, esc(m.concept_text)));
    lesson.appendChild(concept);

    if (m.money_connection) {
      var mc = elt("div", null);
      mc.appendChild(elt("h3", null, esc(T.connectMoney)));
      mc.appendChild(elt("p", null, esc(m.money_connection)));
      lesson.appendChild(mc);
    }
    if (m.bitcoin_connection) {
      var bc = elt("div", null);
      bc.appendChild(elt("h3", null, esc(T.connectBitcoin)));
      bc.appendChild(elt("p", null, esc(m.bitcoin_connection)));
      lesson.appendChild(bc);
    }
    lesson.appendChild(elt("p", "takeaway", esc(m.exit_takeaway)));

    var reflectLate = elt("div", "reflect");
    reflectLate.appendChild(elt("h3", null, esc(T.thinkThrough)));
    reflectLate.appendChild(reflectBlock("explain", T.explain, m.reflection.explain, m.id));
    reflectLate.appendChild(reflectBlock("compare", T.compare, m.reflection.compare, m.id));
    lesson.appendChild(reflectLate);

    mount.appendChild(lesson);

    function reveal() {
      if (!lesson.hidden) return;
      lesson.hidden = false;
      if (typeof lesson.scrollIntoView === "function") {
        lesson.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "nearest" });
      }
    }

    if (window.BSAInteractive) {
      window.BSAInteractive.mount(toolBody, { tool: m.tool, spec: specFor(m.tool), t: T, onComplete: reveal });
    } else {
      toolBody.appendChild(elt("div", "panel", "<strong>" + esc(T.loadError) + "</strong>"));
    }

    mount.appendChild(moduleNav(num));
  }

  /* Map a tool id to the slice of DATA it needs (decouples the shared library
     from this deep dive's full data shape). */
  function specFor(tool) {
    switch (tool) {
      case "friday-night": return { activities: DATA.activities, consequences: DATA.friday_consequences, base: { money: 20, time: 180, battery: 40 } };
      case "value-swap": return { matrix: DATA.value_matrix };
      case "incentive-machine": return { rules: DATA.incentive_rules };
      case "broken-scoreboard": return { scenarios: DATA.scoreboard_scenarios };
      case "trust-map": return { custodians: DATA.trust_custodians, questions: DATA.trust_questions, highlight: { custodian: "self_keys", question: "lose" } };
      case "rule-change-lab": return { dimensions: DATA.rule_change_dimensions };
      default: return null;
    }
  }

  function moduleNav(num) {
    var nav = elt("nav", "modnav");
    nav.setAttribute("aria-label", "Module navigation");
    if (num > 1) {
      var a = elt("a", "prev");
      a.href = "module-" + (num - 1) + ".html" + langQuery();
      a.innerHTML = '<span class="nk">' + esc(T.previous) + '</span><span class="nt">' + esc(DATA.modules[num - 2].title) + "</span>";
      nav.appendChild(a);
    } else {
      var h = elt("a", "prev");
      h.href = "index.html" + langQuery();
      h.innerHTML = '<span class="nk">' + esc(T.backTo) + '</span><span class="nt">' + esc(T.overview) + "</span>";
      nav.appendChild(h);
    }
    if (num < DATA.modules.length) {
      var n = elt("a", "next");
      n.href = "module-" + (num + 1) + ".html" + langQuery();
      n.innerHTML = '<span class="nk">' + esc(T.next) + '</span><span class="nt">' + esc(DATA.modules[num].title) + "</span>";
      nav.appendChild(n);
    } else {
      var f = elt("a", "next");
      f.href = "index.html" + langQuery() + "#next-steps";
      f.innerHTML = '<span class="nk">' + esc(T.reachedEnd) + '</span><span class="nt">' + esc(T.whereNext) + "</span>";
      nav.appendChild(f);
    }
    return nav;
  }
  function langQuery() { return LANG === "es" ? "?lang=es" : ""; }

  function reflectBlock(kind, label, text, modId) {
    var wrap = elt("div", "rprompt");
    wrap.appendChild(elt("span", "rk", esc(label)));
    wrap.appendChild(elt("p", null, esc(text)));
    var key = modId + "_" + kind + "_" + LANG;
    var ta = elt("textarea");
    ta.setAttribute("aria-label", label);
    ta.placeholder = T.journalPlaceholder;
    var j = loadJournal();
    if (j[key]) ta.value = j[key];
    var t;
    ta.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { saveJournal(key, ta.value); }, 400); });
    wrap.appendChild(ta);
    wrap.appendChild(elt("div", "journal-note", esc(T.journalNote)));
    return wrap;
  }

  /* The six tool renderers now live in the shared library:
     /js/interactive-tools/interactive-tools.js (BSAInteractive.mount). */

  /* =========================================================
     HUB PAGE (index) - copy comes from DATA.hub
     ========================================================= */
  function renderHub(mount) {
    var h = DATA.hub || {};
    mount.innerHTML = "";
    mount.appendChild(langToggle());
    mount.appendChild(elt("div", "eyebrow", esc(h.eyebrow)));
    var h1 = elt("h1");
    h1.innerHTML = esc(h.title_lead) + ' <span class="accent">' + esc(h.title_accent) + "</span>";
    mount.appendChild(h1);
    mount.appendChild(elt("p", "lede", esc(h.lede)));

    var start = elt("div", "panel scenario");
    start.innerHTML = "<p><strong>" + esc(h.start_label) + "</strong> " + esc(h.start_text) + "</p>";
    mount.appendChild(start);

    var how = elt("div", "note");
    how.innerHTML = "<strong>" + esc(h.how_label) + "</strong> " + esc(h.how_text);
    mount.appendChild(how);

    mount.appendChild(elt("h2", null, esc(h.modules_heading)));
    var cards = elt("div", "modcards");
    DATA.modules.forEach(function (m) {
      var a = elt("a", "modcard"); a.href = m.slug + ".html" + langQuery();
      a.innerHTML = '<span class="num">' + esc(h.module_word) + " " + m.num + "</span>" +
        '<span class="mt">' + esc(m.title) + "</span>" +
        '<span class="mq">' + esc(m.core_question) + "</span>";
      cards.appendChild(a);
    });
    mount.appendChild(cards);

    mount.appendChild(elt("h2", null, esc(h.glossary_heading)));
    mount.appendChild(elt("p", null, esc(h.glossary_intro)));
    var gloss = elt("div", "glossary");
    DATA.concepts.forEach(function (c) {
      var g = elt("div", "gitem");
      g.innerHTML = '<span class="gteen">' + esc(c.teen) + "</span>" +
        '<span class="gadult">' + esc(T.alsoCalled) + esc(c.adult) + "</span>" +
        '<span class="gmean">' + esc(c.meaning) + "</span>";
      gloss.appendChild(g);
    });
    mount.appendChild(gloss);

    mount.appendChild(elt("h2", null, esc(h.misconception_heading)));
    mount.appendChild(elt("p", null, esc(h.misconception_intro)));
    var mis = elt("div");
    DATA.misconceptions.forEach(function (x) {
      var c = elt("div", "miscard");
      var think = elt("p", "think");
      think.innerHTML = '<span class="think-pre">' + esc(h.think_prefix) + " </span>" + esc(x.think);
      c.appendChild(think);
      var dl = document.createElement("dl");
      [[h.label_feels, x.feels_true], [h.label_missing, x.missing], [h.label_better, x.better], [h.label_example, x.example]].forEach(function (pair) {
        dl.appendChild(elt("dt", null, esc(pair[0])));
        dl.appendChild(elt("dd", null, esc(pair[1])));
      });
      c.appendChild(dl); mis.appendChild(c);
    });
    mount.appendChild(mis);

    mount.appendChild(elt("h2", null, esc(h.synthesis_heading)));
    var syn = elt("div", "panel");
    (h.synthesis_paragraphs || []).forEach(function (p) { syn.appendChild(elt("p", null, p)); });
    mount.appendChild(syn);

    var nsH = elt("h2", null, esc(h.next_heading)); nsH.id = "next-steps";
    mount.appendChild(nsH);
    mount.appendChild(elt("p", null, esc(h.next_intro)));
    var ul = elt("ul", "ns-list");
    DATA.next_steps.forEach(function (s) {
      var li = elt("li");
      li.innerHTML = '<a href="' + esc(s.url) + '">' + esc(s.label) + "</a> <span class=\"nsnote\">" + esc(s.note) + "</span>";
      ul.appendChild(li);
    });
    mount.appendChild(ul);

    var parent = elt("div", "note");
    parent.innerHTML = "<strong>" + esc(h.parent_label) + "</strong> " + esc(h.parent_text);
    mount.appendChild(parent);

    mount.appendChild(elt("h2", null, esc(h.reflect_heading)));
    var rw = elt("div", "reflect-widget");
    rw.setAttribute("data-topic", "money");
    rw.setAttribute("data-path", "curious");
    rw.setAttribute("data-title", h.reflect_title);
    mount.appendChild(rw);
  }
})();
