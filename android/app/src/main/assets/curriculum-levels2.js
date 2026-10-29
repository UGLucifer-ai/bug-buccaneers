/* Bug Buccaneers — more templated BEGINNER / EXPERT programs for Java, C, C++, C#, Go,
   Rust, TypeScript, PHP and Ruby (written once through a per-language "kit"), plus SQL
   Beginner/Expert queries run against a freshly random hidden table (p.setup).
   Loaded after curriculum-levels.js; every program, fix and decoy is compiled and run by
   tools/verify-curriculum.js (LEVELS=1). */
(function (root) {
  const T = root.BB_TPL; if (!T) return;
  const CREW = ["Milo", "Pearl", "Finn", "Ruby", "Jack", "Coral", "Marlo", "Sandy", "Nell", "Otto"];
  const sum = a => a.reduce((s, x) => s + x, 0);
  const ind = (ls, n) => ls.map(s => s === "" ? s : " ".repeat(n === undefined ? 4 : n) + s);
  const MARK = "\u0001";
  const pref = i => String(i).replace(/(^|[^@\w])([a-z_]\w*)/g, "$1@$2");
  const bug = s => MARK + s;

  /* ---------------- kits ---------------- */
  function cat(fmt, args, op, q) { // "a {} b" -> "a " + x + " b"
    const segs = fmt.split("{}"), out = [];
    segs.forEach((s, i) => { if (s) out.push(JSON.stringify(s)); if (i < args.length) out.push(args[i][0]); });
    return out.join(op);
  }
  const A = a => a.map(x => Array.isArray(x) ? x : [x, "d"]);
  const base = {
    e: s => s.replace(/@(\w+)/g, "$1"), end: "}", els: "} else {", s: ";",
    ifo: function (c) { return "if (" + this.e(c) + ") {"; }, wo: function (c) { return "while (" + this.e(c) + ") {"; },
    eif: function (c) { return "} else if (" + this.e(c) + ") {"; },
    set: function (n, x) { return this.e("@" + n + " = " + x) + this.s; }, inc: function (n, x) { return this.e("@" + n + " += " + x) + this.s; },
    ret: function (x) { return "return " + this.e(x) + this.s; }, st: function (x) { return this.e(x) + this.s; },
    retIf: function (c, v) { return "if (" + this.e(c) + ") return " + this.e(v) + ";"; },
    at: (a, i) => "@" + a + "[" + pref(i) + "]",
    call: function (f, as) { return f + "(" + as.map(x => this.e(x)).join(", ") + ")"; },
    argA: function (n) { return this.e("@" + n); },
    idiv: function (a, b) { return this.e(a + " / " + b); }, cm: "//"
  };
  const K = {};
  K.java = Object.assign({}, base, { L: "java",
    di: (n, x) => "int " + n + " = " + x + ";", da: (n, xs) => "int[] " + n + " = {" + xs.join(", ") + "};", ds: (n, xs) => "String[] " + n + " = {" + xs.map(x => '"' + x + '"').join(", ") + "};",
    len: a => a + ".length", fo: (i, a, b) => "for (int " + i + " = " + a + "; " + i + " < " + b + "; " + i + "++) {",
    ty: { int: "int", arr: "int[]", str: "String", void: "void" },
    fn: function (name, ps, ret, body) { return ["static " + this.ty[ret] + " " + name + "(" + ps.map(([n, t]) => this.ty[t] + " " + n).join(", ") + ") {", ...ind(body), "}"]; },
    p: (fmt, args) => "System.out.println(" + cat(fmt, A(args), " + ") + ");",
    wrap: (fns, body) => ["public class Main {", ...ind(fns), "    public static void main(String[] args) {", ...ind(body, 8), "    }", "}"] });
  K.csharp = Object.assign({}, K.java, { L: "csharp", ds: (n, xs) => "string[] " + n + " = {" + xs.map(x => '"' + x + '"').join(", ") + "};", len: a => a + ".Length",
    ty: { int: "int", arr: "int[]", str: "string", void: "void" },
    p: (fmt, args) => "Console.WriteLine(" + cat(fmt, A(args), " + ") + ");",
    wrap: (fns, body) => ["using System;", "class Program {", ...ind(fns), "    static void Main() {", ...ind(body, 8), "    }", "}"] });
  K.typescript = Object.assign({}, K.java, { L: "typescript", di: (n, x) => "let " + n + " = " + x + ";", da: (n, xs) => "const " + n + ": number[] = [" + xs.join(", ") + "];", ds: (n, xs) => "const " + n + ": string[] = [" + xs.map(x => '"' + x + '"').join(", ") + "];",
    fo: (i, a, b) => "for (let " + i + " = " + a + "; " + i + " < " + b + "; " + i + "++) {", ty: { int: "number", arr: "number[]", str: "string", void: "void" },
    fn: function (name, ps, ret, body) { return ["function " + name + "(" + ps.map(([n, t]) => n + ": " + this.ty[t]).join(", ") + "): " + this.ty[ret] + " {", ...ind(body, 2), "}"]; },
    idiv: (a, b) => "Math.floor(" + a.replace(/@/g, "") + " / " + (/ /.test(b) ? "(" + b + ")" : b).replace(/@/g, "") + ")",
    p: (fmt, args) => "console.log(" + cat(fmt, A(args), " + ") + ");", wrap: (fns, body) => [...fns, ...body] });
  K.c = Object.assign({}, base, { L: "c",
    di: (n, x) => "int " + n + " = " + x + ";", da: (n, xs) => "int " + n + "[] = {" + xs.join(", ") + "};", ds: (n, xs) => "const char *" + n + "[] = {" + xs.map(x => '"' + x + '"').join(", ") + "};",
    len: (a, inFn) => inFn ? "n" : "(int)(sizeof " + a + " / sizeof " + a + "[0])", fo: (i, a, b) => "for (int " + i + " = " + a + "; " + i + " < " + b + "; " + i + "++) {",
    ty: { int: "int", str: "const char *", void: "void" },
    fn: function (name, ps, ret, body) { return [this.ty[ret] + (ret === "str" ? "" : " ") + name + "(" + ps.map(([n, t]) => t === "arr" ? "int " + n + "[], int n" : this.ty[t] + (t === "str" ? "" : " ") + n).join(", ") + ") {", ...ind(body), "}"]; },
    argA: n => n + ", (int)(sizeof " + n + " / sizeof " + n + "[0])",
    p: (fmt, args) => { args = A(args); return "printf(" + JSON.stringify(fmt.split("{}").map((s, i) => s + (i < args.length ? (args[i][1] === "s" ? "%s" : "%d") : "")).join("") + "\n") + (args.length ? ", " + args.map(a => a[0]).join(", ") : "") + ");"; },
    wrap: (fns, body, o) => ["#include <stdio.h>", ...((o && o.head) || []), "", ...fns, "int main(void) {", ...ind(body), "    return 0;", "}"] });
  K.cpp = Object.assign({}, K.c, { L: "cpp", da: (n, xs) => "vector<int> " + n + " = {" + xs.join(", ") + "};", ds: (n, xs) => "vector<string> " + n + " = {" + xs.map(x => '"' + x + '"').join(", ") + "};",
    len: a => "(int)" + a + ".size()", at: (a, i) => a + ".at(" + pref(i) + ")", ty: { int: "int", arr: "const vector<int>&", str: "string", void: "void" },
    fn: function (name, ps, ret, body) { return [this.ty[ret] + " " + name + "(" + ps.map(([n, t]) => this.ty[t] + " " + n).join(", ") + ") {", ...ind(body), "}"]; },
    argA: n => n, p: (fmt, args) => "cout << " + cat(fmt, A(args), " << ") + " << endl;",
    wrap: (fns, body) => ["#include <iostream>", "#include <vector>", "using namespace std;", "", ...fns, "int main() {", ...ind(body), "}"] });
  K.go = Object.assign({}, base, { L: "go", s: "",
    ifo: c => "if " + c + " {", wo: c => "for " + c + " {", eif: c => "} else if " + c + " {", retIf: (c, v) => "if " + c + " {", 
    di: (n, x) => n + " := " + x, da: (n, xs) => n + " := []int{" + xs.join(", ") + "}", ds: (n, xs) => n + " := []string{" + xs.map(x => '"' + x + '"').join(", ") + "}",
    len: a => "len(" + a + ")", fo: (i, a, b) => "for " + i + " := " + a + "; " + i + " < " + b + "; " + i + "++ {",
    ty: { int: "int", arr: "[]int", str: "string", void: "" },
    fn: function (name, ps, ret, body) { return ["func " + name + "(" + ps.map(([n, t]) => n + " " + this.ty[t]).join(", ") + ")" + (this.ty[ret] ? " " + this.ty[ret] : "") + " {", ...ind(body), "}"]; },
    p: (fmt, args) => { args = A(args); return "fmt.Printf(" + JSON.stringify(fmt.replace(/%/g, "%%").split("{}").join("%v") + "\n") + (args.length ? ", " + args.map(a => a[0]).join(", ") : "") + ")"; },
    wrap: (fns, body) => ["package main", "", 'import "fmt"', "", ...fns, "func main() {", ...ind(body), "}"] });
  K.go.retIf = (c, v) => "if " + c + " { return " + v + " }";
  K.rust = Object.assign({}, base, { L: "rust",
    ifo: c => "if " + c + " {", wo: c => "while " + c + " {", eif: c => "} else if " + c + " {", retIf: (c, v) => "if " + c + " { return " + v + "; }",
    di: (n, x) => "let mut " + n + " = " + x + ";", da: (n, xs) => "let " + n + " = [" + xs.join(", ") + "];", ds: (n, xs) => "let " + n + " = [" + xs.map(x => '"' + x + '"').join(", ") + "];",
    at: (a, i) => a + "[" + (/\W/.test(i) ? "(" + pref(i) + ")" : pref(i)) + " as usize]", len: a => "(" + a + ".len() as i32)",
    fo: (i, a, b) => "for " + i + " in " + a + ".." + b + " {", ty: { int: "i32", arr: "&[i32]", str: "&str", void: "" },
    fn: function (name, ps, ret, body) { return ["fn " + name + "(" + ps.map(([n, t]) => n + ": " + this.ty[t]).join(", ") + ")" + (ret === "void" ? "" : " -> " + (ret === "str" ? "&'static str" : this.ty[ret])) + " {", ...ind(body), "}"]; },
    argA: n => "&" + n, p: (fmt, args) => { args = A(args); return "println!(" + JSON.stringify(fmt) + (args.length ? ", " + args.map(a => a[0]).join(", ") : "") + ");"; },
    wrap: (fns, body) => [...fns, "fn main() {", ...ind(body), "}"] });
  K.php = Object.assign({}, base, { L: "php", e: s => s.replace(/@(\w+)/g, "$$$1"),
    di: (n, x) => "$" + n + " = " + x.replace(/@(\w+)/g, "$$$1") + ";", da: (n, xs) => "$" + n + " = [" + xs.join(", ") + "];", ds: (n, xs) => "$" + n + " = [" + xs.map(x => '"' + x + '"').join(", ") + "];",
    len: a => "count($" + a + ")", fo: (i, a, b) => "for ($" + i + " = " + a + "; $" + i + " < " + b + "; $" + i + "++) {",
    fn: function (name, ps, ret, body) { return ["function " + name + "(" + ps.map(([n]) => "$" + n).join(", ") + ") {", ...ind(body), "}"]; },
    idiv: (a, b) => "intdiv(" + a.replace(/@(\w+)/g, "$$$1") + ", " + b.replace(/@(\w+)/g, "$$$1") + ")",
    p: (fmt, args) => "echo " + cat(fmt + "\n", A(args), " . ").replace(/@(\w+)/g, "$$$1") + ";", wrap: (fns, body) => ["<?php", ...fns, ...body] });
  K.ruby = Object.assign({}, base, { L: "ruby", s: "", end: "end", els: "else", cm: "#",
    ifo: c => "if " + c, wo: c => "while " + c, eif: c => "elsif " + c, retIf: (c, v) => "return " + v + " if " + c,
    di: (n, x) => n + " = " + x, da: (n, xs) => n + " = [" + xs.join(", ") + "]", ds: (n, xs) => n + " = [" + xs.map(x => '"' + x + '"').join(", ") + "]",
    len: a => a + ".length", fo: (i, a, b) => "for " + i + " in " + a + "..." + b,
    fn: function (name, ps, ret, body) { return ["def " + name + "(" + ps.map(([n]) => n).join(", ") + ")", ...ind(body, 2), "end"]; },
    p: (fmt, args) => { args = A(args); return "puts " + JSON.stringify(fmt.split("{}").map((s, i) => s + (i < args.length ? "#{" + args[i][0] + "}" : "")).join("")).replace(/\\"/g, '"').replace(/^"(.*)"$/, (m, x) => '"' + x.replace(/"/g, "'") + '"'); },
    wrap: (fns, body) => [...fns, ...body] });
  // php/ruby/ts keep the per-kit e(); php also rewrites @vars in di/p above
  const LANGS = ["java", "c", "cpp", "csharp", "go", "rust", "typescript", "php", "ruby"];

  // turn marked lines into a template record
  function build(k, lines, x, w, txt) {
    const b = lines.findIndex(s => s.indexOf(MARK) >= 0);
    const lead = lines[b].slice(0, lines[b].indexOf(MARK));
    const fin = s => k.L === "php" ? s.replace(/\$?@(\w+)/g, "$$$1") : s.replace(/@(\w+)/g, "$1");
    const clean = lines.map(s => fin(s.replace(MARK, "")));
    return Object.assign({ lines: clean, b, x: fin(lead + x), w: w.map(d => fin(lead + d)) }, txt);
  }
  const W = (k, fns, body, o) => k.wrap(fns, body, o);
  const blk = (k, head, body) => [head, ...ind(body), k.end];
  const blkE = (k, head, body, body2) => [head, ...ind(body), k.els, ...ind(body2), k.end];
  const S = s => [s, "s"];
  const cmt = (k, t) => k.cm + " " + t;

  /* ---------------- BEGINNER concepts ---------------- */
  const BEG = {
    rank80: (k, r) => { const ns = r.picks(CREW, 3), s = [80, r.int(50, 79), r.int(10, 49)], rk = x => x >= 80 ? "First mate" : x >= 50 ? "Deckhand" : "Cabin kid";
      const fns = k.fn("rankOf", [["score", "int"]], "str", [bug(k.retIf("@score > 80", '"First mate"')), k.retIf("@score >= 50", '"Deckhand"'), k.ret('"Cabin kid"')]);
      const body = [cmt(k, "80 or more makes First mate, 50 or more makes Deckhand"), ...ns.map((n, i) => k.p(n + " is a {}", [S(k.call("rankOf", [String(s[i])]))]))];
      return build(k, W(k, fns, body), k.retIf("@score >= 80", '"First mate"'), [k.retIf("@score >= 81", '"First mate"'), k.retIf("@score > 81", '"First mate"')],
        { n: "Exactly 80 misses out", f: "> 80 leaves out a score of exactly 80, but the rule says 80 OR MORE. Milo's tip: test the edge value itself.", e: ns[0] + " scored exactly 80 but is called a Deckhand.", l: "'or more' means >=.", out: ns.map((n, i) => n + " is a " + rk(s[i])).join("\n") }); },
    low: (k, r) => { const a = r.ints(5, 6, 40);
      const body = [k.da("tides", a), bug(k.di("low", "0")), k.fo("i", "0", k.len("tides")), ...ind(blk(k, k.ifo(k.at("tides", "i") + " < @low"), [k.set("low", k.at("tides", "i"))])), k.end, k.p("Tides read: {}", [k.len("tides")]), k.p("Lowest tide: {}", [k.e("@low")])];
      return build(k, W(k, [], body), k.di("low", k.at("tides", "0")), [k.di("low", "-1"), k.di("low", k.len("tides"))],
        { n: "Lowest starts too low", f: "low starts at 0, and no tide is ever lower than 0, so low never changes. Start with the first tide instead.", e: "It says the lowest tide is 0.", l: "Start a min (or max) search with the first item, not a made-up number.", out: "Tides read: 5\nLowest tide: " + Math.min(...a) }); },
    evens: (k, r) => { let a; do { a = r.ints(6, 2, 30); } while (a.filter(x => x % 2 === 0).length * 2 === 6 || a.every(x => x % 2) || a.every(x => x % 2 === 0));
      const ev = a.filter(x => x % 2 === 0).length;
      const body = [k.da("loot", a), k.di("evens", "0"), k.fo("i", "0", k.len("loot")), ...ind(blk(k, bug(k.ifo(k.at("loot", "i") + " % 2 == 1")), [k.inc("evens", "1")])), k.end, k.p("Chests: {}", [k.len("loot")]), k.p("Even piles: {}", [k.e("@evens")])];
      return build(k, W(k, [], body), k.ifo(k.at("loot", "i") + " % 2 == 0"), [k.ifo(k.at("loot", "i") + " % 2 == 2"), k.ifo(k.at("loot", "i") + " / 2 == 0")],
        { n: "Counting the odd ones", f: "n % 2 == 1 is true for ODD numbers. An even number leaves remainder 0 when split in 2.", e: "It counts the odd piles instead of the even ones.", l: "Even means n % 2 == 0.", out: "Chests: 6\nEven piles: " + ev }); },
    share: (k, r) => { const c = r.int(3, 6); let e, rem; do { e = r.int(4, 12); rem = r.int(1, c - 1); } while (rem === e); const g = c * e + rem;
      const fns = k.fn("share", [["gold", "int"], ["crew", "int"]], "int", [bug(k.ret("@gold % @crew"))]);
      const body = [k.di("gold", String(g)), k.di("crew", String(c)), k.di("each", k.call("share", ["@gold", "@crew"])), k.p("Each pirate gets {}", [k.e("@each")]), k.di("left", "@gold - @each * @crew"), k.p("Captain keeps {}", [k.e("@left")])];
      return build(k, W(k, fns, body), k.ret(k.idiv("@gold", "@crew")), [k.ret(k.idiv("@crew", "@gold")), k.ret("@gold - @crew")],
        { n: "Remainder instead of share", f: "% gives what is LEFT OVER after sharing. To split the gold you divide.", e: "Each pirate gets only " + rem + ".", l: "/ shares out, % is the leftover.", out: "Each pirate gets " + e + "\nCaptain keeps " + rem }); },
    idx: (k, r) => { let c; do { c = r.ints(5, 3, 40); } while (sum(c) === 10 || sum(c) === c[4] || sum(c) === 5 * c[0]);
      const body = [k.da("chests", c), k.di("total", "0"), k.fo("i", "0", k.len("chests")), "    " + bug(k.inc("total", "@i")), k.end, k.p("Chests: {}", [k.len("chests")]), k.p("Total loot: {}", [k.e("@total")])];
      return build(k, W(k, [], body), k.inc("total", k.at("chests", "i")), [k.set("total", k.at("chests", "i")), k.inc("total", k.at("chests", "0"))],
        { n: "Adding the position, not the gold", f: "i is the chest's POSITION (0, 1, 2…). The gold inside is chests[i].", e: "The total is 10 — just 0+1+2+3+4.", l: "a[i] is the value; i is only where it sits.", out: "Chests: 5\nTotal loot: " + sum(c) }); },
    swap: (k, r) => { const a = r.int(2, 30); let b; do { b = r.int(2, 30); } while (b === a);
      const body = [k.di("port", String(a)), k.di("starboard", String(b)), k.p("Before: port {} starboard {}", [k.e("@port"), k.e("@starboard")]), cmt(k, "swap the cannonballs"), k.di("tmp", "@port"), k.set("port", "@starboard"), bug(k.set("starboard", "@port")), k.p("After: port {} starboard {}", [k.e("@port"), k.e("@starboard")])];
      return build(k, W(k, [], body), k.set("starboard", "@tmp"), [k.set("starboard", "@starboard"), k.set("tmp", "@starboard")],
        { n: "Swap loses a value", f: "By the time starboard = port runs, port already holds the starboard number. That's why tmp saved the old port value.", e: "Both sides end up with " + b + ".", l: "Swap with a temporary variable.", out: "Before: port " + a + " starboard " + b + "\nAfter: port " + b + " starboard " + a }); },
    prec: (k, r) => { const g = r.int(5, 40); let b; do { b = r.int(2, 20); } while (b === g);
      const body = [k.di("gold", String(g)), k.di("bonus", String(b)), cmt(k, "double the gold AND the bonus"), bug(k.di("total", "@gold + @bonus * 2")), k.p("Gold: {} Bonus: {}", [k.e("@gold"), k.e("@bonus")]), k.p("Doubled haul: {}", [k.e("@total")])];
      return build(k, W(k, [], body), k.di("total", "(@gold + @bonus) * 2"), [k.di("total", "@gold * 2 + @bonus"), k.di("total", "@gold + (@bonus * 2)")],
        { n: "Times before plus", f: "* happens before +, so only the bonus gets doubled. Brackets make the + happen first.", e: "The haul is " + (g + b * 2) + " instead of " + (g + b) * 2 + ".", l: "Use ( ) to choose what happens first.", out: "Gold: " + g + " Bonus: " + b + "\nDoubled haul: " + (g + b) * 2 }); }
  };

  /* ---------------- EXPERT concepts ---------------- */
  const EXP = {
    bsearch: (k, r) => { const a = r.picks([...Array(60).keys()].map(i => i + 3), 7).sort((x, y) => x - y); let miss; do { miss = r.int(a[0] + 1, a[6] - 1); } while (a.includes(miss));
      const ts = r.picks([a[6], a[0], miss], 3); const where = t => a.indexOf(t);
      const fn = k.fn("find", [["a", "arr"], ["target", "int"]], "int", [k.di("lo", "0"), k.di("hi", k.len("a", true) + " - 1"), bug(k.wo("@lo < @hi")), ...ind([k.di("mid", k.idiv("(@lo + @hi)", "2")), k.retIf(k.at("a", "mid") + " == @target", "@mid"), k.ifo(k.at("a", "mid") + " < @target"), "    " + k.set("lo", "@mid + 1"), k.els, "    " + k.set("hi", "@mid - 1"), k.end]), k.end, k.ret("-1")]);
      const body = [cmt(k, "chest numbers, sorted smallest first"), k.da("chests", a), ...ts.map(t => k.p("Chest " + t + " is in slot {}", [k.call("find", [k.argA("chests"), String(t)])]))];
      const g = k.L === "go" ? fn.map(s => s.replace(/:= \(lo \+ hi\) \/ 2/, ":= (lo + hi) / 2")) : fn;
      return build(k, W(k, g, body), k.wo("@lo <= @hi"), [k.wo("@lo < @hi - 1"), k.wo("@lo > @hi")],
        { n: "Binary search gives up one step early", f: "When lo and hi meet there is still ONE slot left to check. lo < hi stops before checking it, so chests at the very ends can go missing.", e: "Some chests that ARE there report -1.", l: "Classic binary search loops while lo <= hi.", out: ts.map(t => "Chest " + t + " is in slot " + where(t)).join("\n") }); },
    streak: (k, r) => { const A_ = 2, B = r.int(3, 4), C = r.int(1, 2); const rn = n => r.ints(n, 1, 9); const d = [...rn(A_), 0, ...rn(B), 0, ...rn(C)];
      const fn = k.fn("longest", [["a", "arr"]], "int", [k.di("best", "0"), k.di("cur", "0"), k.fo("i", "0", k.len("a", true)), ...ind([...blkE(k, k.ifo(k.at("a", "i") + " > 0"), [k.inc("cur", "1"), k.ifo("@cur > @best"), "    " + k.set("best", "@cur"), k.end], [bug(k.set("cur", "1"))])]), k.end, k.ret("@best")]);
      const body = [cmt(k, "gold found each day at sea (0 = empty day)"), k.da("days", d), k.p("Days at sea: {}", [k.len("days")]), k.p("Longest lucky streak: {}", [k.call("longest", [k.argA("days")])])];
      return build(k, W(k, fn, body), k.set("cur", "0"), [k.set("cur", "@cur - 1"), k.set("best", "0")],
        { n: "Streak restarts at 1", f: "An empty day should RESET the streak to 0. Setting it to 1 counts the empty day as lucky, so the next streak is one too long.", e: "The longest streak is " + (B + 1) + " instead of " + B + ".", l: "A reset means back to zero.", out: "Days at sea: " + d.length + "\nLongest lucky streak: " + B }); },
    rise: (k, r) => { let a; do { a = r.ints(6, 5, 60); } while (!(a[5] - a[4] > 0 && a[5] - a[4] > Math.max(...[0, 1, 2, 3].map(i => a[i + 1] - a[i])) && a[5] - a[4] !== -a[5]));
      const fn = k.fn("biggestRise", [["a", "arr"]], "int", [k.di("best", "0"), bug(k.fo("i", "0", k.len("a", true))), ...ind([k.di("diff", k.at("a", "i + 1") + " - " + k.at("a", "i")), k.ifo("@diff > @best"), "    " + k.set("best", "@diff"), k.end]), k.end, k.ret("@best")]);
      const body = [cmt(k, "price of rum at each port, in order"), k.da("prices", a), k.p("Ports visited: {}", [k.len("prices")]), k.p("Biggest jump: {}", [k.call("biggestRise", [k.argA("prices")])])];
      return build(k, W(k, fn, body), k.fo("i", "0", k.len("a", true) + " - 1"), [k.fo("i", "0", k.len("a", true) + " - 2"), k.fo("i", "1", k.len("a", true))],
        { n: "Peeking past the last port", f: "The loop reads a[i + 1], so i must stop one BEFORE the last index, otherwise the last step looks past the end of the list.", e: "It crashes (or reads junk) on the last port.", l: "When you use a[i + 1], loop to length - 1.", out: "Ports visited: 6\nBiggest jump: " + (a[5] - a[4]) }); },
    percent: (k, r) => { const ns = r.picks(CREW, 3); let H, p; do { H = r.int(150, 400); p = [r.int(10, 60), r.int(10, 60), r.int(10, 60)]; } while (new Set(p.map(x => Math.floor(x * 100 / H))).size < 2);
      const pc = p.map(x => Math.floor(x * 100 / H));
      const fn = k.fn("percent", [["part", "int"], ["total", "int"]], "int", [cmt(k, "whole-number percent, rounded down"), bug(k.ret(k.L === "php" || k.L === "typescript" ? k.idiv("@part", "@total") + " * 100" : "@part / @total * 100")), ]);
      const body = [k.di("haul", String(H)), k.ds("names", ns), k.da("shares", p), k.di("given", "0"), k.fo("i", "0", k.len("shares")), "    " + k.p("{} gets {}%", [S(k.at("names", "i")), k.call("percent", [k.at("shares", "i"), "@haul"])]), "    " + k.inc("given", k.at("shares", "i")), k.end, k.p("Gold handed out: {} of {}", [k.e("@given"), k.e("@haul")])];
      const fx = k.L === "php" || k.L === "typescript" ? k.idiv("@part * 100", "@total") : "@part * 100 / @total";
      const d1 = k.L === "php" || k.L === "typescript" ? k.idiv("@part", "@total * 100") : "@part / (@total * 100)";
      const d2 = k.L === "php" || k.L === "typescript" ? k.idiv("100", "@total") + " * @part" : "100 / @total * @part";
      const out = ns.map((n, i) => n + " gets " + pc[i] + "%").join("\n") + "\nGold handed out: " + sum(p) + " of " + H;
      return build(k, W(k, fn, body), k.ret(fx), [k.ret(d1), k.ret(d2)],
        { n: "Every share rounds to 0%", f: "With whole numbers, part / total is 0 whenever part is smaller than total — the fraction is thrown away BEFORE you multiply. Multiply by 100 first, then divide.", e: "Every sailor gets 0%.", l: "In integer maths, multiply before you divide.", out }); }
  };
  // a fresh copy vs. a second name for the same list
  EXP.alias = (k, r) => { const a = r.ints(4, 10, 80).map(x => x * 2);
    const S2 = { java: ["int[] backup = loot;", "int[] backup = loot.clone();", ["int[] backup = new int[loot.length];", "int[] backup = loot.clone;"]],
      csharp: ["int[] backup = loot;", "int[] backup = (int[])loot.Clone();", ["int[] backup = new int[loot.Length];", "int[] backup = loot.Clone;"]],
      cpp: ["vector<int>& backup = loot;", "vector<int> backup = loot;", ["vector<int>& backup = *(&loot);", "vector<int> backup(loot.size());"]],
      go: ["backup := loot", "backup := append([]int{}, loot...)", ["backup := loot[:]", "backup := make([]int, len(loot))"]],
      typescript: ["const backup = loot;", "const backup = [...loot];", ["const backup = [loot];", "const backup = loot.slice(4);"]],
      ruby: ["backup = loot", "backup = loot.dup", ["backup = [loot]", "backup = loot.itself"]],
      php: ["$backup = &$loot;", "$backup = $loot;", ["$backup = &$loot[0];", "$backup = [];"]] }[k.L];
    const raidP = k.L === "php" ? "&$a" : null; const L = k.L === "cpp" ? "vector<int>& a" : null;
    let raid = k.fn("raid", [["a", "arr"]], "void", [k.fo("i", "0", k.len("a", true)), "    " + k.set("a[i]", k.idiv("@a[i]", "2")), k.end]);
    if (raidP) raid[0] = raid[0].replace("($a)", "(&$a)"); if (L) raid[0] = raid[0].replace("const vector<int>& a", L);
    if (k.L === "php") raid = raid.map(s => s.replace("$a[i]", "$a[$i]").replace("$a[i]", "$a[$i]"));
    if (k.L === "go") raid[0] = "func raid(a []int) {";
    const tot = k.fn("total", [["a", "arr"]], "int", [k.di("t", "0"), k.fo("i", "0", k.len("a", true)), "    " + k.inc("t", k.at("a", "i")), k.end, k.ret("@t")]);
    const body = [k.da("loot", a).replace(/^const /, "let "), bug(S2[0]), k.call("raid", [k.argA("loot")]) + k.s, k.p("Raided ship keeps: {}", [k.call("total", [k.argA("loot")])]), k.p("Backup still has: {}", [k.call("total", [k.argA("backup")])])];
    return build(k, W(k, [...tot, ...raid], body), S2[1], S2[2],
      { n: "Backup is the same list", f: "This line doesn't copy anything — backup is just a second NAME for the same list, so when raid() halves loot, the backup changes too.", e: "The backup shows the raided amount " + sum(a) / 2 + ".", l: "Make a real copy before changing a list you want to keep.", out: "Raided ship keeps: " + sum(a) / 2 + "\nBackup still has: " + sum(a) }); };
  EXP.overflow = (k, r) => { const a = r.ints(4, 70, 120);
    const lines = ["fn total(loot: &[u8]) -> u32 {", "    let mut t = 0;", "    for x in loot.iter() {", bug("        t += x;"), "    }", "    t", "}", "", "fn main() {", "    // each sailor's gold fits in a u8 (0 to 255)", "    let loot: [u8; 4] = [" + a.join(", ") + "];", "    let biggest = loot.iter().max().unwrap();", '    println!("Sailors: {}", loot.len());', '    println!("Richest sailor: {}", biggest);', '    println!("Whole crew: {}", total(&loot));', "}"];
    return build(k, lines, "        t += *x as u32;", ["        t += *x;", "        t += x as u32;"],
      { n: "Gold too big for a u8", f: "Each sailor's gold is a u8, which tops out at 255. Adding them up as u8 goes past 255 and Rust panics. Widen each value to u32 before adding.", e: "Rust panics: attempt to add with overflow (or won't compile).", l: "Pick a type big enough for the TOTAL, not just each item.", out: "Sailors: 4\nRichest sailor: " + Math.max(...a) + "\nWhole crew: " + sum(a) }); };
  EXP.csizeof = (k, r) => { let a; const av = (x, m) => Math.floor(sum(x.slice(0, m)) / m); do { a = r.ints(r.int(5, 7), 3, 40); } while (av(a, a.length - 1) === av(a, a.length) || av(a, 2) === av(a, a.length));
    const lines = ["#include <stdio.h>", "", "/* average gold per sailor */", "int average(int gold[], int n) {", bug("    int count = sizeof gold / sizeof gold[0];"), "    int total = 0;", "    for (int i = 0; i < count; i++) {", "        total += gold[i];", "    }", "    return total / count;", "}", "", "int main(void) {", "    int gold[] = {" + a.join(", ") + "};", "    int n = sizeof gold / sizeof gold[0];", '    printf("Sailors: %d\\n", n);', '    printf("Average gold: %d\\n", average(gold, n));', "    return 0;", "}"];
    return build(k, lines, "    int count = n;", ["    int count = sizeof(gold);", "    int count = n - 1;"],
      { n: "sizeof on an array parameter", f: "Inside a function, an array parameter is really just a POINTER, so sizeof gives the pointer's size (8), not the array's. That's exactly why n is passed in.", e: "It averages only the first 2 sailors.", l: "Pass the length into functions; sizeof only works where the array was declared.", out: "Sailors: " + a.length + "\nAverage gold: " + Math.floor(sum(a) / a.length) }); };
  EXP.cstrcmp = (k, r) => { const ns = r.picks(CREW, 4), cap = r.pick(ns);
    const lines = ["#include <stdio.h>", "#include <string.h>", "", "int find_captain(const char *crew[], int n, const char *wanted) {", "    for (int i = 0; i < n; i++) {", bug("        if (crew[i] == wanted) {"), "            return i;", "        }", "    }", "    return -1;", "}", "", "int main(void) {", "    const char *crew[] = {" + ns.map(x => '"' + x + '"').join(", ") + "};", "    char wanted[16];", '    strcpy(wanted, "' + cap + '");', "    int at = find_captain(crew, 4, wanted);", '    printf("Looking for %s\\n", wanted);', '    printf("Found at slot %d\\n", at);', "    return 0;", "}"];
    return build(k, lines, "        if (strcmp(crew[i], wanted) == 0) {", ["        if (*crew[i] == *wanted + 1) {", "        if (strcmp(crew[i], wanted)) {"],
      { n: "Comparing addresses, not names", f: "== on two char pointers asks 'are these the same place in memory?', not 'do they spell the same name?'. wanted is a copy, so it never matches. strcmp compares the letters.", e: "Found at slot -1.", l: "Compare C strings with strcmp(a, b) == 0.", out: "Looking for " + cap + "\nFound at slot " + ns.indexOf(cap) }); };
  EXP.tssort = (k, r) => { let a; do { a = [r.int(2, 9), r.int(10, 89), r.int(10, 89), r.int(2, 9), r.int(100, 300)]; } while (new Set(a).size < 5); const s = a.slice().sort((x, y) => x - y);
    const lines = ["// gold weighed at each island", "const weights: number[] = [" + a.join(", ") + "];", "", "function rank(nums: number[]): number[] {", "  const copy = [...nums];", bug("  copy.sort();"), "  return copy;", "}", "", "function report(sorted: number[]): void {", '  console.log("Lightest: " + sorted[0]);', '  console.log("Heaviest: " + sorted[sorted.length - 1]);', '  console.log("In order: " + sorted.join(" "));', "}", "", "const sorted = rank(weights);", "report(sorted);", 'console.log("Islands: " + sorted.length);'];
    return build(k, lines, "  copy.sort((a, b) => a - b);", ["  copy.sort((a, b) => b - a);", "  copy.reverse();"],
      { n: "sort() sorts numbers as text", f: "With no compare function, sort() turns numbers into text and sorts them letter by letter, so 100 comes before 9. TypeScript's types don't catch it.", e: "The order is wrong, and so are lightest and heaviest.", l: "Sort numbers with (a, b) => a - b.", out: "Lightest: " + s[0] + "\nHeaviest: " + s[4] + "\nIn order: " + s.join(" ") + "\nIslands: 5" }); };
  EXP.phpstrpos = (k, r) => { const maps = ["X..~~", "~X..~", "..~X~", "X~~..", "~~.X."]; const ms = r.picks(maps, 3); if (!ms.some(m => m[0] === "X")) ms[0] = "X..~~";
    const lines = ["<?php", "// each map row: X marks the treasure", "$maps = [" + ms.map(m => '"' + m + '"').join(", ") + "];", "", "function hasTreasure($row) {", bug('    if (strpos($row, "X")) {'), "        return true;", "    }", "    return false;", "}", "", "function survey($maps) {", "    $found = 0;", "    foreach ($maps as $i => $row) {", "        $mark = hasTreasure($row) ? \"treasure\" : \"nothing\";", '        echo "Map $i: $mark\\n";', "        if ($mark === \"treasure\") $found++;", "    }", "    return $found;", "}", "", '$n = survey($maps);', 'echo "Maps with treasure: $n\\n";'];
    return build(k, lines, '    if (strpos($row, "X") !== false) {', ['    if (strpos($row, "X") > 0) {', '    if (strpos($row, "X") != false) {'],
      { n: "Found at position 0 counts as false", f: "strpos returns the POSITION of X. When X is the very first letter that position is 0 — and if (0) is false. Compare with !== false instead.", e: "Maps that start with X say 'nothing'.", l: "Use !== false with strpos.", out: ms.map((m, i) => "Map " + i + ": treasure").join("\n") + "\nMaps with treasure: 3" }); };

  /* ---------------- register ---------------- */
  const BEGS = ["rank80", "low", "evens", "share", "idx", "swap", "prec"];
  const EXPS = { java: ["bsearch", "streak", "rise", "alias", "percent"], csharp: ["bsearch", "streak", "rise", "alias", "percent"], cpp: ["bsearch", "streak", "rise", "alias", "percent"],
    go: ["bsearch", "streak", "rise", "alias", "percent"], ruby: ["bsearch", "streak", "rise", "alias", "percent"], rust: ["bsearch", "streak", "rise", "overflow", "percent"],
    typescript: ["bsearch", "streak", "alias", "percent", "tssort"], php: ["bsearch", "streak", "alias", "percent", "phpstrpos"], c: ["bsearch", "streak", "csizeof", "percent", "cstrcmp"] };
  LANGS.forEach(L => { T[L] = T[L] || { beginner: [], expert: [] };
    BEGS.forEach(c => T[L].beginner.push(r => pad(K[L], BEG[c](K[L], r), 9)));
    EXPS[L].forEach(c => T[L].expert.push(r => pad(K[L], (BEG[c] || EXP[c])(K[L], r), 16))); });
  function pad(k, o, min) { const LOG = ["Captain's log, ship Bug Buccaneer", "Milo checked this code twice", "Run it and compare with the expected output", "Every line here does something"];
    const at = o.lines[0] === "<?php" ? 1 : 0; let n = 0;
    while (o.lines.length < min && n < LOG.length) { o.lines.splice(at + n, 0, k.cm + " " + LOG[n]); n++; }
    if (n) { o.lines.splice(at + n, 0, ""); n++; } o.b += n; return o; }

  /* ---------------- SQL ---------------- */
  const ROLES = ["cook", "gunner", "lookout", "navigator"], SHIPS = ["Sea Otter", "Gull", "Kraken", "Dolphin"], PORTS = ["Tortuga", "Nassau", "Havana", "Port Royal"];
  function data(r, o) { o = o || {};
    const names = r.picks(CREW, 7), golds = r.picks([...Array(90).keys()].map(i => i + 5), 7);
    const roles = r.picks(ROLES, 4).concat([r.pick(ROLES), r.pick(ROLES), r.pick(ROLES)]);
    for (let i = roles.length - 1; i > 0; i--) { const j = r.int(0, i); [roles[i], roles[j]] = [roles[j], roles[i]]; }
    const rows = names.map((n, i) => ({ id: i + 1, name: n, role: roles[i], gold: golds[i], ship: 1 + (i % 3) }));
    if (o.nulls) { r.picks([0, 1, 2, 3, 4, 5, 6], 2).forEach(i => { rows[i].gold = null; }); }
    const sh = r.picks(SHIPS, 3), pt = r.picks(PORTS, 3); const ships = [1, 2, 3].map(i => ({ id: i, name: sh[i - 1], port: pt[i - 1] }));
    const v = x => x === null ? "NULL" : typeof x === "number" ? x : "'" + x + "'";
    const setup = "CREATE TABLE crew(id INTEGER, name TEXT, role TEXT, gold INTEGER, ship_id INTEGER);\n" + rows.map(x => "INSERT INTO crew VALUES(" + [x.id, x.name, x.role, x.gold, x.ship].map(v).join(",") + ");").join("\n") +
      "\nCREATE TABLE ships(id INTEGER, name TEXT, port TEXT);\n" + ships.map(s => "INSERT INTO ships VALUES(" + [s.id, s.name, s.port].map(v).join(",") + ");").join("\n");
    return { rows, ships, setup };
  }
  const SC = "crew(id, name, role, gold, ship_id), ships(id, name, port)";
  const Q = (d, o) => Object.assign({ setup: d.setup, sc: SC }, o);
  const nm = (d, id) => d.ships.find(s => s.id === id).name;
  T.sql = T.sql || { beginner: [], expert: [] };
  T.sql.beginner.push(
    r => { let d, g, keep; do { d = data(r); g = d.rows.map(x => x.gold).sort((a, b) => a - b)[2]; keep = d.rows.filter(x => x.gold > g).sort((a, b) => b.gold - a.gold); } while (keep.map(x => x.name).join() === keep.slice().sort((a, b) => a.name < b.name ? 1 : -1).map(x => x.name).join());
      return Q(d, { n: "Richest last, not first", lines: ["-- Treasure list: sailors with more than " + g + " gold,", "-- richest sailor FIRST", "SELECT name,", "       gold", "FROM crew", "WHERE gold > " + g, "ORDER BY gold;", "-- (ORDER BY sorts smallest first unless told otherwise)"], b: 6, x: "ORDER BY gold DESC;", w: ["ORDER BY name DESC;", "ORDER BY gold ASC;"], f: "ORDER BY sorts smallest first by default. To put the richest first you add DESC.", e: "The poorest of the rich comes first.", l: "ASC = smallest first (default), DESC = biggest first.", out: keep.map(x => x.name + "|" + x.gold).join("\n") }); },
    r => { const d = data(r); const by = {}; d.rows.forEach(x => { by[x.role] = (by[x.role] || 0) + 1; }); const ks = Object.keys(by).sort();
      return Q(d, { n: "Grouping by the wrong column", lines: ["-- How many sailors have each job?", "SELECT role,", "       COUNT(*) AS sailors", "FROM crew", "GROUP BY name", "ORDER BY role;", "-- one row per job, please", "-- (cook, gunner, lookout, navigator)"], b: 4, x: "GROUP BY role", w: ["GROUP BY sailors", "GROUP BY id"], f: "GROUP BY makes one row per DIFFERENT value of that column. Grouping by name gives one row per sailor, so every count is 1.", e: "Every job shows a count of 1, some jobs repeat.", l: "Group by the column you want one row for.", out: ks.map(k => k + "|" + by[k]).join("\n") }); },
    r => { let d, sh, g, keep; do { d = data(r); sh = r.int(1, 3); g = r.int(20, 70); keep = d.rows.filter(x => x.ship === sh && x.gold > g); } while (!keep.length || d.rows.filter(x => x.ship === sh || x.gold > g).length === keep.length);
      return Q(d, { n: "OR lets everyone in", lines: ["-- Sailors on ship " + sh + " who ALSO have more than " + g + " gold", "SELECT name,", "       gold", "FROM crew", "WHERE ship_id = " + sh, "   OR gold > " + g, "ORDER BY name;", "-- both rules must be true"], b: 5, x: "   AND gold > " + g, w: ["   OR gold >= " + g, "   AND gold < " + g], f: "OR lets a sailor in if EITHER rule is true. 'Also' means both rules must be true, which is AND.", e: "Sailors from other ships sneak into the list.", l: "AND = both must be true; OR = either one.", out: keep.sort((a, b) => a.name < b.name ? -1 : 1).map(x => x.name + "|" + x.gold).join("\n") }); },
    r => { const d = data(r); const ro = r.pick(d.rows).role; const keep = d.rows.filter(x => x.role === ro).sort((a, b) => a.name < b.name ? -1 : 1);
      return Q(d, { n: "Text without quotes", lines: ["-- Every " + ro + " and how much gold they hold", "SELECT name,", "       gold", "FROM crew", "WHERE role = " + ro, "ORDER BY name;", "-- " + ro + " is a word (text),", "-- not a column"], b: 4, x: "WHERE role = '" + ro + "'", w: ["WHERE role = " + ro + "s", "WHERE '" + ro + "' = name"], f: "Without quotes, " + ro + " looks like a COLUMN name. Text values go in 'single quotes'.", e: "sqlite says: no such column: " + ro + ".", l: "Put text values in 'single quotes'.", out: keep.map(x => x.name + "|" + x.gold).join("\n") }); },
    r => { const d = data(r); const top = d.rows.slice().sort((a, b) => b.gold - a.gold).slice(0, 3);
      return Q(d, { n: "Top three shows two", lines: ["-- The THREE richest sailors", "SELECT name,", "       gold", "FROM crew", "ORDER BY gold DESC", "LIMIT 2;", "-- they get a seat at", "-- the captain's table"], b: 5, x: "LIMIT 3;", w: ["LIMIT 3 OFFSET 1;", "LIMIT 4;"], f: "LIMIT is how many rows come back. The THREE richest means LIMIT 3.", e: "Only two sailors are listed.", l: "LIMIT n returns n rows.", out: top.map(x => x.name + "|" + x.gold).join("\n") }); }
  );
  T.sql.expert.push(
    r => { const d = data(r, { nulls: true }); const miss = d.rows.filter(x => x.gold === null).sort((a, b) => a.name < b.name ? -1 : 1);
      return Q(d, { n: "= NULL never matches", lines: ["-- Purser's audit: which sailors have NO gold", "-- recorded yet, and which ship are they on?", "SELECT c.name,", "       s.name AS ship,", "       s.port", "FROM crew AS c", "JOIN ships AS s", "  ON c.ship_id = s.id", "WHERE c.gold = NULL", "ORDER BY c.name;", "", "-- NULL means 'unknown'.", "-- Anything compared with unknown", "-- is also unknown — never true.", "-- The purser expects " + miss.length + " names."], b: 8, x: "WHERE c.gold IS NULL", w: ["WHERE c.gold = 'NULL'", "WHERE c.gold = 0"], f: "NULL means unknown, and x = NULL is ALSO unknown, so no row ever passes. SQL has a special test: IS NULL.", e: "The query returns no rows at all.", l: "Test for missing values with IS NULL / IS NOT NULL.", out: miss.map(x => x.name + "|" + nm(d, x.ship) + "|" + d.ships.find(s => s.id === x.ship).port).join("\n") }); },
    r => { const d = data(r); const rows = d.rows.slice().sort((a, b) => a.name < b.name ? -1 : 1).filter(x => x.gold >= 30);
      return Q(d, { n: "Joined on the wrong key", lines: ["-- Shore-leave list: each sailor with 30+ gold", "-- and the home port of THEIR ship", "SELECT c.name,", "       s.name AS ship,", "       s.port", "FROM crew AS c", "JOIN ships AS s", "  ON c.id = s.id", "WHERE c.gold >= 30", "ORDER BY c.name;", "", "-- crew.ship_id says which ship", "-- a sailor sails on.", "-- crew.id is just the", "-- sailor's own number."], b: 7, x: "  ON c.ship_id = s.id", w: ["  ON c.ship_id = s.name", "  ON c.id = s.id + 0"], f: "c.id is the sailor's OWN number, not their ship. Matching it to s.id pairs sailor 1 with ship 1, sailor 2 with ship 2 — and drops everyone above 3. Join on the foreign key ship_id.", e: "Sailors get the wrong ship, and some vanish.", l: "Join on the column that points at the other table (the foreign key).", out: rows.map(x => x.name + "|" + nm(d, x.ship) + "|" + d.ships.find(s => s.id === x.ship).port).join("\n") }); },
    r => { let d; do { d = data(r, { nulls: true }); } while (false); const cnt = [1, 2, 3].map(i => d.rows.filter(x => x.ship === i).length);
      return Q(d, { n: "COUNT(column) skips NULLs", lines: ["-- Muster: how many sailors are on each ship?", "-- (some sailors have no gold recorded yet)", "SELECT s.name,", "       COUNT(c.gold) AS sailors", "FROM ships AS s", "JOIN crew AS c", "  ON c.ship_id = s.id", "GROUP BY s.id, s.name", "ORDER BY s.id;", "", "-- Every sailor must be counted,", "-- gold or no gold.", "-- The bosun will check the", "-- totals against the roll call.", "-- 7 sailors in all."], b: 3, x: "       COUNT(*) AS sailors", w: ["       COUNT(DISTINCT c.gold) AS sailors", "       COUNT(c.gold) + 0 AS sailors"], f: "COUNT(column) only counts rows where that column is NOT NULL, so sailors with no gold recorded go missing. COUNT(*) counts every row.", e: "The ships with a no-gold sailor are short by one.", l: "COUNT(*) counts rows; COUNT(col) counts non-NULL values.", out: d.ships.map((s, i) => s.name + "|" + cnt[i]).join("\n") }); },
    r => { let d, lim, keep; do { d = data(r); const t = [1, 2, 3].map(i => sum(d.rows.filter(x => x.ship === i).map(x => x.gold))); lim = r.int(60, 160); keep = [1, 2, 3].filter(i => t[i - 1] > lim).map(i => [nm(d, i), t[i - 1]]); } while (!keep.length || keep.length === 3);
      return Q(d, { n: "WHERE can't see totals", lines: ["-- Which ships carry more than " + lim + " gold", "-- in total? (biggest haul first)", "SELECT s.name,", "       SUM(c.gold) AS haul", "FROM ships AS s", "JOIN crew AS c", "  ON c.ship_id = s.id", "GROUP BY s.id, s.name", "WHERE SUM(c.gold) > " + lim, "ORDER BY haul DESC;", "", "-- WHERE runs on single rows,", "-- BEFORE the groups exist.", "-- The quartermaster only wants", "-- the rich ships."], b: 8, x: "HAVING SUM(c.gold) > " + lim, w: ["HAVING SUM(c.gold) < " + lim, "HAVING COUNT(c.gold) > " + lim], f: "WHERE filters single rows before grouping, so it can't use SUM(). A condition on a group total goes in HAVING, after GROUP BY.", e: "sqlite says: syntax error near WHERE (or misuse of aggregate).", l: "WHERE filters rows; HAVING filters groups.", out: keep.sort((a, b) => b[1] - a[1]).map(x => x[0] + "|" + x[1]).join("\n") }); }
  );
  if (typeof module !== "undefined") module.exports = { K, BEG, EXP };
})(typeof window !== "undefined" ? window : globalThis);
