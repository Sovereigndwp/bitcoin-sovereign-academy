import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
const ROOT=process.cwd();
const LIB=readFileSync(ROOT+"/js/interactive-tools/interactive-tools.js","utf8");
const src=readFileSync(ROOT+"/deep-dives/rules-under-the-game/js/rules-under-the-game.js","utf8");
const UI=eval("("+src.match(/var\s+UI\s*=\s*(\{[\s\S]*?\n\s{2}\});/)[1]+")");
const SC=[
 {id:"referee",label:"Referee",reported_signal:"The scoreboard shows one team comfortably ahead.",true_signal:"Both teams scored the same."},
 {id:"savings",label:"Savings",reported_signal:"The number in the account is going up each year.",true_signal:"The food it buys is shrinking."},
 {id:"printing",label:"Printing",reported_signal:"There is visibly more money moving around.",true_signal:"The same goods and work as before."},
];
function mk(){const d=new JSDOM("<!doctype html><body><div id=m></div>",{runScripts:"outside-only",pretendToBeVisual:true});const w=d.window;w.eval(LIB);
 w.BSAInteractive.mount(w.document.getElementById("m"),{tool:"broken-scoreboard",spec:{scenarios:SC},t:UI.en,onComplete:()=>{}});return w;}
function setR(w,el,v){el.value=String(v);el.dispatchEvent(new w.Event("input",{bubbles:true}));}
const w=mk();
const [dR,nR]=w.document.querySelectorAll("input[type=range]");
function snap(tag){
 const rep=w.document.querySelector(".sim-bar-row.reported .sim-bar-val").textContent;
 const tru=w.document.querySelector(".sim-bar-row.truth .sim-bar-val").textContent;
 const repW=w.document.querySelector(".sim-bar-row.reported .sim-bar-fill").style.width;
 const truW=w.document.querySelector(".sim-bar-row.truth .sim-bar-fill").style.width;
 const gap=w.document.querySelector(".sim-gap").textContent;
 const buys=w.document.querySelector(".sim-buys").textContent||"(hidden)";
 const band=w.document.querySelector(".sim-band p").textContent;
 const dv=w.document.querySelector(".sim-slider output").textContent;
 console.log(`\n[${tag}]`);
 console.log("  reported:",JSON.stringify(rep),"width",repW,"| true:",JSON.stringify(tru),"width",truW);
 console.log("  gapline :",JSON.stringify(gap),"(len",gap.length+")");
 console.log("  buys    :",JSON.stringify(buys));
 console.log("  band    :",JSON.stringify(band.slice(0,60))+"...");
 console.log("  d-out   :",JSON.stringify(dv));
}
// default 7%/10
snap("default 7% / 10");
// MAX STATE 15% / 25 on the printing scenario (purchasing mirror shown)
w.document.querySelector("select").value="printing"; w.document.querySelector("select").dispatchEvent(new w.Event("change"));
setR(w,dR,15); setR(w,nR,25);
snap("MAX 15% / 25 (printing)");
// width sanity: every fill width <= 100%
const widths=[...w.document.querySelectorAll(".sim-bar-fill")].map(e=>parseFloat(e.style.width));
console.log("\n  all bar widths <=100%:", widths.every(x=>x<=100), widths);
// referee at n=1 (one-shot)
w.document.querySelector("select").value="referee"; w.document.querySelector("select").dispatchEvent(new w.Event("change"));
setR(w,dR,15); setR(w,nR,1);
snap("referee 15% / 1 inning (buys hidden)");
