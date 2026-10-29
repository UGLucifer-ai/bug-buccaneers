/* Bug Buccaneers — templated novice curricula for Java, C++, C, C#, TypeScript, Go, PHP,
   Ruby and Rust (shared lesson templates driven by a per-language "kit"), plus SQL.
   Loaded after curriculum.js and curriculum-more.js. */
(function (root) {
  const CUR = root.BB_CURRICULUM, COMMENT = root.BB_COMMENT, M = root.BB_MORE;
  const { NUMS, WORDS, CREW, ITEMS, NOTES, DIRS, q } = M;
  const ind = (s, n) => (s === "" ? s : " ".repeat(n) + s);

  /* ---------- kits: how each language spells the basics ---------- */
  const cBlock = { ifo: c => "if (" + c + ") {", eif: c => "} else if (" + c + ") {", els: "} else {", end: "}", wo: c => "while (" + c + ") {", T: "true", F: "false", brk: "break;", cont: "continue;", not: e => "!" + e, and: "&&", or: "||" };
  const K = {};
  K.c = Object.assign({}, cBlock, { L: "C", cm: "//", badcm: "#", semi: true, scope: true, safe: false, pn: "printf (or puts)",
    head: ["#include <stdio.h>", "#include <stdlib.h>", "#include <string.h>", ""], open: ["int main(void) {"], close: ["    return 0;", "}"], I: 4, FI: 0,
    p: (e, t) => t === "s" ? "puts(" + e + ");" : 'printf("%d\\n", ' + e + ");", ptypo: (e, t) => t === "s" ? "put(" + e + ");" : 'prinf("%d\\n", ' + e + ");",
    v: n => n, di: (n, x) => "int " + n + " = " + x + ";", dk: (n, x) => "const int " + n + " = " + x + ";", db: (n, b) => "int " + n + " = " + (b ? 1 : 0) + ";", T: "1",
    set: (n, x) => n + " = " + x + ";", inc: (n, x) => n + " += " + x + ";",
    fo: (i, a, b, inc) => "for (int " + i + " = " + a + "; " + i + (inc ? " <= " : " < ") + b + "; " + i + "++) {", lend: "}",
    arr: (n, xs) => "int " + n + "[] = {" + xs.join(", ") + "};", at: (n, i) => n + "[" + i + "]", len: n => "(int)(sizeof " + n + " / sizeof " + n + "[0])",
    fn: (name, ps, body) => ["int " + name + "(" + ps.map(p => "int " + p).join(", ") + ") {"].concat(body.map(s => ind(s, 4)), ["}", ""]),
    vfn: (name, ps, body) => ["void " + name + "(" + ps.map(p => "int " + p).join(", ") + ") {"].concat(body.map(s => ind(s, 4)), ["}", ""]),
    ret: e => "return " + e + ";", call: (f, a) => f + "(" + a.join(", ") + ")", st: e => e + ";" });
  K.cpp = Object.assign({}, K.c, { L: "C++", pn: "cout", head: ["#include <iostream>", "#include <string>", "#include <vector>", "#include <stdexcept>", "using namespace std;", ""], open: ["int main() {"],
    p: e => "cout << " + e + " << endl;", ptypo: e => "Cout << " + e + " << endl;", db: (n, b) => "bool " + n + " = " + (b ? "true" : "false") + ";", T: "true" });
  K.java = Object.assign({}, cBlock, { L: "Java", cm: "//", badcm: "#", semi: true, scope: true, safe: true, pn: "System.out.println",
    head: ["import java.util.Scanner;", "", "public class Main {"], open: ["    public static void main(String[] args) {"], close: ["    }", "}"], I: 8, FI: 4,
    p: e => "System.out.println(" + e + ");", ptypo: e => "System.out.printn(" + e + ");",
    v: n => n, di: (n, x) => "int " + n + " = " + x + ";", dk: (n, x) => "final int " + n + " = " + x + ";", db: (n, b) => "boolean " + n + " = " + b + ";",
    set: (n, x) => n + " = " + x + ";", inc: (n, x) => n + " += " + x + ";",
    fo: (i, a, b, inc) => "for (int " + i + " = " + a + "; " + i + (inc ? " <= " : " < ") + b + "; " + i + "++) {", lend: "}",
    arr: (n, xs) => "int[] " + n + " = {" + xs.join(", ") + "};", at: (n, i) => n + "[" + i + "]", len: n => n + ".length",
    fn: (name, ps, body) => ["static int " + name + "(" + ps.map(p => "int " + p).join(", ") + ") {"].concat(body.map(s => ind(s, 4)), ["}", ""]),
    vfn: (name, ps, body) => ["static void " + name + "(" + ps.map(p => "int " + p).join(", ") + ") {"].concat(body.map(s => ind(s, 4)), ["}", ""]),
    ret: e => "return " + e + ";", call: (f, a) => f + "(" + a.join(", ") + ")", st: e => e + ";" });
  K.csharp = Object.assign({}, K.java, { L: "C#", pn: "Console.WriteLine", head: ["using System;", "", "class Program {"], open: ["    static void Main() {"],
    p: e => "Console.WriteLine(" + e + ");", ptypo: e => "Console.Writeline(" + e + ");", dk: (n, x) => "const int " + n + " = " + x + ";", db: (n, b) => "bool " + n + " = " + b + ";", len: n => n + ".Length" });
  K.typescript = Object.assign({}, cBlock, { L: "TypeScript", cm: "//", badcm: "#", semi: false, scope: true, safe: true, pn: "console.log",
    head: [], open: [], close: [], I: 0, FI: 0, p: e => "console.log(" + e + ");", ptypo: e => "console.Log(" + e + ");",
    v: n => n, di: (n, x) => "let " + n + ": number = " + x + ";", dk: (n, x) => "const " + n + ": number = " + x + ";", db: (n, b) => "let " + n + ": boolean = " + b + ";",
    set: (n, x) => n + " = " + x + ";", inc: (n, x) => n + " += " + x + ";",
    fo: (i, a, b, inc) => "for (let " + i + " = " + a + "; " + i + (inc ? " <= " : " < ") + b + "; " + i + "++) {", lend: "}",
    arr: (n, xs) => "let " + n + ": number[] = [" + xs.join(", ") + "];", at: (n, i) => n + "[" + i + "]", len: n => n + ".length",
    fn: (name, ps, body) => ["function " + name + "(" + ps.map(p => p + ": number").join(", ") + "): number {"].concat(body.map(s => ind(s, 2)), ["}", ""]),
    vfn: (name, ps, body) => ["function " + name + "(" + ps.map(p => p + ": number").join(", ") + "): void {"].concat(body.map(s => ind(s, 2)), ["}", ""]),
    ret: e => "return " + e + ";", call: (f, a) => f + "(" + a.join(", ") + ")", st: e => e + ";" });
  K.go = { L: "Go", cm: "//", badcm: "#", semi: false, scope: true, safe: true, pn: "fmt.Println",
    head: ["package main", "", 'import "fmt"', ""], open: ["func main() {"], close: ["}"], I: 4, FI: 0,
    ifo: c => "if " + c + " {", eif: c => "} else if " + c + " {", els: "} else {", end: "}", wo: c => "for " + c + " {", T: "true", F: "false", brk: "break", cont: "continue", not: e => "!" + e, and: "&&", or: "||",
    p: e => "fmt.Println(" + e + ")", ptypo: e => "fmt.println(" + e + ")",
    v: n => n, di: (n, x) => n + " := " + x, dk: (n, x) => "const " + n + " = " + x, db: (n, b) => n + " := " + b,
    set: (n, x) => n + " = " + x, inc: (n, x) => n + " += " + x,
    fo: (i, a, b, inc) => "for " + i + " := " + a + "; " + i + (inc ? " <= " : " < ") + b + "; " + i + "++ {", lend: "}",
    arr: (n, xs) => n + " := []int{" + xs.join(", ") + "}", at: (n, i) => n + "[" + i + "]", len: n => "len(" + n + ")",
    fn: (name, ps, body) => ["func " + name + "(" + ps.map(p => p + " int").join(", ") + ") int {"].concat(body.map(s => ind(s, 4)), ["}", ""]),
    vfn: (name, ps, body) => ["func " + name + "(" + ps.map(p => p + " int").join(", ") + ") {"].concat(body.map(s => ind(s, 4)), ["}", ""]),
    ret: e => "return " + e, call: (f, a) => f + "(" + a.join(", ") + ")", st: e => e };
  K.rust = { L: "Rust", cm: "//", badcm: "#", semi: true, scope: true, safe: true, pn: "println!",
    head: [], open: ["fn main() {"], close: ["}"], I: 4, FI: 0,
    ifo: c => "if " + c + " {", eif: c => "} else if " + c + " {", els: "} else {", end: "}", wo: c => "while " + c + " {", T: "true", F: "false", brk: "break;", cont: "continue;", not: e => "!" + e, and: "&&", or: "||",
    p: e => /^".*"$/.test(e) ? "println!(" + e + ");" : 'println!("{}", ' + e + ");", ptypo: e => /^".*"$/.test(e) ? "printn!(" + e + ");" : 'printn!("{}", ' + e + ");",
    v: n => n, di: (n, x) => "let mut " + n + " = " + x + ";", dk: (n, x) => "let " + n + " = " + x + ";", db: (n, b) => "let " + n + " = " + b + ";",
    set: (n, x) => n + " = " + x + ";", inc: (n, x) => n + " += " + x + ";",
    fo: (i, a, b, inc) => "for " + i + " in " + a + (inc ? "..=" : "..") + b + " {", lend: "}",
    arr: (n, xs) => "let " + n + " = [" + xs.join(", ") + "];", at: (n, i) => n + "[" + i + "]", len: n => n + ".len()",
    fn: (name, ps, body) => ["fn " + name + "(" + ps.map(p => p + ": i32").join(", ") + ") -> i32 {"].concat(body.map(s => ind(s, 4)), ["}", ""]),
    vfn: (name, ps, body) => ["fn " + name + "(" + ps.map(p => p + ": i32").join(", ") + ") {"].concat(body.map(s => ind(s, 4)), ["}", ""]),
    ret: e => "return " + e + ";", call: (f, a) => f + "(" + a.join(", ") + ")", st: e => e + ";" };
  const D = n => "$" + n;
  K.php = Object.assign({}, cBlock, { L: "PHP", cm: "//", badcm: "--", semi: true, scope: false, safe: true, pn: "echo",
    head: ["<?php"], open: [], close: [], I: 0, FI: 0, p: e => "echo " + e + ', "\\n";', ptypo: e => "ecko " + e + ', "\\n";',
    v: D, di: (n, x) => D(n) + " = " + x + ";", dk: null, db: (n, b) => D(n) + " = " + b + ";",
    ifo: c => "if (" + c + ") {", eif: c => "} elseif (" + c + ") {", wo: c => "while (" + c + ") {",
    set: (n, x) => D(n) + " = " + x + ";", inc: (n, x) => D(n) + " += " + x + ";",
    fo: (i, a, b, inc) => "for (" + D(i) + " = " + a + "; " + D(i) + (inc ? " <= " : " < ") + b + "; " + D(i) + "++) {", lend: "}",
    arr: (n, xs) => D(n) + " = [" + xs.join(", ") + "];", at: (n, i) => D(n) + "[" + i + "]", len: n => "count(" + D(n) + ")",
    fn: (name, ps, body) => ["function " + name + "(" + ps.map(D).join(", ") + ") {"].concat(body.map(s => ind(s, 4)), ["}"]),
    vfn: (name, ps, body) => ["function " + name + "(" + ps.map(D).join(", ") + ") {"].concat(body.map(s => ind(s, 4)), ["}"]),
    ret: e => "return " + e + ";", call: (f, a) => f + "(" + a.join(", ") + ")", st: e => e + ";" });
  K.ruby = { L: "Ruby", cm: "#", badcm: "//", semi: false, scope: false, safe: true, pn: "puts",
    head: [], open: [], close: [], I: 0, FI: 0,
    ifo: c => "if " + c, eif: c => "elsif " + c, els: "else", end: "end", wo: c => "while " + c, T: "true", F: "false", brk: "break", cont: "next", not: e => "!" + e, and: "&&", or: "||",
    p: e => "puts " + e, ptypo: e => "put " + e, v: n => n, di: (n, x) => n + " = " + x, dk: null, db: (n, b) => n + " = " + b,
    set: (n, x) => n + " = " + x, inc: (n, x) => n + " += " + x,
    fo: (i, a, b, inc) => "for " + i + " in " + a + (inc ? ".." : "...") + b, lend: "end",
    arr: (n, xs) => n + " = [" + xs.join(", ") + "]", at: (n, i) => n + "[" + i + "]", len: n => n + ".length",
    fn: (name, ps, body) => ["def " + name + "(" + ps.join(", ") + ")"].concat(body.map(s => ind(s, 2)), ["end", ""]),
    vfn: (name, ps, body) => ["def " + name + (ps.length ? "(" + ps.join(", ") + ")" : "")].concat(body.map(s => ind(s, 2)), ["end", ""]),
    ret: e => "return " + e, call: (f, a) => f + "(" + a.join(", ") + ")", st: e => e };
  // PHP strings print with echo; Ruby/Go keep their own literal forms (all use double quotes)

  /* build a full program from function lines + main-body lines; b is a body index (or fb a function-line index) */
  function prog(k, o) {
    const fns = (o.fns || []).map(s => ind(s, k.FI)), body = o.body.map(s => ind(s, k.I));
    const head = o.head || k.head;
    const lines = head.concat(fns, k.open, body, k.close);
    const fo = head.length, bo = head.length + fns.length + k.open.length;
    const b = o.fb !== undefined ? fo + o.fb : bo + o.b;
    const x = o.fb !== undefined ? ind(o.x, k.FI) : ind(o.x, k.I);
    return { n: o.n, lines, b, x, f: o.f, e: o.e, l: o.l, out: o.out, stdin: o.stdin, fixed: o.fixed };
  }
  const I2 = "    ";
  function generic(k) {
    const P = (e, t) => k.p(e, t), V = k.v, B = (o) => prog(k, o);
    const blk = s => (k.end === "end" ? "  " : I2) + s; // indent inside if/loop
    const out = [];
    out.push({ k: "Printing", m: k.pn + " shows text on the screen. Text goes inside double quotes \"like this\"" + (k.semi ? ", and each statement ends with a semicolon ;" : "") + ".", ex: P(q("Ahoy, matey!"), "s"), v: [
      r => { const w = r.pick(WORDS), p = r.pick(CREW), lit = q(w + ", " + p + "!"), good = P(lit, "s"); return B({ n: "Missing closing quote", body: [good.replace(lit, lit.slice(0, -1))], b: 0, x: good, f: "The text starts with a quote mark but never closes it, so the computer can't tell where the words end.", e: k.L + " refuses to run it (a syntax error).", l: "Every opening quote needs a closing quote.", out: w + ", " + p + "!" }); },
      r => { const w = r.pick(WORDS), lit = q(w + "!"); return B({ n: "Misspelled print", body: [k.ptypo(lit, "s")], b: 0, x: P(lit, "s"), f: "The print command is spelled wrong. Computers need the exact name: " + k.pn + ".", e: k.L + " says it doesn't know that command.", l: "Spell commands exactly, capitals included.", out: w + "!" }); },
      r => { const w = r.pick(["Ahoy", "Avast", "Arr", "Yarr", "Ahoyhoy"]); return B({ n: "Words without quotes", body: [P(w, "s")], b: 0, x: P(q(w), "s"), f: "Without quotes, " + w + " looks like the name of a variable, not text.", e: k.L + " says " + w + " is not defined.", l: "Text always goes in quotes.", out: w }); }
    ].concat(k.semi ? [r => { const a = r.pick(WORDS), p = r.pick(CREW), l1 = P(q(a), "s"), l2 = P(q("Captain " + p), "s"); return B({ n: "Missing semicolon", body: [l1.replace(/;$/, ""), l2], b: 0, x: l1, f: "In " + k.L + " each statement ends with a semicolon, and line 1 forgot it.", e: k.L + " stops with a syntax error (expected ';').", l: "End statements with ;.", out: a + "\nCaptain " + p }); }] : []) });
    out.push({ k: "Comments", m: "A comment is a note for humans that the computer skips. In " + k.L + " a one-line note starts with " + k.cm + ".", ex: k.cm + " a note for the crew\n" + P(q("Hi"), "s"), v: [
      r => { const w = r.pick(WORDS), nt = r.pick(NOTES); return B({ n: "Wrong comment symbol", fixed: true, body: [k.badcm + " " + nt, P(q(w), "s")], b: 0, x: k.cm + " " + nt, f: k.badcm + " doesn't start a comment in " + k.L + ". Use " + k.cm + ".", e: k.L + " tries to read the note as code and fails.", l: k.L + " comments start with " + k.cm + ".", out: w }); },
      r => { const w = r.pick(WORDS), nt = r.pick(NOTES); return B({ n: "Note without " + k.cm, fixed: true, body: [P(q(w), "s"), nt], b: 1, x: k.cm + " " + nt, f: "The note has no " + k.cm + " in front, so " + k.L + " thinks it is code.", e: k.L + " stops with an error.", l: "Every one-line note needs " + k.cm + ".", out: w }); },
      r => { const w = r.pick(WORDS), p = r.pick(CREW); return B({ n: "Comment hides the code", fixed: true, body: [k.cm + " print the captain's name", k.cm + " " + P(q("Captain " + p), "s"), P(q(w), "s")], b: 1, x: P(q("Captain " + p), "s"), f: "Line 2 is real code, but the " + k.cm + " turns it into a note, so it is skipped.", e: "Only \"" + w + "\" is printed.", l: k.cm + " switches a line off.", out: "Captain " + p + "\n" + w }); }
    ] });
    const vv = [
      r => { const v = r.pick(NUMS), n = r.int(2, 30); return B({ n: "Misspelled variable", body: [k.di(v, n), P(V(v.slice(0, -1)))], b: 1, x: P(V(v)), f: "The box was named " + v + ", but the print asks for " + v.slice(0, -1) + ".", e: k.L + " can't find a variable called " + v.slice(0, -1) + ".", l: "Use the exact same name every time.", out: String(n) }); },
      r => { const v = r.pick(NUMS), n = r.int(2, 30); return B({ n: "Name starts with a number", body: [k.di("2" + v, n), P(V(v + "2"))], b: 0, x: k.di(v + "2", n), f: "Variable names can't start with a digit.", e: k.L + " stops with a syntax error.", l: "Names start with a letter.", out: String(n) }); }
    ];
    if (k.dk) vv.push(r => { const v = r.pick(NUMS), n = r.int(2, 30); return B({ n: "Changing a constant", body: [k.dk(v, n), k.set(v, V(v) + " + 1"), P(V(v))], b: 0, x: k.di(v, n), f: v + " is made as a constant (it can never change), but line 2 changes it.", e: k.L + " refuses: you can't assign to a constant.", l: "Use a changeable variable if the value will change.", out: String(n + 1) }); });
    out.push({ k: "Variables", m: "A variable is a labelled box that stores a value so you can use it later.", ex: k.di("gold", 5) + "\n" + P(V("gold")), v: vv });
    out.push({ k: "Math and order", m: "* and / happen before + and -. Brackets ( ) go first of all.", ex: P("(2 + 3) * 4"), v: [
      r => { const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 5); return B({ n: "Forgot the brackets", body: [k.cm + " add " + a + " and " + b + ", then multiply by " + c, k.di("total", a + " + " + b + " * " + c), P(V("total"))], b: 1, x: k.di("total", "(" + a + " + " + b + ") * " + c), f: "* happens before +, so only " + b + " is multiplied.", e: "It prints " + (a + b * c) + " instead of " + (a + b) * c + ".", l: "Use brackets to add first.", out: String((a + b) * c) }); },
      r => { const a = r.int(3, 20), b = r.int(3, 20); let c = r.int(3, 20); while ((a + b + c) % 3) c++; return B({ n: "Average without brackets", body: [k.di("avg", a + " + " + b + " + " + c + " / 3"), P(V("avg"))], b: 0, x: k.di("avg", "(" + a + " + " + b + " + " + c + ") / 3"), f: "/ happens before +, so only " + c + " gets divided by 3.", e: "It prints a number that is far too big.", l: "Bracket the sum before dividing.", out: String((a + b + c) / 3) }); },
      r => { const n = r.int(3, 30) * 2; return B({ n: "Remainder test for even", body: [k.di("n", n), k.cm + " even numbers have remainder 0", k.ifo(V("n") + " % 2 == 1"), blk(P(q("Even"), "s")), k.els, blk(P(q("Odd"), "s")), k.end], b: 2, x: k.ifo(V("n") + " % 2 == 0"), f: "An even number divided by 2 leaves remainder 0, not 1.", e: n + " is called Odd.", l: "% gives the remainder.", out: "Even" }); }
    ] });
    out.push({ k: "Comparisons", m: "== asks 'are these equal?'. A single = stores a value. > means more than, >= means 'at least'.", ex: k.ifo(V("gold") + " >= 10") + "\n" + blk(P(q("Rich!"), "s")) + "\n" + k.end, v: [
      r => { const t = r.int(5, 20); return B({ n: "> instead of >=", body: [k.di("gold", t), k.cm + " need at least " + t + " gold", k.ifo(V("gold") + " > " + t), blk(P(q("Enough gold!"), "s")), k.els, blk(P(q("Need more gold"), "s")), k.end], b: 2, x: k.ifo(V("gold") + " >= " + t), f: "'At least " + t + "' includes " + t + " itself, so the test needs >=.", e: "It says Need more gold even with exactly " + t + ".", l: ">= means 'at least'.", out: "Enough gold!" }); },
      r => { const n = r.int(2, 9); return B({ n: "= instead of ==", body: [k.di("gold", n + 1), k.ifo(V("gold") + " = " + n), blk(P(q("Exactly " + n + "!"), "s")), k.els, blk(P(q("Not " + n), "s")), k.end], b: 1, x: k.ifo(V("gold") + " == " + n), f: "One = stores a value. To compare, use ==.", e: k.L + " either refuses or overwrites gold and says Exactly " + n + "!", l: "== compares, = assigns.", out: "Not " + n }); }
    ] });
    out.push({ k: "Logic: and, or, not", m: k.and + " means AND (both must be true), " + k.or + " means OR (either one), and " + k.not("") + " flips true and false.", ex: k.ifo(V("hasMap") + " " + k.and + " " + V("hasKey")) + "\n" + blk(P(q("Open the chest!"), "s")) + "\n" + k.end, v: [
      r => { const a = r.pick(["Map", "Key", "Boat"]), b = r.pick(["Crew", "Lamp", "Flag"]); return B({ n: "OR instead of AND", body: [k.db("has" + a, k.T === "1" ? 1 : true), k.db("has" + b, false), k.cm + " need BOTH", k.ifo(V("has" + a) + " " + k.or + " " + V("has" + b)), blk(P(q("Set sail!"), "s")), k.els, blk(P(q("Not ready"), "s")), k.end], b: 3, x: k.ifo(V("has" + a) + " " + k.and + " " + V("has" + b)), f: k.or + " is happy with just one. We need both, so use " + k.and + ".", e: "It prints Set sail! with the " + b.toLowerCase() + " missing.", l: k.and + " needs both sides true.", out: "Not ready" }); },
      r => { const age = r.int(15, 40); return B({ n: "Range check with OR", body: [k.di("age", age), k.cm + " junior crew is 8 to 13", k.ifo(V("age") + " >= 8 " + k.or + " " + V("age") + " <= 13"), blk(P(q("Junior crew"), "s")), k.els, blk(P(q("Senior crew"), "s")), k.end], b: 2, x: k.ifo(V("age") + " >= 8 " + k.and + " " + V("age") + " <= 13"), f: "Every age is >= 8 OR <= 13, so this is always true. 'Between' needs " + k.and + ".", e: "Age " + age + " is called Junior crew.", l: "Use " + k.and + " for a range.", out: "Senior crew" }); },
      r => { const v = r.pick(["storm", "fog", "kraken"]); return B({ n: "Missing NOT", body: [k.db(v, true), k.cm + " sail only if there is NO " + v, k.ifo(V(v)), blk(P(q("Sail!"), "s")), k.els, blk(P(q("Stay in port"), "s")), k.end], b: 2, x: k.ifo(k.not(V(v))), f: "We should sail when there is no " + v + ", so the test must be flipped.", e: "It sails straight into the " + v + ".", l: k.not("") + " means NOT.", out: "Stay in port" }); }
    ] });
    out.push({ k: "If / else if / else", m: "if checks a question; else if checks another; else catches everything left. The first true branch wins.", ex: k.ifo(V("waves") + " > 8") + "\n" + blk(P(q("Storm!"), "s")) + "\n" + k.els + "\n" + blk(P(q("Calm"), "s")) + "\n" + k.end, v: [
      r => { const w = r.int(9, 14); return B({ n: "Branches in the wrong order", body: [k.di("waves", w), k.ifo(V("waves") + " > 3"), blk(P(q("Choppy"), "s")), k.eif(V("waves") + " > 8"), blk(P(q("Storm!"), "s")), k.els, blk(P(q("Calm"), "s")), k.end], b: 1, x: k.ifo(V("waves") + " > 3 " + k.and + " " + V("waves") + " <= 8"), f: "waves > 3 is checked first and is already true for " + w + ", so the storm branch is never reached.", e: "It says Choppy in a " + w + "-wave storm.", l: "The first true branch wins — check carefully.", out: "Storm!" }); },
      r => { const n = r.int(11, 40); return B({ n: "Comparison backwards", body: [k.di("gold", n), k.cm + " rich means more than 10", k.ifo(V("gold") + " < 10"), blk(P(q("Rich!"), "s")), k.els, blk(P(q("Keep hunting"), "s")), k.end], b: 2, x: k.ifo(V("gold") + " > 10"), f: "< means less than. Rich means MORE than 10, which is >.", e: "With " + n + " gold it says Keep hunting.", l: "> is more than, < is less than.", out: "Rich!" }); }
    ] });
    out.push({ k: "Loops: for", m: "A for loop repeats code, counting as it goes.", ex: k.fo("i", 1, 3, true) + "\n" + blk(P(V("i"))) + "\n" + k.lend, v: [
      r => { const t = r.int(3, 7); return B({ n: "Off by one", body: [k.cm + " count 1 to " + t, k.fo("i", 1, t, false), blk(P(V("i"))), k.lend], b: 1, x: k.fo("i", 1, t, true), f: "The loop stops BEFORE " + t + ".", e: "It counts only to " + (t - 1) + ".", l: "Check whether the end number is included.", out: Array.from({ length: t }, (_, i) => i + 1).join("\n") }); },
      r => { const t = r.int(3, 8); return B({ n: "Total starts at 1", body: [k.di("total", 1), k.fo("i", 1, t, true), blk(k.inc("total", V("i"))), k.lend, P(V("total"))], b: 0, x: k.di("total", 0), f: "A running total must start at 0, or it is 1 too big.", e: "It prints " + (t * (t + 1) / 2 + 1) + " instead of " + t * (t + 1) / 2 + ".", l: "Start sums at 0.", out: String(t * (t + 1) / 2) }); },
      r => { const t = r.int(3, 6), s = r.int(7, 20); return B({ n: "Printing the wrong variable", body: [k.di("stop", t), k.cm + " count up to stop", k.fo("i", 1, V("stop"), true), blk(P(V("stop"))), k.lend], b: 3, x: blk(P(V("i"))), f: "Inside the loop the counter is i. Printing stop shows the same number every time.", e: "It prints " + t + " over and over.", l: "Print the loop counter.", out: Array.from({ length: t }, (_, i) => i + 1).join("\n") }); }
    ] });
    out.push({ k: "Loops: while", m: "A while loop repeats as long as its question stays true. Don't forget to change the counter!", ex: k.di("n", 1) + "\n" + k.wo(V("n") + " <= 3") + "\n" + blk(P(V("n"))) + "\n" + blk(k.inc("n", 1)) + "\n" + k.lend, v: [
      r => { const t = r.int(3, 7); return B({ n: "< instead of <=", body: [k.di("n", 1), k.cm + " count 1 to " + t, k.wo(V("n") + " < " + t), blk(P(V("n"))), blk(k.inc("n", 1)), k.lend], b: 2, x: k.wo(V("n") + " <= " + t), f: "< " + t + " stops before reaching " + t + ".", e: "It stops at " + (t - 1) + ".", l: "<= includes the end number.", out: Array.from({ length: t }, (_, i) => i + 1).join("\n") }); },
      r => { const t = r.int(4, 8); return B({ n: "Counting by 2", body: [k.di("n", 1), k.cm + " count by ones up to " + t, k.wo(V("n") + " <= " + t), blk(P(V("n"))), blk(k.inc("n", 2)), k.lend], b: 4, x: blk(k.inc("n", 1)), f: "The counter jumps by 2, skipping every other number.", e: "It prints only the odd numbers.", l: "Step by 1 to count by ones.", out: Array.from({ length: t }, (_, i) => i + 1).join("\n") }); }
    ] });
    out.push({ k: "Break and continue", m: "break stops a loop right away. " + k.cont.replace(";", "") + " skips to the next round.", ex: k.fo("i", 1, 5, true) + "\n" + blk(k.ifo(V("i") + " == 3")) + "\n" + blk(blk(k.brk)) + "\n" + blk(k.end) + "\n" + blk(P(V("i"))) + "\n" + k.lend, v: [
      r => { const t = r.int(6, 9), s = r.int(2, 5); return B({ n: k.cont.replace(";", "") + " instead of break", body: [k.cm + " stop the loop at " + s, k.fo("i", 1, t, true), blk(k.ifo(V("i") + " == " + s)), blk(blk(k.cont)), blk(k.end), blk(P(V("i"))), k.lend], b: 3, x: blk(blk(k.brk)), f: k.cont.replace(";", "") + " only skips " + s + "; it doesn't stop the loop. Use break.", e: "It keeps counting after " + s + ".", l: "break leaves the loop.", out: Array.from({ length: s - 1 }, (_, i) => i + 1).join("\n") }); },
      r => { const t = r.int(6, 9), s = r.int(2, 5); return B({ n: "break instead of " + k.cont.replace(";", ""), body: [k.cm + " skip only " + s, k.fo("i", 1, t, true), blk(k.ifo(V("i") + " == " + s)), blk(blk(k.brk)), blk(k.end), blk(P(V("i"))), k.lend], b: 3, x: blk(blk(k.cont)), f: "break ends the whole loop. To skip just " + s + ", use " + k.cont.replace(";", "") + ".", e: "It stops at " + (s - 1) + ".", l: k.cont.replace(";", "") + " skips one round.", out: Array.from({ length: t }, (_, i) => i + 1).filter(i => i !== s).join("\n") }); }
    ] });
    const av = [
      r => { const xs = r.picks([3, 5, 7, 9, 11, 12, 15, 21, 30, 42], 3); return B({ n: "First item is index 0", body: [k.arr("chest", xs), k.cm + " print the first one", P(k.at("chest", 1))], b: 2, x: P(k.at("chest", 0)), f: "Counting starts at 0, so [1] is the SECOND item.", e: "It prints " + xs[1] + " instead of " + xs[0] + ".", l: "The first item is [0].", out: String(xs[0]) }); },
      r => { const xs = r.picks([2, 4, 5, 6, 8, 10, 13, 17], 4); return B({ n: "Loop skips the first item", body: [k.arr("chest", xs), k.di("total", 0), k.fo("i", 1, k.len("chest"), false), blk(k.inc("total", k.at("chest", V("i")))), k.lend, P(V("total"))], b: 2, x: k.fo("i", 0, k.len("chest"), false), f: "The loop starts at 1, so item [0] is never added.", e: "The total is " + xs[0] + " too small.", l: "Loop from index 0.", out: String(xs.reduce((a, b) => a + b, 0)) }); }
    ];
    if (k.safe) av.push(r => { const xs = r.picks([3, 5, 7, 9, 11, 12, 15, 21], 3); return B({ n: "Past the end", body: [k.arr("chest", xs), k.cm + " print the last one", P(k.at("chest", k.len("chest")))], b: 2, x: P(k.at("chest", k.len("chest") + " - 1")), f: "With 3 items the indexes are 0, 1, 2. The length (3) is one past the end.", e: k.L + " crashes or prints nothing.", l: "The last item is length - 1.", out: String(xs[2]) }); });
    out.push({ k: "Arrays (lists)", m: "An array keeps many values in order. The first is at index 0.", ex: k.arr("chest", [5, 7, 9]) + "\n" + P(k.at("chest", 0)), v: av });
    out.push({ k: "Functions", m: "A function is your own command. Give it inputs (parameters) and it can return an answer.", ex: k.fn("double", ["n"], [k.ret(V("n") + " * 2")]).join("\n").trim() + "\n" + P(k.call("double", [4])), v: [
      r => { const a = r.int(2, 9), b = r.int(2, 9); return B({ n: "Returns the wrong thing", fns: k.fn("area", ["w", "h"], [k.di("a", V("w") + " * " + V("h")), k.ret(V("w"))]), fb: 2, x: ind(k.ret(V("a")), k.end === "end" ? 2 : (k === K.typescript ? 2 : 4)), body: [P(k.call("area", [a, b]))], f: "The function works out a but hands back w instead.", e: "It prints " + a + " instead of " + a * b + ".", l: "Return the answer you calculated.", out: String(a * b) }); },
      r => { const a = r.int(2, 9), b = r.int(2, 9); return B({ n: "Calling a misspelled function", fns: k.fn("area", ["w", "h"], [k.ret(V("w") + " * " + V("h"))]), body: [P(k.call("aera", [a, b]))], b: 0, x: P(k.call("area", [a, b])), f: "The function is called area, but the call says aera.", e: k.L + " says aera is not defined.", l: "Call functions by their exact name.", out: String(a * b) }); }
    ] });
    const sv = [r => { const n = r.int(2, 20); return B({ n: "Function can't see your variable", fns: k.vfn("show", [], [P(V("gold"))]), fb: 0, x: k.vfn("show", ["gold"], [])[0], body: [k.di("gold", n), k.st(k.call("show", [V("gold")]))], f: "gold belongs to the main code. The function needs a gold parameter to receive it.", e: k.L + " can't find gold inside show.", l: "Pass values into functions as parameters.", out: String(n) }); }];
    if (k.scope) sv.push(r => { const n = r.int(2, 20); return B({ n: "New variable inside the block", body: [k.di("gold", 0), k.ifo(k.T), blk(k.di("gold", n)), k.end, P(V("gold"))], b: 2, x: blk(k.set("gold", n)), f: "Declaring gold again inside { } makes a second, separate gold that disappears at }. Just assign the outer one.", e: "It prints 0 (or " + k.L + " refuses the duplicate name).", l: "Declare once, then assign.", out: String(n) }); });
    out.push({ k: "Scope", m: "Variables live inside the block or function where they are made. Functions only see what you pass in.", ex: k.vfn("show", ["gold"], [P(V("gold"))]).join("\n").trim(), v: sv });
    return out;
  }
  root.BB_KITS = K; root.BB_PROG = prog; root.BB_GENERIC = generic;
})(typeof window !== "undefined" ? window : globalThis);
