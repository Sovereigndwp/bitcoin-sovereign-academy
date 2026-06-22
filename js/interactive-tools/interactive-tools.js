/* BSA Interactive Tools - reusable choice-and-consequence widgets.
   Framework-free, no dependencies, no data loading, no i18n source of its own.
   Each tool teaches a tradeoff: the learner makes a choice and sees a consequence.
   No scores, no badges, no completion state. No sensitive data is requested or stored.

   Contract
   --------
   BSAInteractive.mount(container, {
     tool: "friday-night" | "value-swap" | "incentive-machine" |
           "broken-scoreboard" | "trust-map" | "rule-change-lab",
     spec: <tool-specific data, see README>,
     t:    <strings object with the keys the tool uses, see README>,
     onComplete: function () {}   // called when the learner finishes the core action
   });

   The tool renders into `container`, emits class names a stylesheet can target
   (ship interactive-tools.css, scope it under a wrapper class such as .bsa-int),
   and calls onComplete once so the host can reveal whatever comes next.
   No em dashes in any string this file emits. */
(function (global) {
  "use strict";

  function el(tag, cls, html) {
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
  function labeled(forId, text) {
    var l = el("label", null, esc(text));
    l.setAttribute("for", forId);
    return l;
  }
  function uid(prefix) { return prefix + "-" + Math.random().toString(36).slice(2, 8); }
  function safeNum(v, fallback) { var n = Number(v); return isFinite(n) ? n : (fallback || 0); }
  function safeInt(v, fallback) { var n = parseInt(v, 10); return isFinite(n) ? n : (fallback || 0); }

  /* ---------- Tool 1: Friday Night Simulator ----------
     spec: { activities: [...], consequences: [...], base: {money,time,battery} } */
  function fridayNight(root, spec, ctx) {
    var T = ctx.t, done = ctx.onComplete;
    var BASE = spec.base || { money: 20, time: 180, battery: 40 };
    var acts = spec.activities || [];
    var consequences = spec.consequences || [];
    var selected = {};
    var budgets = el("div", "budgets"); root.appendChild(budgets);
    root.appendChild(el("p", "hint", esc(T.fridayInfo)));
    var opts = el("div", "options");
    opts.setAttribute("role", "group");
    opts.setAttribute("aria-label", T.seeNight);
    root.appendChild(opts);
    var row = el("div", "btnrow");
    var goBtn = el("button", "btn", esc(T.seeNight)); goBtn.type = "button";
    var resetBtn = el("button", "btn ghost", esc(T.startOver)); resetBtn.type = "button";
    row.appendChild(goBtn); row.appendChild(resetBtn); root.appendChild(row);
    var out = el("div", "output"); out.setAttribute("aria-live", "polite"); root.appendChild(out);

    function remaining() {
      var r = { money: BASE.money, time: BASE.time, battery: BASE.battery };
      acts.forEach(function (a) { if (selected[a.id]) { r.money -= a.cost.money; r.time -= a.cost.time; r.battery -= a.cost.battery; } });
      if (r.battery > 100) r.battery = 100;
      return r;
    }
    function affordReason(a, rem) {
      var after = { money: rem.money - a.cost.money, time: rem.time - a.cost.time, battery: rem.battery - a.cost.battery };
      if (after.money < 0) return T.reasonMoney;
      if (after.time < 0) return T.reasonTime;
      if (a.requires && a.requires.indexOf("battery") > -1 && rem.battery <= 0) return T.reasonDead;
      if (after.battery < 0) return T.reasonBattery;
      return null;
    }
    function drawBudgets() {
      var r = remaining(); budgets.innerHTML = "";
      [["money", T.moneyName, BASE.money], ["time", T.timeName, BASE.time], ["battery", T.batteryName, 100]].forEach(function (b) {
        var key = b[0], val = r[key];
        var cls = "budget" + (val <= 0 ? " empty" : (val <= BASE[key] * 0.25 ? " low" : ""));
        var card = el("div", cls);
        card.appendChild(el("div", "bname", b[1]));
        var disp = key === "money" ? "$" + val : (key === "time" ? val + " " + T.minutes : val + "%");
        card.appendChild(el("div", "bval", disp));
        var meter = el("div", "meter"); var span = el("span");
        span.style.width = Math.max(0, Math.min(100, (val / b[2]) * 100)) + "%";
        meter.appendChild(span); card.appendChild(meter); budgets.appendChild(card);
      });
    }
    function drawOptions() {
      var r = remaining(); opts.innerHTML = "";
      acts.forEach(function (a) {
        var b = el("button", "opt"); b.type = "button";
        var on = !!selected[a.id];
        b.setAttribute("aria-pressed", on ? "true" : "false");
        var costbits = [];
        if (a.cost.money) costbits.push("$" + a.cost.money);
        if (a.cost.time) costbits.push(a.cost.time + " " + T.minutes);
        if (a.cost.battery > 0) costbits.push(a.cost.battery + T.batteryUnit);
        if (a.cost.battery < 0) costbits.push("+" + (-a.cost.battery) + T.batteryUnit);
        b.appendChild(el("span", "opt-title", esc(a.label)));
        b.appendChild(el("span", "opt-cost", costbits.length ? T.costsPrefix + costbits.join(", ") : T.costsNothing));
        b.appendChild(el("span", "opt-check", on ? "✓ " + esc(T.inPlan) : ""));
        var reason = on ? null : affordReason(a, r);
        if (reason) { b.disabled = true; b.appendChild(el("span", "opt-reason", esc(reason))); }
        b.addEventListener("click", function () { selected[a.id] = !selected[a.id]; drawBudgets(); drawOptions(); });
        opts.appendChild(b);
      });
    }
    function flagsOf() {
      var f = {};
      acts.forEach(function (a) { if (selected[a.id]) { f[a.id] = true; (a.sets_flags || []).forEach(function (fl) { f[fl] = true; }); } });
      return f;
    }
    function showResult() {
      var r = remaining(); var flags = flagsOf();
      var chosen = acts.filter(function (a) { return selected[a.id]; });
      out.innerHTML = "";
      var g = el("div", "out-block gained");
      g.appendChild(el("h4", null, esc(T.gained)));
      if (chosen.length) {
        var ul = el("ul");
        chosen.forEach(function (a) { ul.appendChild(el("li", null, esc(a.gained))); });
        g.appendChild(ul);
      } else { g.appendChild(el("p", null, esc(T.doingNothing))); }
      out.appendChild(g);
      var unsel = acts.filter(function (a) { return !selected[a.id]; }).sort(function (x, y) { return y.value_rank - x.value_rank; });
      if (unsel.length) {
        var gu = el("div", "out-block gaveup");
        gu.appendChild(el("h4", null, esc(T.gaveUp)));
        gu.appendChild(el("p", null, esc(unsel[0].gave_up) + " " + esc(T.gaveUpSuffix)));
        out.appendChild(gu);
      }
      var laters = [];
      consequences.forEach(function (c) {
        if (c.missing_flag && !flags[c.missing_flag]) laters.push(c.text);
        if (c.if_flag && flags[c.if_flag] && c.needs_min_battery_left != null && r.battery < c.needs_min_battery_left) laters.push(c.fail_text);
        if (c.if_flag && flags[c.if_flag] && c.and_no_flag && !flags[c.and_no_flag]) laters.push(c.text);
      });
      if (laters.length) {
        var lb = el("div", "out-block later");
        lb.appendChild(el("h4", null, esc(T.showedLater)));
        var ul2 = el("ul");
        laters.forEach(function (t) { ul2.appendChild(el("li", null, esc(t))); });
        lb.appendChild(ul2); out.appendChild(lb);
      }
      out.appendChild(el("p", "hint", esc(T.noScoreFriday)));
      done();
    }
    goBtn.addEventListener("click", showResult);
    resetBtn.addEventListener("click", function () { selected = {}; out.innerHTML = ""; drawBudgets(); drawOptions(); });
    drawBudgets(); drawOptions();
  }

  /* ---------- Tool 2: Value Swap Game ----------
     spec: { matrix: { objects, contexts, cells, magnitude_labels } } */
  function valueSwap(root, spec, ctx) {
    var T = ctx.t, done = ctx.onComplete;
    var vm = spec.matrix; var labels = vm.magnitude_labels;
    var objId = uid("vs-obj"), ctxId = uid("vs-ctx");
    var objField = el("div", "field");
    objField.appendChild(labeled(objId, T.pickObject));
    var objSel = el("select"); objSel.id = objId;
    vm.objects.forEach(function (o) { var op = el("option"); op.value = o.id; op.textContent = o.label; objSel.appendChild(op); });
    objField.appendChild(objSel); root.appendChild(objField);

    var ctxField = el("div", "field");
    ctxField.appendChild(labeled(ctxId, T.pickSituation));
    var ctxSel = el("select"); ctxSel.id = ctxId;
    ctxField.appendChild(ctxSel); root.appendChild(ctxField);

    root.appendChild(el("p", "hint", esc(T.valuePredictHint)));
    var seg = el("div", "seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", T.predict);
    var predict = null;
    for (var i = 1; i <= 5; i++) {
      (function (n) {
        var p = el("button", "pill"); p.type = "button"; p.textContent = labels[n];
        p.setAttribute("aria-pressed", "false");
        p.addEventListener("click", function () {
          predict = n;
          Array.prototype.forEach.call(seg.children, function (c) { c.setAttribute("aria-pressed", "false"); });
          p.setAttribute("aria-pressed", "true");
        });
        seg.appendChild(p);
      })(i);
    }
    root.appendChild(seg);
    var row = el("div", "btnrow");
    var btn = el("button", "btn", esc(T.reveal)); btn.type = "button";
    row.appendChild(btn); root.appendChild(row);
    var out = el("div", "output"); out.setAttribute("aria-live", "polite"); root.appendChild(out);

    function availableContexts(oid) { var cells = vm.cells[oid] || {}; return vm.contexts.filter(function (c) { return cells[c.id]; }); }
    function fillContexts() {
      ctxSel.innerHTML = "";
      availableContexts(objSel.value).forEach(function (c) { var op = el("option"); op.value = c.id; op.textContent = c.label; ctxSel.appendChild(op); });
    }
    objSel.addEventListener("change", function () { fillContexts(); out.innerHTML = ""; });
    fillContexts();
    btn.addEventListener("click", function () {
      var cell = (vm.cells[objSel.value] || {})[ctxSel.value];
      if (!cell) return;
      out.innerHTML = "";
      var block = el("div", "out-block gained");
      block.appendChild(el("h4", null, esc(objSel.options[objSel.selectedIndex].text) + ", " + esc(ctxSel.options[ctxSel.selectedIndex].text)));
      block.appendChild(el("p", null, esc(T.readingPrefix) + "<strong>" + esc(labels[cell.magnitude]) + "</strong>."));
      block.appendChild(el("p", null, esc(cell.note)));
      if (predict) {
        var same = predict === cell.magnitude;
        block.appendChild(el("p", "hint", esc(T.predictedPrefix) + esc(labels[predict]) + ". " + (same ? esc(T.predictClose) : esc(T.predictFar)) + " " + esc(T.noScoreValue)));
      }
      out.appendChild(block); done();
    });
  }

  /* ---------- Tool 3: Incentive Machine ----------
     spec: { rules: [{id,label,immediate,hidden_cost,benefits,pays,over_time}] } */
  function incentiveMachine(root, spec, ctx) {
    var T = ctx.t, done = ctx.onComplete;
    var rules = spec.rules || [];
    var selId = uid("im-rule");
    var field = el("div", "field");
    field.appendChild(labeled(selId, T.switchRule));
    var sel = el("select"); sel.id = selId;
    rules.forEach(function (r) { var op = el("option"); op.value = r.id; op.textContent = r.label; sel.appendChild(op); });
    field.appendChild(sel); root.appendChild(field);

    var pred = el("div", "rprompt");
    pred.appendChild(el("span", "rk", esc(T.predict)));
    pred.appendChild(el("p", null, esc(T.incentivePredict)));
    var ta = el("textarea"); ta.setAttribute("aria-label", T.predict); ta.placeholder = T.guessPlaceholder;
    pred.appendChild(ta); root.appendChild(pred);

    var row = el("div", "btnrow");
    var btn = el("button", "btn", esc(T.runRule)); btn.type = "button";
    row.appendChild(btn); root.appendChild(row);
    var out = el("div", "output"); out.setAttribute("aria-live", "polite"); root.appendChild(out);

    btn.addEventListener("click", function () {
      var r = null; rules.forEach(function (x) { if (x.id === sel.value) r = x; });
      out.innerHTML = "";
      var cells = el("div", "cells");
      cells.appendChild(cell(T.rightAway, r.immediate, ""));
      cells.appendChild(cell(T.hiddenCost, r.hidden_cost, "time"));
      cells.appendChild(cell(T.whoBenefits, r.benefits, "benefit"));
      cells.appendChild(cell(T.whoPays, r.pays, "pays"));
      out.appendChild(cells);
      var over = el("div", "out-block later");
      over.appendChild(el("h4", null, esc(T.overTimeLabel)));
      over.appendChild(el("p", null, esc(r.over_time)));
      out.appendChild(over);
      out.appendChild(el("p", "hint", esc(T.incentiveHint)));
      done();
    });
    function cell(k, v, cls) {
      var c = el("div", "cell" + (cls ? " " + cls : ""));
      c.appendChild(el("span", "ck", esc(k)));
      c.appendChild(el("span", null, esc(v)));
      return c;
    }
  }

  /* ---------- Tool 4: Measure-Drift Simulator (tool key "broken-scoreboard") ----------
     The learner pumps up the scoreboard with two sliders and watches the reported
     number drift away from what is actually there. Illustrative model only.
     spec: { scenarios: [{id,label,reported_signal,true_signal,...}],
             base?: number (default 100),
             bands?: [{maxPct, key}]  // key selects T.band1..band4; default below } */
  function brokenScoreboard(root, spec, ctx) {
    var T = ctx.t, done = ctx.onComplete;
    var scen = spec.scenarios || [];
    var BASE = (typeof spec.base === "number" && spec.base > 0) ? spec.base : 100;
    var D_DEFAULT = 7, N_DEFAULT = 10, D_MAX = 15, N_MAX = 25;
    // Scenarios where a fixed amount buying less is the point (purchasing-power mirror).
    var BUYS = { prices: 1, savings: 1, printing: 1 };
    // Period unit per scenario id (no data change needed; falls back to years).
    function unitFor(id) {
      if (id === "referee") return T.unitInnings;
      if (id === "grades") return T.unitRounds;
      return T.unitYears;
    }
    var bands = spec.bands || [
      { maxPct: 5,   key: "band1" },
      { maxPct: 30,  key: "band2" },
      { maxPct: 150, key: "band3" },
      { maxPct: Infinity, key: "band4" }
    ];

    var d = D_DEFAULT, n = N_DEFAULT, moved = false, fired = false;

    // ---- controls ----
    var selId = uid("bs-scn");
    var scnField = el("div", "field");
    scnField.appendChild(labeled(selId, T.pickScenario));
    var sel = el("select"); sel.id = selId;
    scen.forEach(function (s) { var op = el("option"); op.value = s.id; op.textContent = s.label; sel.appendChild(op); });
    scnField.appendChild(sel); root.appendChild(scnField);

    var controls = el("div", "sim-controls");
    var dId = uid("bs-d"), nId = uid("bs-n");
    var dField = el("div", "field sim-slider");
    dField.appendChild(labeled(dId, T.pumpRate));
    var dRange = document.createElement("input");
    dRange.type = "range"; dRange.id = dId; dRange.min = "0"; dRange.max = String(D_MAX); dRange.step = "1"; dRange.value = String(d);
    var dOut = el("output", "sim-sliderval"); dOut.setAttribute("for", dId);
    dField.appendChild(dRange); dField.appendChild(dOut);

    var nField = el("div", "field sim-slider");
    var nLabel = labeled(nId, T.periodsLabel); nField.appendChild(nLabel);
    var nRange = document.createElement("input");
    nRange.type = "range"; nRange.id = nId; nRange.min = "0"; nRange.max = String(N_MAX); nRange.step = "1"; nRange.value = String(n);
    var nOut = el("output", "sim-sliderval"); nOut.setAttribute("for", nId);
    nField.appendChild(nRange); nField.appendChild(nOut);
    controls.appendChild(dField); controls.appendChild(nField);
    root.appendChild(controls);

    // ---- live output scaffold ----
    var out = el("div", "output sim-out"); root.appendChild(out);
    var captions = el("div", "compare2 sim-captions"); out.appendChild(captions);
    var capA = el("div", "col a"); capA.appendChild(el("h4", null, esc(T.scoreboardSays)));
    var capAp = el("p", null, ""); capA.appendChild(capAp);
    var capB = el("div", "col b"); capB.appendChild(el("h4", null, esc(T.actuallyHappening)));
    var capBp = el("p", null, ""); capB.appendChild(capBp);
    captions.appendChild(capA); captions.appendChild(capB);

    var bars = el("div", "sim-bars");
    function barRow(cls, labelText) {
      var rowEl = el("div", "sim-bar-row " + cls);
      var lab = el("div", "sim-bar-label", esc(labelText));
      var track = el("div", "sim-bar-track");
      var fillEl = el("span", "sim-bar-fill");
      track.appendChild(fillEl);
      var val = el("div", "sim-bar-val", "");
      rowEl.appendChild(lab); rowEl.appendChild(track); rowEl.appendChild(val);
      return { row: rowEl, fill: fillEl, val: val };
    }
    var reportedBar = barRow("reported", T.scoreboardNum);
    var trueBar = barRow("truth", T.actuallyThere);
    bars.appendChild(reportedBar.row); bars.appendChild(trueBar.row);
    out.appendChild(bars);

    var gapLine = el("div", "sim-gap", ""); out.appendChild(gapLine);
    var buysLine = el("div", "sim-buys", ""); out.appendChild(buysLine);

    var band = el("div", "out-block later sim-band");
    band.setAttribute("aria-live", "polite");
    band.appendChild(el("h4", null, esc(T.howRespond)));
    var bandP = el("p", null, ""); band.appendChild(bandP);
    out.appendChild(band);

    var note = el("p", "hint sim-note", esc(T.illustrativeNote)); out.appendChild(note);

    var details = document.createElement("details"); details.className = "sim-howto";
    var summary = document.createElement("summary"); summary.textContent = T.howComputed;
    details.appendChild(summary);
    details.appendChild(el("p", null, esc(T.howComputedBody)));
    out.appendChild(details);

    // ---- model ----
    function reportedFor(dd, nn) { return BASE * Math.pow(1 + dd / 100, nn); }
    function fmt(x) {
      var r = Math.round(safeNum(x, 0));
      return String(r).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function bandSentence(gapPct) {
      for (var i = 0; i < bands.length; i++) { if (gapPct <= bands[i].maxPct) return T[bands[i].key] || ""; }
      return T[bands[bands.length - 1].key] || "";
    }

    // throttle the aria-live band update so dragging does not spam screen readers
    var bandTimer = null, lastBandText = "";
    function announceBand(text) {
      bandP.textContent = text; // visible update is immediate
      if (text === lastBandText) return;
      if (bandTimer) clearTimeout(bandTimer);
      bandTimer = setTimeout(function () {
        band.setAttribute("aria-live", "polite");
        lastBandText = text;
      }, 350);
    }

    function currentScenario() { var s = scen[0] || {}; scen.forEach(function (x) { if (x.id === sel.value) s = x; }); return s; }

    function render() {
      var s = currentScenario();
      var unit = unitFor(s.id);
      var reported = reportedFor(d, n);
      var gap = reported - BASE;
      var gapPct = BASE > 0 ? (reported / BASE - 1) * 100 : 0;

      // slider readouts + accessible value text
      dOut.textContent = d + "%";
      dRange.setAttribute("aria-valuetext", d + " " + T.pctPerPeriod);
      nOut.textContent = n + " " + unit;
      nRange.setAttribute("aria-valuetext", n + " " + unit);

      // captions from the scenario (qualitative framing only)
      capAp.textContent = s.reported_signal || "";
      capBp.textContent = s.true_signal || "";

      // bars (reported scaled against itself so the true bar shrinks visibly as drift grows)
      var maxv = Math.max(reported, BASE) || 1;
      reportedBar.fill.style.width = Math.max(2, (reported / maxv) * 100) + "%";
      trueBar.fill.style.width = Math.max(2, (BASE / maxv) * 100) + "%";
      reportedBar.val.textContent = fmt(reported);
      trueBar.val.textContent = fmt(BASE);

      gapLine.innerHTML = "";
      var gl = el("span", "sim-gap-num", esc(T.gapLabel) + ": " + esc(fmt(gap)) + " (+" + esc(fmt(gapPct)) + "%)");
      gapLine.appendChild(gl);

      // purchasing-power mirror only where a fixed amount buying less is the point
      if (BUYS[s.id]) {
        var buys = BASE / Math.pow(1 + d / 100, n);
        buysLine.style.display = "";
        buysLine.textContent = T.buysLabel + ": " + fmt(buys);
      } else {
        buysLine.style.display = "none";
        buysLine.textContent = "";
      }

      announceBand(bandSentence(gapPct));
    }

    function onMove() {
      d = safeInt(dRange.value, D_DEFAULT);
      n = safeInt(nRange.value, N_DEFAULT);
      render();
      if (!moved && (d !== D_DEFAULT || n !== N_DEFAULT)) {
        moved = true;
        if (!fired) { fired = true; done(); }
      }
    }
    dRange.addEventListener("input", onMove);
    nRange.addEventListener("input", onMove);
    sel.addEventListener("change", render);
    render(); // initial paint at defaults (no onComplete yet)
  }

  /* ---------- Tool 5: Trust Map ----------
     spec: { custodians: [{id,label,answers:{...}}], questions: [{id,label}],
             highlight: {custodian, question} (optional) } */
  function trustMap(root, spec, ctx) {
    var T = ctx.t, done = ctx.onComplete;
    var custs = spec.custodians || []; var qs = spec.questions || []; var hl = spec.highlight || null;
    var chosen = {};
    root.appendChild(el("p", "hint", esc(T.chooseHolders)));
    var seg = el("div", "seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", T.chooseHolders);
    custs.forEach(function (c) {
      var p = el("button", "pill"); p.type = "button"; p.textContent = c.label;
      p.setAttribute("aria-pressed", "false");
      p.addEventListener("click", function () { chosen[c.id] = !chosen[c.id]; p.setAttribute("aria-pressed", chosen[c.id] ? "true" : "false"); });
      seg.appendChild(p);
    });
    root.appendChild(seg);
    var row = el("div", "btnrow");
    var btn = el("button", "btn", esc(T.compareThem)); btn.type = "button";
    row.appendChild(btn); var note = el("p", "hint"); row.appendChild(note); root.appendChild(row);
    var out = el("div", "output"); out.setAttribute("aria-live", "polite"); root.appendChild(out);

    btn.addEventListener("click", function () {
      var picked = custs.filter(function (c) { return chosen[c.id]; });
      if (picked.length < 2) { note.textContent = T.pickTwo; return; }
      note.textContent = ""; out.innerHTML = "";
      var wrap = el("div", "tablewrap"); var t = el("table");
      var thead = el("thead"); var hr = el("tr");
      hr.appendChild(el("th", null, esc(T.questionCol)));
      picked.forEach(function (c) { var th = el("th"); th.scope = "col"; th.textContent = c.label; hr.appendChild(th); });
      thead.appendChild(hr); t.appendChild(thead);
      var tb = el("tbody");
      qs.forEach(function (q) {
        var tr = el("tr");
        var rh = el("th"); rh.scope = "row"; rh.textContent = q.label; tr.appendChild(rh);
        picked.forEach(function (c) {
          var td = el("td"); var ans = c.answers[q.id] || "";
          var honest = hl && c.id === hl.custodian && q.id === hl.question;
          td.innerHTML = honest ? '<span class="selfnote">' + esc(ans) + "</span>" : esc(ans);
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
      t.appendChild(tb); wrap.appendChild(t); out.appendChild(wrap);
      out.appendChild(el("p", "hint", esc(T.trustHint)));
      done();
    });
  }

  /* ---------- Tool 6: Rule Change Lab ----------
     spec: { dimensions: [{id,label,system_a,system_b,tradeoff}] }
     strings T also provide systemA/systemB labels and systemADesc/systemBDesc intros. */
  function ruleChangeLab(root, spec, ctx) {
    var T = ctx.t, done = ctx.onComplete;
    var dims = spec.dimensions || [];
    var head = el("div", "compare2");
    var ca = el("div", "col a");
    ca.appendChild(el("h4", null, esc(T.systemA)));
    ca.appendChild(el("p", null, esc(T.systemADesc)));
    var cb = el("div", "col b");
    cb.appendChild(el("h4", null, esc(T.systemB)));
    cb.appendChild(el("p", null, esc(T.systemBDesc)));
    head.appendChild(ca); head.appendChild(cb); root.appendChild(head);
    var row = el("div", "btnrow");
    var btn = el("button", "btn", esc(T.runComparison)); btn.type = "button";
    row.appendChild(btn); root.appendChild(row);
    var out = el("div", "output"); out.setAttribute("aria-live", "polite"); root.appendChild(out);

    btn.addEventListener("click", function () {
      out.innerHTML = "";
      dims.forEach(function (d) {
        out.appendChild(el("h3", null, esc(d.label)));
        var cmp = el("div", "compare2");
        var a = el("div", "col a");
        a.appendChild(el("h4", null, esc(T.systemA)));
        a.appendChild(el("p", null, esc(d.system_a)));
        var b = el("div", "col b");
        b.appendChild(el("h4", null, esc(T.systemB)));
        b.appendChild(el("p", null, esc(d.system_b)));
        cmp.appendChild(a); cmp.appendChild(b); out.appendChild(cmp);
        out.appendChild(el("div", "tradeoff", "<b>" + esc(T.tradeoffLabel) + "</b> " + esc(d.tradeoff)));
      });
      out.appendChild(el("p", "hint", esc(T.rulelabHint)));
      done();
    });
  }

  var tools = {
    "friday-night": fridayNight,
    "value-swap": valueSwap,
    "incentive-machine": incentiveMachine,
    "broken-scoreboard": brokenScoreboard,
    "trust-map": trustMap,
    "rule-change-lab": ruleChangeLab
  };

  function mount(container, opts) {
    if (!container || !opts || !opts.tool) throw new Error("BSAInteractive.mount needs a container and opts.tool");
    var fn = tools[opts.tool];
    if (!fn) throw new Error("BSAInteractive: unknown tool '" + opts.tool + "'");
    var ctx = { t: opts.t || {}, onComplete: typeof opts.onComplete === "function" ? opts.onComplete : function () {} };
    fn(container, opts.spec || {}, ctx);
    return container;
  }

  global.BSAInteractive = { tools: tools, mount: mount, version: "1.0" };
})(typeof window !== "undefined" ? window : this);
