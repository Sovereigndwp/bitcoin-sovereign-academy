import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
const ROOT = process.cwd();
const LIB = readFileSync(ROOT + "/js/interactive-tools/interactive-tools.js", "utf8");
const ENGINE = readFileSync(ROOT + "/deep-dives/rules-under-the-game/js/rules-under-the-game.js", "utf8");
const DATA = {
  en: JSON.parse(readFileSync(ROOT + "/deep-dives/rules-under-the-game/data/rules-under-the-game.json","utf8")),
  es: JSON.parse(readFileSync(ROOT + "/deep-dives/rules-under-the-game/data/rules-under-the-game.es.json","utf8")),
};
const pages = [{name:"hub", html:'<div id="rutg-hub"></div>'}];
for (let n=1;n<=6;n++) pages.push({name:"module-"+n, html:`<main id="rutg-module" data-module="${n}"></main>`});

let fails=0, total=0;
for (const lang of ["en","es"]) {
  for (const p of pages) {
    total++;
    const errors=[];
    const dom = new JSDOM(`<!doctype html><html><body>${p.html}</body></html>`,
      { url:`https://x/deep-dives/rules-under-the-game/${p.name==="hub"?"index":p.name}.html?lang=${lang}`,
        runScripts:"outside-only", pretendToBeVisual:true });
    const w = dom.window;
    w.onerror = (m)=>errors.push("onerror: "+m);
    const origErr = w.console.error; w.console.error = (...a)=>errors.push("console.error: "+a.join(" "));
    w.fetch = () => Promise.resolve({ ok:true, json: ()=>Promise.resolve(DATA[lang]) });
    try {
      w.eval(LIB);
      w.eval(ENGINE);
    } catch(e){ errors.push("eval: "+e.message); }
    // let the fetch .then microtasks flush
    await new Promise(r=>setTimeout(r,30));
    const host = w.document.getElementById(p.name==="hub"?"rutg-hub":"rutg-module");
    const populated = host && host.childNodes.length>0;
    const loadErr = host && /loadError|could not load|no pudo cargar/i.test(host.innerHTML);
    const ok = populated && !loadErr && errors.length===0;
    if(!ok){ fails++; console.log(`FAIL ${lang}/${p.name}: populated=${populated} loadErr=${!!loadErr} errs=${JSON.stringify(errors).slice(0,300)}`); }
    else console.log(`ok   ${lang}/${p.name}  (nodes=${host.childNodes.length})`);
  }
}
console.log(`\n${total-fails}/${total} rendered zero-error`);
process.exit(fails?1:0);
