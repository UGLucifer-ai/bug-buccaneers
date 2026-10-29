// node tools/verify-curriculum.js [seeds] [lang,lang]  — compiles/runs every generated buggy + fixed snippet
for (const f of ["curriculum", "curriculum-more", "curriculum-langs", "curriculum-ess", "curriculum-sql"]) { try { require("../" + f + ".js"); } catch (e) { if (!/Cannot find module/.test(e.message)) throw e; } }
const CURRICULUM = globalThis.BB_CURRICULUM, makeLesson = globalThis.BB_makeLesson || require("../curriculum.js").makeLesson;
const { execFileSync } = require("child_process"); const fs = require("fs"); const path = require("path");
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
const TC = "/opt/mm/root/envs/tc/bin/";
const SLOW = { java: 3, csharp: 3, rust: 3, cpp: 4, go: 4, typescript: 4 };
const ARG = +process.argv[2] || 15, ONLY = process.argv[3] ? process.argv[3].split(",") : null;
let bad = 0, n = 0; const variety = {};
const ex = (cmd, args, o) => execFileSync(cmd, args, Object.assign({ timeout: 30000, stdio: ["pipe", "pipe", "pipe"] }, o)).toString();
function build(lang, dir, code) {
  const W = (f) => { const p = path.join(dir, f); fs.writeFileSync(p, code); return p; };
  switch (lang) {
    case "python": return ["python3", [W("a.py")]];
    case "javascript": return ["node", [W("a.js")]];
    case "c": ex("gcc", ["-w", "-o", dir + "/a", W("a.c"), "-lm"]); return [dir + "/a", []];
    case "cpp": ex(TC + "g++", ["-w", "-o", dir + "/a", W("a.cpp")]); return [dir + "/a", []];
    case "java": ex(TC + "javac", ["-nowarn", "-d", dir, W("Main.java")]); return [TC + "java", ["-cp", dir, "Main"]];
    case "csharp": ex(TC + "mcs", ["-nowarn:0162,0219,0168,0164", "-out:" + dir + "/a.exe", W("a.cs")]); return [TC + "mono", [dir + "/a.exe"]];
    case "go": W("a.go"); ex("go", ["build", "-o", dir + "/a", dir + "/a.go"], { env: Object.assign({}, process.env, { GOCACHE: "/tmp/gocache", GOFLAGS: "" }) }); return [dir + "/a", []];
    case "rust": ex("rustc", ["-A", "warnings", "-o", dir + "/a", W("a.rs")]); return [dir + "/a", []];
    case "typescript": W("a.ts"); fs.writeFileSync(dir + "/shim.d.ts", "declare var console: { log(...a: any[]): void };"); ex("tsc", ["--strict", "--noEmitOnError", "--target", "es2020", "--lib", "es2020", "--types", "", "--outDir", dir, dir + "/a.ts", dir + "/shim.d.ts"]); return ["node", [dir + "/a.js"]];
    case "php": return [TC + "php", [W("a.php")]];
    case "ruby": return [TC + "ruby", [W("a.rb")]];
    case "sql": return [TC + "sqlite3", [":memory:"], code];
  }
}
function run(lang, code, stdin, setup) {
  const dir = fs.mkdtempSync("/tmp/vc-");
  try {
    if (lang === "sql") code = (setup || "") + "\n" + code;
    const [cmd, args, inp] = build(lang, dir, code);
    return { ok: true, out: ex(cmd, args, { input: inp !== undefined ? inp : (stdin || ""), timeout: 8000 }).replace(/\s+$/, "").replace(/^\s+/, "") };
  } catch (e) { return { ok: false, out: (e.stdout || "").toString().trim(), err: ((e.stderr || "").toString() + e.message).split("\n").filter(Boolean).slice(0, 3).join(" / ") }; }
  finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
for (const lang of Object.keys(CURRICULUM)) { if (ONLY && !ONLY.includes(lang)) continue;
  const SEEDS = Math.min(ARG, SLOW[lang] || ARG);
  CURRICULUM[lang].forEach((C, ci) => C.v.forEach((_, vi) => {
    const seen = new Set();
    for (let s = 1; s <= SEEDS; s++) {
      const p = makeLesson(lang, ci, vi, mulberry32(s * 7919 + ci * 31 + vi));
      seen.add(p.c); n++;
      const fx = run(lang, p.fixedCode, p.stdin, p.setup), bg = run(lang, p.c, p.stdin, p.setup);
      const want = String(p.out).trim();
      const fixedGood = fx.ok && fx.out === want, buggyBad = !bg.ok || bg.out !== want;
      if (!fixedGood || !buggyBad) { bad++; console.log("FAIL", lang, C.k, "v" + vi, p.n, JSON.stringify({ fixedGood, buggyBad, want, got: fx.out, ferr: fx.err, bout: bg.out })); }
    }
    variety[lang + " | " + C.k] = (variety[lang + " | " + C.k] || 0) + seen.size;
  }));
}
console.log("checked", n, "failures", bad); if (process.env.V) console.log(JSON.stringify(variety, null, 1));
