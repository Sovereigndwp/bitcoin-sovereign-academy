/* ============================================================================
   Deep Dive Lab: shared interactive component library (vanilla JS, no deps)
   Each mount: <div class="ddlab" data-ddlab="<type>" data-config="<id>"></div>
   Config:     <script type="application/json" data-ddlab-config="<id>">{...}</script>
   Types: comparison-matrix | scenario-simulator | calculator | decision-tree |
          claim-checker | timeline-explorer | tradeoff-card
   Auto-inits on DOMContentLoaded and watches for injected nodes (MutationObserver).
   Educational only. Decision trees honor boundaries (no personalized advice / no
   FSA→TBA funnel). See standards/DEEP_DIVE_STANDARD.md.
   ========================================================================== */
(function () {
  "use strict";
  // ---- safety helpers ----
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var num = function (v, d) { var n = parseFloat(v); return isFinite(n) ? n : (d || 0); };
  var money = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };
  var pct = function (n) { return (Math.round(n * 10) / 10) + "%"; };
  var rateClass = function (r) { return r === "good" ? "dd-good" : r === "bad" ? "dd-bad" : "dd-mixed"; };
  var sev = function (s) { return s === "low" ? "sev-low" : s === "high" ? "sev-high" : "sev-med"; };

  function getConfig(el) {
    var id = el.getAttribute("data-config");
    var node = id && document.querySelector('script[data-ddlab-config="' + id + '"]');
    if (!node) return null;
    try { return JSON.parse(node.textContent); } catch (e) { console.warn("ddlab: bad config", id, e); return null; }
  }
  function head(cfg) {
    return (cfg.kicker ? '<div class="ddlab__kicker">' + esc(cfg.kicker) + "</div>" : "") +
      (cfg.title ? '<h4 class="ddlab__title">' + esc(cfg.title) + "</h4>" : "") +
      (cfg.intro ? '<p class="ddlab__intro">' + esc(cfg.intro) + "</p>" : "");
  }
  function takeaway(cfg) { return cfg.takeaway ? '<div class="ddlab__takeaway">' + esc(cfg.takeaway) + "</div>" : ""; }
  function note(cfg) { return cfg.note ? '<div class="ddlab__note">' + esc(cfg.note) + "</div>" : ""; }

  // ---- named calculator formulas (no eval) ----
  var FORMULAS = {
    purchasing_power: function (i) { // amount, rate%, years -> real value
      var real = i.amount * Math.pow(1 - i.rate / 100, i.years);
      return [{ label: "Real value", value: money(real) },
              { label: "Lost to inflation", value: money(i.amount - real) },
              { label: "% preserved", value: pct(real / i.amount * 100) }];
    },
    ltv_liquidation: function (i) { // collateral_btc, btc_price, loan_usd, liq_ltv%
      var coll = i.collateral_btc * i.btc_price;
      var ltv = coll > 0 ? (i.loan_usd / coll) * 100 : 0;
      var liqPrice = i.collateral_btc > 0 ? (i.loan_usd / (i.liq_ltv / 100)) / i.collateral_btc : 0;
      var drop = i.btc_price > 0 ? (1 - liqPrice / i.btc_price) * 100 : 0;
      return [{ label: "Current LTV", value: pct(ltv), rate: ltv < 35 ? "good" : ltv < 55 ? "mixed" : "bad" },
              { label: "Liquidation price", value: money(liqPrice) },
              { label: "Buffer before liquidation", value: pct(Math.max(0, drop)), rate: drop > 50 ? "good" : drop > 30 ? "mixed" : "bad" }];
    },
    loan_cost: function (i) { // principal, apr%, years
      var interest = i.principal * (i.apr / 100) * i.years;
      return [{ label: "Total interest", value: money(interest) },
              { label: "Total repaid", value: money(i.principal + interest) }];
    },
    opportunity_cost: function (i) { // spend_now, expected_return%, years
      var future = i.spend_now * Math.pow(1 + i.expected_return / 100, i.years);
      return [{ label: "Forgone future value", value: money(future) },
              { label: "Opportunity cost", value: money(future - i.spend_now) }];
    },
    savings_growth: function (i) { // monthly, rate%, years
      var n = i.years * 12, r = i.rate / 100 / 12, fv = r ? i.monthly * (Math.pow(1 + r, n) - 1) / r : i.monthly * n;
      return [{ label: "Contributed", value: money(i.monthly * n) },
              { label: "Future value", value: money(fv) },
              { label: "Growth", value: money(fv - i.monthly * n) }];
    },
    inflation_adjusted: function (i) { // nominal_return%, inflation%
      var real = ((1 + i.nominal_return / 100) / (1 + i.inflation / 100) - 1) * 100;
      return [{ label: "Real return", value: pct(real), rate: real > 0 ? "good" : "bad" }];
    },
    debt_payoff: function (i) { // balance, apr%, payment
      var r = i.apr / 100 / 12, bal = i.balance, months = 0, paid = 0, cap = 600;
      while (bal > 0 && months < cap) { bal += bal * r; bal -= i.payment; paid += i.payment; months++; }
      var stuck = months >= cap;
      return [{ label: "Months to payoff", value: stuck ? "Never (payment too low)" : months, rate: stuck ? "bad" : months < 36 ? "good" : "mixed" },
              { label: "Total paid", value: stuck ? "-" : money(Math.max(0, paid + bal)) }];
    },
    custody_risk_score: function (i) { // single_point(0/1), backup_tested(0/1), heir_knows(0/1), exchange_only(0/1)
      var score = 0;
      score += i.single_point ? 40 : 0; score += i.exchange_only ? 30 : 0;
      score += i.backup_tested ? 0 : 20; score += i.heir_knows ? 0 : 10;
      var band = score >= 60 ? "bad" : score >= 30 ? "mixed" : "good";
      return [{ label: "Risk score (0–100)", value: score, rate: band },
              { label: "Reading", value: band === "bad" ? "High: fix before adding funds" : band === "mixed" ? "Moderate: close the gaps" : "Lower: keep verifying" }];
    }
  };

  // ---- renderers ----
  var R = {};

  R["comparison-matrix"] = function (el, cfg) {
    var dims = cfg.dimensions || [];
    var systems = cfg.systems || [];
    var h = '<div class="ddlab__matrix-wrap"><table><thead><tr><th>Dimension</th>';
    systems.forEach(function (s) { h += "<th>" + esc(s.name) + "</th>"; });
    h += "</tr></thead><tbody>";
    dims.forEach(function (dim, di) {
      h += '<tr><td class="dd-dim">' + esc(dim) + "</td>";
      systems.forEach(function (s) {
        var cell = (s.values && s.values[di]) || {};
        var txt = typeof cell === "string" ? cell : (cell.text || "");
        var rate = typeof cell === "object" ? cell.rate : null;
        h += '<td class="' + (rate ? "dd-rate " + rateClass(rate) : "") + '">' + esc(txt) + "</td>";
      });
      h += "</tr>";
    });
    h += "</tbody></table></div>";
    el.innerHTML = head(cfg) + h + takeaway(cfg) + note(cfg);
  };

  R["scenario-simulator"] = function (el, cfg) {
    var shocks = cfg.shocks || [], systems = cfg.systems || [], matrix = cfg.matrix || {};
    var current = shocks[0] ? shocks[0].id : null;
    function render() {
      var chips = '<div class="ddlab__chips" role="tablist">';
      shocks.forEach(function (s) {
        chips += '<button type="button" role="tab" aria-pressed="' + (s.id === current) + '" data-shock="' + esc(s.id) + '">' + esc(s.label) + "</button>";
      });
      chips += "</div>";
      var rows = '<div class="ddlab__sim-grid">';
      systems.forEach(function (sysName) {
        var cell = (matrix[current] && matrix[current][sysName]) || { result: "-", severity: "med" };
        rows += '<div class="ddlab__sim-row"><div class="ddlab__sim-sys">' + esc(sysName) +
          '<span class="ddlab__sev ' + sev(cell.severity) + '">' + esc(cell.severity || "med") + "</span></div>" +
          '<div class="ddlab__sim-out">' + esc(cell.result) + "</div></div>";
      });
      rows += "</div>";
      var tk = (cfg.takeaways && cfg.takeaways[current]) || cfg.takeaway;
      el.innerHTML = head(cfg) + chips + rows + (tk ? '<div class="ddlab__takeaway">' + esc(tk) + "</div>" : "") + note(cfg);
      el.querySelectorAll("[data-shock]").forEach(function (b) {
        b.addEventListener("click", function () { current = b.getAttribute("data-shock"); render(); });
      });
    }
    render();
  };

  R["calculator"] = function (el, cfg) {
    var inputs = cfg.inputs || [], fn = FORMULAS[cfg.formula];
    if (!fn) { el.innerHTML = head(cfg) + '<p class="ddlab__note">Unknown formula: ' + esc(cfg.formula) + "</p>"; return; }
    var state = {};
    inputs.forEach(function (f) { state[f.id] = f.default != null ? f.default : (f.min || 0); });
    function controls() {
      return inputs.map(function (f) {
        var v = state[f.id];
        if (f.type === "toggle") {
          return '<div class="ddlab__field"><label><input type="checkbox" data-k="' + esc(f.id) + '"' + (v ? " checked" : "") +
            '> ' + esc(f.label) + "</label></div>";
        }
        var disp = (f.prefix || "") + (typeof v === "number" ? v.toLocaleString("en-US") : v) + (f.suffix || "");
        if (f.type === "number") {
          return '<div class="ddlab__field"><label>' + esc(f.label) + '</label><input type="number" data-k="' + esc(f.id) +
            '" value="' + esc(v) + '" min="' + esc(f.min) + '" max="' + esc(f.max) + '" step="' + esc(f.step || 1) + '"></div>';
        }
        return '<div class="ddlab__field"><label>' + esc(f.label) + ' <span class="dd-val" data-disp="' + esc(f.id) + '">' + esc(disp) +
          '</span></label><input type="range" data-k="' + esc(f.id) + '" value="' + esc(v) + '" min="' + esc(f.min) +
          '" max="' + esc(f.max) + '" step="' + esc(f.step || 1) + '"></div>';
      }).join("");
    }
    function compute() {
      var outs = fn(state) || [];
      el.querySelector("[data-outputs]").innerHTML = outs.map(function (o) {
        return '<div class="ddlab__out"><div class="dd-out-label">' + esc(o.label) + '</div><div class="dd-out-value ' +
          (o.rate ? rateClass(o.rate) : "") + '">' + esc(o.value) + "</div></div>";
      }).join("");
    }
    el.innerHTML = head(cfg) + '<div class="ddlab__form">' + controls() + "</div>" +
      '<div class="ddlab__outputs" data-outputs></div>' + takeaway(cfg) + note(cfg);
    el.querySelectorAll("[data-k]").forEach(function (inp) {
      inp.addEventListener("input", function () {
        var k = inp.getAttribute("data-k");
        state[k] = inp.type === "checkbox" ? (inp.checked ? 1 : 0) : num(inp.value);
        var disp = el.querySelector('[data-disp="' + k + '"]');
        if (disp) { var f = inputs.filter(function (x) { return x.id === k; })[0] || {};
          disp.textContent = (f.prefix || "") + num(inp.value).toLocaleString("en-US") + (f.suffix || ""); }
        compute();
      });
    });
    compute();
  };

  R["decision-tree"] = function (el, cfg) {
    var nodes = cfg.nodes || {}, leaves = cfg.leaves || {}, start = cfg.start;
    var path = [];
    function render(id) {
      if (leaves[id]) {
        var lf = leaves[id];
        var h = head(cfg) + '<div class="ddlab__dt-crumbs">' + esc(path.join("  →  ")) + '</div>' +
          '<div class="ddlab__dt-leaf"><div class="dd-leaf-title">' + esc(lf.result) + "</div>" +
          '<div>' + esc(lf.guidance) + "</div>" +
          (lf.boundary ? '<div class="ddlab__dt-boundary">⚠ ' + esc(lf.boundary) + "</div>" : "") + "</div>" +
          '<div class="ddlab__chips" style="margin-top:14px"><button type="button" data-restart>↺ Start over</button></div>';
        el.innerHTML = h;
        el.querySelector("[data-restart]").addEventListener("click", function () { path = []; render(start); });
        return;
      }
      var n = nodes[id]; if (!n) { el.innerHTML = head(cfg) + '<p class="ddlab__note">Tree error.</p>'; return; }
      var h2 = head(cfg) + (path.length ? '<div class="ddlab__dt-crumbs">' + esc(path.join("  →  ")) + "</div>" : "") +
        '<div class="ddlab__dt-q">' + esc(n.question) + '</div><div class="ddlab__dt-opts">';
      (n.options || []).forEach(function (o, oi) {
        h2 += '<button type="button" data-next="' + esc(o.next) + '" data-label="' + esc(o.label) + '">' + esc(o.label) + "</button>";
      });
      h2 += "</div>";
      el.innerHTML = h2;
      el.querySelectorAll("[data-next]").forEach(function (b) {
        b.addEventListener("click", function () { path.push(b.getAttribute("data-label")); render(b.getAttribute("data-next")); });
      });
    }
    render(start);
  };

  R["claim-checker"] = function (el, cfg) {
    var claims = cfg.claims || [];
    var confClass = function (c) { return /high/i.test(c) ? "c-high" : /low/i.test(c) ? "c-low" : "c-med"; };
    var h = head(cfg);
    claims.forEach(function (c, i) {
      var src = c.source || {};
      h += '<div class="ddlab__claim" data-claim="' + i + '">' +
        '<button type="button" class="ddlab__claim-head" aria-expanded="false"><span>' + esc(c.claim) + "</span>" +
        '<span class="ddlab__conf ' + confClass(c.confidence) + '">' + esc(c.confidence || "medium") + "</span></button>" +
        '<div class="ddlab__claim-body"><dl>' +
        "<dt>Evidence</dt><dd>" + esc(c.evidence) + "</dd>" +
        "<dt>Source</dt><dd>" + (src.url ? '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.label || src.url) + "</a>" : esc(src.label || "-")) + "</dd>" +
        "<dt>Caveat</dt><dd>" + esc(c.caveat || "-") + "</dd>" +
        "<dt>Would change the conclusion</dt><dd>" + esc(c.falsifier || "-") + "</dd>" +
        "</dl></div></div>";
    });
    el.innerHTML = h + note(cfg);
    el.querySelectorAll(".ddlab__claim-head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".ddlab__claim"); var open = card.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open);
      });
    });
  };

  R["timeline-explorer"] = function (el, cfg) {
    var ev = cfg.events || [], cur = 0;
    function render() {
      var track = '<div class="ddlab__tl-track">';
      ev.forEach(function (e, i) {
        track += '<div class="ddlab__tl-ev' + (i === cur ? " is-active" : "") + '" data-ev="' + i + '" tabindex="0" role="button">' +
          '<div class="ddlab__tl-date">' + esc(e.date) + '</div><div class="ddlab__tl-label">' + esc(e.label) + "</div></div>";
      });
      track += "</div>";
      var d = ev[cur] || {};
      var detail = '<div class="ddlab__tl-detail">' + (d.tag ? '<div class="ddlab__tl-tag">' + esc(d.tag) + "</div>" : "") +
        "<strong>" + esc(d.date) + ": " + esc(d.label) + "</strong><br>" + esc(d.detail || "") +
        (d.source ? ' <a href="' + esc(d.source) + '" target="_blank" rel="noopener" style="color:var(--dd-accent)">source</a>' : "") + "</div>";
      el.innerHTML = head(cfg) + '<div class="ddlab__tl">' + track + detail + "</div>" + note(cfg);
      el.querySelectorAll("[data-ev]").forEach(function (n) {
        var go = function () { cur = +n.getAttribute("data-ev"); render(); };
        n.addEventListener("click", go);
        n.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      });
    }
    render();
  };

  R["tradeoff-card"] = function (el, cfg) {
    el.classList.add("ddlab--tradeoff");
    el.innerHTML = head(cfg) +
      '<div class="dd-claim">' + esc(cfg.claim) + "</div>" +
      '<div class="ddlab__to-grid">' +
      '<div class="ddlab__to-cell dd-improve"><h5>What Bitcoin improves</h5>' + esc(cfg.improves) + "</div>" +
      '<div class="ddlab__to-cell dd-harder"><h5>What it makes harder</h5>' + esc(cfg.harder) + "</div>" +
      '<div class="ddlab__to-cell"><h5>Who benefits</h5>' + esc(cfg.benefits) + "</div>" +
      '<div class="ddlab__to-cell"><h5>Who carries the risk</h5>' + esc(cfg.risk_bearer) + "</div>" +
      '<div class="ddlab__to-cell dd-assume"><h5>Key assumption the argument depends on</h5>' + esc(cfg.key_assumption) + "</div>" +
      "</div>" + note(cfg);
  };

  // ---- init ----
  function mount(el) {
    if (el.getAttribute("data-ddlab-ready")) return;
    var type = el.getAttribute("data-ddlab"); var cfg = getConfig(el);
    if (!cfg || !R[type]) { return; }
    try { R[type](el, cfg); el.setAttribute("data-ddlab-ready", "1"); }
    catch (e) { console.warn("ddlab mount failed", type, e); }
  }
  function scan(root) { (root || document).querySelectorAll(".ddlab[data-ddlab]").forEach(mount); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { scan(); });
  else scan();
  if (window.MutationObserver) {
    new MutationObserver(function (muts) {
      muts.forEach(function (m) { m.addedNodes && m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n.parentNode || n); }); });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  window.DeepDiveLab = { scan: scan, formulas: FORMULAS };
})();
