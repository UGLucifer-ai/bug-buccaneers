/* Bug Buccaneers — "Ask Milo" AI brain (solo mode only).
   Optional in-browser model via WebLLM (loaded lazily from a CDN only when the
   player turns on "Add AI brain"; no API keys, nothing leaves the device).
   Fallback: Milo's logbook — keyword search over the game's own curriculum.
   Memory: lessons completed + bugs missed, stored in localStorage. */
(function () {
  const MODEL = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
  const MODEL_SIZE = "about 400 MB";
  const WEBLLM_URL = "https://esm.run/@mlc-ai/web-llm@0.2.79";
  const MEM_KEY = "bb-milo-memory", BRAIN_KEY = "bb-milo-brain";
  let engine = null, loading = false, brainOn = false, history = [];

  /* ---------- game state access (top-level consts in the main script) ---------- */
  function S() { try { return setup; } catch (e) { return { lang: "python", level: "beginner", mode: "solo" }; } }
  function Gs() { try { return G; } catch (e) { return null; } }
  function solo() { return S().mode === "solo"; }
  function label(m, k) { try { return m[k] || k; } catch (e) { return k; } }
  function langName(l) { try { return LANG_LABEL[l] || l; } catch (e) { return l; } }
  function roundActive() { const g = Gs(); return !!(g && !g.over && g.challenge && ["race", "pick", "fix", "oppverdict"].indexOf(g.phase) >= 0 && !document.getElementById("screen-game").classList.contains("hidden")); }

  /* ---------- memory ---------- */
  function memGet() { try { return JSON.parse(localStorage.getItem(MEM_KEY)) || { done: {}, missed: {} }; } catch (e) { return { done: {}, missed: {} }; } }
  function memPut(m) { try { localStorage.setItem(MEM_KEY, JSON.stringify(m)); } catch (e) {} }
  function remember(ok) {
    const g = Gs(); if (!g || !g.challenge || !solo()) return;
    const m = memGet(), key = S().lang + "|" + g.challenge.n;
    if (ok) m.done[key] = (m.done[key] || 0) + 1; else m.missed[key] = (m.missed[key] || 0) + 1;
    memPut(m);
  }
  function weakSpots(lang) {
    const m = memGet();
    return Object.keys(m.missed).filter(k => !lang || k.indexOf(lang + "|") === 0)
      .sort((a, b) => m.missed[b] - m.missed[a]).slice(0, 5).map(k => k.split("|")[1]);
  }
  function doneCount() { const m = memGet(); return Object.keys(m.done).length; }
  // wrap showExplanation (a global function declaration) to log each finished round
  if (typeof window.showExplanation === "function") {
    const orig = window.showExplanation;
    window.showExplanation = function () { try { const g = Gs(); remember(g && g.finder === "me" && g.finderCorrect); } catch (e) {} return orig.apply(this, arguments); };
  }

  /* ---------- context ---------- */
  function lessonFor(ch, lang) {
    const C = (window.BB_CURRICULUM || {})[lang] || [], g = Gs();
    if (S().level === "novice" && g && C.length) return C[(g.lessonStep || 0) % C.length];
    return null;
  }
  function context() {
    const s = S(), g = Gs(), ch = g && g.challenge, active = roundActive();
    let t = "Language: " + langName(s.lang) + ". Level: " + label({ novice: "Novice", beginner: "Beginner", expert: "Expert" }, s.level) + ".\n";
    const les = ch && lessonFor(ch, s.lang);
    if (les) t += "Current lesson: " + les.k + " — " + les.m + "\n";
    if (ch) {
      t += "Current puzzle: \"" + ch.n + "\"\nCode:\n" + ch.c + "\n";
      if (active) t += "A ROUND IS ACTIVE: do NOT say which line has the bug and do NOT give the fix. Only give a gentle hint about the topic.\n";
      else t += "The round is finished, so you may explain: " + ch.f + " Fix: " + ch.x + " Lesson: " + (ch.l || "") + "\n";
    }
    const w = weakSpots(s.lang);
    t += "Player has finished " + doneCount() + " puzzles. " + (w.length ? "Weak spots (bugs they missed): " + w.join("; ") + ". Gently connect your answer to these when relevant.\n" : "");
    return t;
  }
  const SYSTEM = "You are Captain Milo, a kind, encouraging pirate coding coach in the game Bug Buccaneers, talking to a child learning to code. " +
    "Rules: Only talk about coding, computers and this game; if asked anything else, cheerfully steer back to coding. Keep it safe and friendly for kids: no scary, violent, adult or personal topics, never ask for personal information. " +
    "Answer in 2-5 short sentences with simple words, a tiny code example when useful, and light pirate flavor (Arr, matey). " +
    "During an active round, NEVER reveal which line holds the bug and never give the fix — give a hint that teaches the idea instead. Always encourage the player.";

  /* ---------- logbook fallback ---------- */
  const STOP = new Set("what is a an the in of to how do does i my and or it this that why with on be can you me does is are use".split(" "));
  function words(s) { return (s.toLowerCase().match(/[a-z0-9_+=<>!]+/g) || []).filter(w => !STOP.has(w)); }
  const LANG_WORDS = { python: ["python"], javascript: ["javascript", "js"], java: ["java"], cpp: ["c++", "cpp"], sql: ["sql"], c: [" c "], csharp: ["c#", "csharp"], typescript: ["typescript", "ts"], go: ["go", "golang"], php: ["php"], ruby: ["ruby"], rust: ["rust"] };
  function detectLang(q) {
    const l = " " + q.toLowerCase() + " ";
    for (const k of ["typescript", "javascript", "csharp", "cpp", "python", "java", "sql", "ruby", "rust", "php", "go"])
      if (LANG_WORDS[k].some(w => new RegExp("(^|[^a-z#+])" + w.trim().replace(/[+#]/g, "\\$&") + "([^a-z#+]|$)").test(l))) return k;
    return S().lang;
  }
  function logbook(q) {
    const lang = detectLang(q), qw = words(q).filter(w => !(LANG_WORDS[lang] || []).includes(w));
    const qs = qw.map(w => w.replace(/s$/, ""));
    const docs = [];
    ((window.BB_CURRICULUM || {})[lang] || []).forEach(L => docs.push({ title: L.k, text: L.m, ex: L.ex, kind: "lesson" }));
    try { ["novice", "beginner", "expert"].forEach(lv => ((BANKS[lang] || {})[lv] || []).forEach(ch => docs.push({ title: ch.n, text: ch.f + " " + (ch.l || ""), ex: ch.x, kind: "bug" }))); } catch (e) {}
    let best = null, bs = 0;
    docs.forEach(d => {
      const tw = (d.title + " " + d.title).toLowerCase(), bw = (d.text + " " + (d.ex || "")).toLowerCase();
      let s = 0; qs.forEach(w => { if (w.length < 2) return; if (tw.indexOf(w) >= 0) s += 3; if (bw.indexOf(w) >= 0) s += 1; });
      if (d.kind === "lesson") s += 0.5;
      if (s > bs) { bs = s; best = d; }
    });
    let a;
    if (!best || bs < 2) a = "Arr, my logbook doesn't have a page on that, matey! Try asking about a " + langName(lang) + " idea like printing, variables, if statements or loops.";
    else {
      a = "📖 <b>" + esc(best.title) + "</b> (" + langName(lang) + "): " + esc(best.text);
      if (best.ex && !(roundActive() && Gs().challenge && best.ex.trim() === Gs().challenge.x.trim())) a += "<pre>" + esc(best.ex) + "</pre>";
    }
    if (roundActive() && /bug|line|answer|fix|wrong|which|where/i.test(q)) a += " 🧭 Hint for this round: " + esc(topicHint()) + " I won't tell ye the line — ye can find it!";
    const w = weakSpots(lang); if (w.length && Math.random() < 0.5) a += " ⚓ Practice tip: ye've tripped on \"" + esc(w[0]) + "\" before — keep an eye out for it!";
    return a;
  }
  function topicHint() {
    const ch = Gs().challenge, t = (ch.n + " " + ch.f).toLowerCase();
    if (/quote|string/.test(t)) return "look closely at the quote marks and text.";
    if (/bracket|paren|brace|indent/.test(t)) return "count the brackets and spaces.";
    if (/==|equal|compar|assign/.test(t)) return "think about = versus ==.";
    if (/loop|range|off-by|index|last|first/.test(t)) return "check where the counting starts and stops.";
    if (/spell|name|undefined|not defined|case|capital/.test(t)) return "check the spelling and capital letters of every name.";
    return "read each line slowly and ask: what does this line really do?";
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function scrub(ans) { // last-line guard: during a round, strip line-number reveals
    if (!roundActive()) return ans;
    return ans.replace(/\b(line|row)\s*(number\s*)?#?\d+/gi, "that part of the code");
  }

  /* ---------- WebLLM ---------- */
  function hasWebGPU() { return !!navigator.gpu; }
  async function loadBrain() {
    if (engine || loading) return;
    let adapter = null; try { adapter = navigator.gpu && await navigator.gpu.requestAdapter(); } catch (e) {}
    if (!adapter) { status("This device can't run the AI brain (no WebGPU). Milo is using his logbook 📖"); return; }
    loading = true; $("am-prog").classList.remove("hidden");
    try {
      const webllm = await import(/* webpackIgnore: true */ WEBLLM_URL);
      engine = await webllm.CreateMLCEngine(MODEL, {
        appConfig: Object.assign({}, webllm.prebuiltAppConfig, { useIndexedDBCache: true }),
        initProgressCallback: p => { $("am-bar").style.width = Math.round((p.progress || 0) * 100) + "%"; status("Loading AI brain… " + Math.round((p.progress || 0) * 100) + "%"); }
      });
      status("🧠 AI brain ready! (saved on this device for next time)");
    } catch (e) {
      engine = null; status("The AI brain couldn't load, so Milo is using his logbook 📖");
    } finally { loading = false; $("am-prog").classList.add("hidden"); }
  }
  async function ask(q) {
    if (brainOn && engine) {
      const msgs = [{ role: "system", content: SYSTEM + "\n\nGame info:\n" + context() }].concat(history.slice(-6), [{ role: "user", content: q }]);
      const r = await engine.chat.completions.create({ messages: msgs, temperature: 0.5, max_tokens: 220 });
      const a = scrub(r.choices[0].message.content || "");
      history.push({ role: "user", content: q }, { role: "assistant", content: a });
      return esc(a).replace(/```[a-z]*\n?([\s\S]*?)```/g, "<pre>$1</pre>");
    }
    return "<i>(📖 Milo is using his logbook)</i> " + logbook(q);
  }

  /* ---------- UI ---------- */
  const $ = id => document.getElementById(id);
  const css = document.createElement("style");
  css.textContent = `
#am-fab{position:fixed;right:14px;bottom:14px;z-index:60;border:0;border-radius:999px;padding:12px 16px;font:700 15px system-ui,sans-serif;background:linear-gradient(#ffd75e,#e0a21b);color:#3a2300;box-shadow:0 4px 14px #0008;cursor:pointer}
#am-panel{position:fixed;right:14px;bottom:70px;z-index:61;width:min(380px,calc(100vw - 28px));max-height:min(560px,calc(100vh - 100px));display:flex;flex-direction:column;background:#0f2238;color:#f4ecd8;border:2px solid #e0a21b;border-radius:16px;box-shadow:0 10px 30px #000a;font:14px/1.4 system-ui,sans-serif}
#am-panel.hidden,#am-fab.hidden,.am-h{display:none!important}
#am-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #e0a21b55;font-weight:700}
#am-head span{flex:1}#am-head button{background:none;border:0;color:#f4ecd8;font-size:18px;cursor:pointer}
#am-opts{padding:8px 12px;font-size:13px;border-bottom:1px solid #ffffff22}
#am-opts label{display:flex;gap:6px;align-items:center;font-weight:700}
#am-note{opacity:.8;font-size:12px;margin-top:4px}#am-status{font-size:12px;color:#ffd75e;margin-top:4px}
#am-prog{height:8px;background:#ffffff22;border-radius:4px;margin-top:6px;overflow:hidden}#am-bar{height:100%;width:0;background:#ffd75e}
#am-log{flex:1;overflow:auto;padding:10px 12px;display:flex;flex-direction:column;gap:8px;min-height:120px}
.am-m{padding:8px 10px;border-radius:12px;max-width:90%;word-wrap:break-word}.am-u{align-self:flex-end;background:#2b5a8a}.am-b{align-self:flex-start;background:#1d3a57}
.am-m pre{background:#0008;padding:6px;border-radius:6px;overflow:auto;margin:6px 0 0;font-size:12px}
#am-form{display:flex;gap:6px;padding:10px 12px;border-top:1px solid #ffffff22}
#am-q{flex:1;min-width:0;padding:8px 10px;border-radius:10px;border:1px solid #e0a21b;background:#091726;color:#fff;font-size:15px}
#am-form button{border:0;border-radius:10px;padding:8px 12px;font-weight:700;background:#ffd75e;color:#3a2300;cursor:pointer}
#am-forget{background:none;border:0;color:#9fc3e8;text-decoration:underline;font-size:12px;cursor:pointer;padding:0;margin-top:4px}`;
  document.head.appendChild(css);
  const wrap = document.createElement("div");
  wrap.innerHTML = `<button id="am-fab" type="button" aria-label="Ask Milo">🦜 Ask Milo</button>
<div id="am-panel" class="hidden" role="dialog" aria-label="Ask Milo chat">
 <div id="am-head">🏴‍☠️<span>Ask Captain Milo</span><button id="am-close" aria-label="Close">✕</button></div>
 <div id="am-opts"><label><input type="checkbox" id="am-brain"> 🧠 Add AI brain</label>
  <div id="am-note">Downloads a small AI model (${MODEL_SIZE}) once, then it's saved on this device. Runs on your device — no account, nothing sent away. Needs a browser with WebGPU; otherwise Milo uses his logbook.</div>
  <div id="am-prog" class="hidden"><div id="am-bar"></div></div><div id="am-status"></div>
  <button id="am-forget" type="button">🧽 Forget memory</button></div>
 <div id="am-log"></div>
 <form id="am-form"><input id="am-q" maxlength="300" autocomplete="off" placeholder="Ask about coding, matey…"><button type="submit">Ask</button></form>
</div>`;
  document.body.appendChild(wrap);
  function status(t) { $("am-status").textContent = t; }
  function add(html, who) { const d = document.createElement("div"); d.className = "am-m " + (who === "u" ? "am-u" : "am-b"); d.innerHTML = html; $("am-log").appendChild(d); $("am-log").scrollTop = 1e6; return d; }
  function sync() { const show = solo(); $("am-fab").classList.toggle("hidden", !show); if (!show) $("am-panel").classList.add("hidden"); }
  $("am-fab").addEventListener("click", () => {
    const p = $("am-panel"); p.classList.toggle("hidden");
    if (!p.classList.contains("hidden") && !$("am-log").children.length)
      add("Ahoy! I'm Captain Milo 🦜 Ask me anything about coding — like <i>what is a for loop in python?</i> During a round I'll give hints, not answers!");
  });
  $("am-close").addEventListener("click", () => $("am-panel").classList.add("hidden"));
  $("am-brain").addEventListener("change", e => {
    brainOn = e.target.checked; try { localStorage.setItem(BRAIN_KEY, brainOn ? "1" : "0"); } catch (x) {}
    if (brainOn) loadBrain(); else status("AI brain off — Milo is using his logbook 📖");
  });
  $("am-forget").addEventListener("click", () => { try { localStorage.removeItem(MEM_KEY); } catch (e) {} history = []; status("Memory wiped clean, matey! 🧽"); });
  $("am-form").addEventListener("submit", async e => {
    e.preventDefault(); const q = $("am-q").value.trim(); if (!q) return; $("am-q").value = "";
    add(esc(q), "u"); const d = add("…thinking 🤔");
    try { d.innerHTML = await ask(q); } catch (err) { d.innerHTML = "<i>(📖 logbook)</i> " + logbook(q); }
    $("am-log").scrollTop = 1e6;
  });
  // keep game keyboard shortcuts (P / Esc pause) from firing while typing
  $("am-q").addEventListener("keydown", e => e.stopPropagation());
  document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener("click", () => setTimeout(sync, 0)));
  setInterval(sync, 1000); sync();
  try { if (localStorage.getItem(BRAIN_KEY) === "1") { $("am-brain").checked = true; brainOn = true; if (hasWebGPU()) loadBrain(); else status("This device can't run the AI brain (no WebGPU). Milo is using his logbook 📖"); } } catch (e) {}
  window.__askMilo = { logbook, context, memGet, weakSpots, roundActive };
})();
