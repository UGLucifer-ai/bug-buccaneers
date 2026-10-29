// node tools/verify-curriculum.js [seeds]  — runs every generated buggy + fixed snippet
const { CURRICULUM, makeLesson } = require("../curriculum.js");
const { execFileSync } = require("child_process"); const fs = require("fs");
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
const SEEDS = +process.argv[2] || 15; let bad = 0, n = 0; const variety = {};
function run(lang, code, stdin){
  const f = "/tmp/vc." + (lang === "python" ? "py" : "js"); fs.writeFileSync(f, code);
  try { return { ok: true, out: execFileSync(lang === "python" ? "python3" : "node", [f], { input: stdin, timeout: 4000, stdio: ["pipe","pipe","pipe"] }).toString().trim() }; }
  catch (e) { return { ok: false, out: (e.stdout || "").toString().trim(), err: (e.stderr||"").toString().split("\n").filter(Boolean).pop() }; }
}
for (const lang of Object.keys(CURRICULUM)) CURRICULUM[lang].forEach((C, ci) => C.v.forEach((_, vi) => {
  const seen = new Set();
  for (let s = 1; s <= SEEDS; s++){
    const p = makeLesson(lang, ci, vi, mulberry32(s * 7919 + ci * 31 + vi));
    seen.add(p.c); n++;
    const fx = run(lang, p.fixedCode, p.stdin), bg = run(lang, p.c, p.stdin);
    const fixedGood = fx.ok && fx.out === String(p.out).trim();
    const buggyBad = !bg.ok || bg.out !== String(p.out).trim();
    if (!fixedGood || !buggyBad){ bad++; console.log("FAIL", lang, C.k, p.n, {fixedGood, buggyBad, want: p.out, got: fx.out, ferr: fx.err, bout: bg.out}); }
  }
  variety[lang + " | " + C.k] = (variety[lang + " | " + C.k] || 0) + seen.size;
}));
console.log("checked", n, "failures", bad); console.log(JSON.stringify(variety, null, 1));
