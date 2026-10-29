/* Bug Buccaneers — curriculum part 2: wider Python/JS pools, missing JS lessons, and
   templated novice curricula for Java, C++, SQL, C, C#, TypeScript, Go, PHP, Ruby, Rust.
   Loaded after curriculum.js. Every variant returns {n, lines, b, x, f, e, l, out}.
   Verified by tools/verify-curriculum.js (runs buggy + fixed code). */
(function (root) {
  const CUR = root.BB_CURRICULUM, COMMENT = root.BB_COMMENT;
  const NUMS = ["gold", "coins", "parrots", "cannons", "maps", "pearls", "barrels", "anchors", "gems", "sails"];
  const WORDS = ["Ahoy", "Land ho", "Yo ho ho", "Avast", "Shiver me timbers", "Arr", "Anchors away", "Hoist the sails"];
  const CREW = ["Milo", "Pearl", "Finn", "Ruby", "Jack", "Coral", "Marlo", "Sandy", "Nell", "Otto"];
  const ITEMS = ["map", "sword", "compass", "hat", "flag", "rope", "spyglass", "lantern", "drum", "bell"];
  const NOTES = ["say hello to the crew", "greet the captain", "this prints a cheer", "show the ship's motto", "shout across the deck",
    "print the welcome", "tell the crew we sailed", "a friendly pirate hello", "first line of the log", "cheer for the treasure", "wave at the parrot", "announce the voyage"];
  const DIRS = ["north", "south", "east", "west"];
  const q = s => '"' + s + '"';
  const conceptOf = (lang, k) => CUR[lang].find(c => c.k === k);
  const insertAfter = (lang, k, concept) => { const a = CUR[lang]; const i = a.findIndex(c => c.k === k); a.splice(i + 1, 0, concept); };

  /* ---------- Python: wider Comments and Input ---------- */
  conceptOf("python", "Comments").v = [
    r => { const w = r.pick(WORDS), nt = r.pick(NOTES); return { n: "Wrong comment symbol", fixed: true, lines: ["// " + nt, 'print("' + w + '")'], b: 0, x: "# " + nt, f: "// makes a comment in some other languages, but Python comments start with #.", e: "Python stops with a SyntaxError.", l: "Python comments start with #.", out: w }; },
    r => { const w = r.pick(WORDS), nt = r.pick(NOTES); return { n: "Note without a #", fixed: true, lines: ['print("' + w + '")', nt], b: 1, x: "# " + nt, f: "The note on line 2 has no # in front, so Python thinks it is code.", e: "Python stops with a SyntaxError.", l: "Every comment line needs a #.", out: w }; },
    r => { const w = r.pick(WORDS), p = r.pick(CREW); return { n: "Comment hides the code", fixed: true, lines: ["# print the captain's name", '# print("Captain ' + p + '")', 'print("' + w + '")'], b: 1, x: 'print("Captain ' + p + '")', f: "Line 2 is real code, but the # in front turns it into a note, so Python skips it.", e: "Only \"" + w + "\" is printed; the captain's name is missing.", l: "A # turns a whole line off.", out: "Captain " + p + "\n" + w }; }
  ];
  conceptOf("python", "Input").v = [
    r => { const n = r.int(5, 14), a = r.int(1, 9), Q = r.pick(["How old are ye? ", "How many coins? ", "Pick a number: ", "How many parrots? "]); return { n: "input() gives text", lines: ['n = input("' + Q + '")', "print(n + " + a + ")"], b: 0, x: 'n = int(input("' + Q + '"))', f: "input() always returns text, so n is \"" + n + "\", not " + n + ".", e: "Python says TypeError: can only concatenate str (not \"int\") to str.", l: "Wrap input() in int() to get a number.", out: Q + (n + a), stdin: n + "\n" }; },
    r => { const p = r.pick(CREW), G = r.pick(["Ahoy, ", "Welcome aboard, ", "Hello, "]), v = r.pick(["name", "pirate", "sailor"]); return { n: "Forgot to store the answer", lines: ['input("What is yer name? ")', 'print("' + G + '" + ' + v + ")"], b: 0, x: v + ' = input("What is yer name? ")', f: "The answer was never saved in a variable called " + v + ".", e: "Python says NameError: name '" + v + "' is not defined.", l: "Save input() into a variable to use it later.", out: "What is yer name? " + G + p, stdin: p + "\n" }; },
    r => { const a = r.int(2, 9), b = r.int(2, 9); return { n: "Two answers glued", lines: ['a = input("First: ")', 'b = int(input("Second: "))', "print(a + b)"], b: 0, x: 'a = int(input("First: "))', f: "a is still text because only b was turned into a number.", e: "Python says TypeError: can only concatenate str (not \"int\") to str.", l: "Convert every input you want to do maths with.", out: "First: Second: " + (a + b), stdin: a + "\n" + b + "\n" }; }
  ];

  /* ---------- JavaScript: wider Comments, Data types, Switch ---------- */
  conceptOf("javascript", "Comments").v = [
    r => { const w = r.pick(WORDS), nt = r.pick(NOTES); return { n: "# is not a comment", fixed: true, lines: ["# " + nt, 'console.log("' + w + '");'], b: 0, x: "// " + nt, f: "# makes comments in Python, but JavaScript uses //.", e: "SyntaxError: Invalid or unexpected token.", l: "JavaScript comments start with //.", out: w }; },
    r => { const w = r.pick(WORDS), nt = r.pick(NOTES); return { n: "Comment never closed", fixed: true, lines: ["/* " + nt, 'console.log("' + w + '");'], b: 0, x: "/* " + nt + " */", f: "A /* note needs */ to end it. Without it, everything after is swallowed as a note.", e: "SyntaxError: Invalid or unexpected token (unterminated comment).", l: "Close every /* with */.", out: w }; },
    r => { const w = r.pick(WORDS), nt = r.pick(NOTES); return { n: "Note without //", fixed: true, lines: ['console.log("' + w + '");', nt], b: 1, x: "// " + nt, f: "Line 2 is a note but has no //, so JavaScript reads it as code.", e: "SyntaxError: Unexpected identifier.", l: "Every one-line note needs //.", out: w }; }
  ];
  conceptOf("javascript", "Data types").v = [
    r => { const p = r.pick(CREW), v = r.pick(["brave", "ready", "happy", "awake"]); return { n: "True with a capital T", lines: ['let name = "' + p + '";', "let " + v + " = True;", "console.log(name, " + v + ");"], b: 1, x: "let " + v + " = true;", f: "JavaScript booleans are lowercase: true and false.", e: "ReferenceError: True is not defined.", l: "Booleans are true and false.", out: p + " true" }; },
    r => { const v = r.pick(NUMS), n = r.int(2, 40); return { n: "Number stored as text", lines: ["let " + v + ' = "' + n + '";', "console.log(typeof " + v + ");"], b: 0, x: "let " + v + " = " + n + ";", f: "The quotes make " + v + " a string, but it should be a number.", e: "It prints string instead of number.", l: "Numbers have no quotes.", out: "number" }; },
    r => { const v = r.pick(NUMS); return { n: "None is Python's word", lines: ["let " + v + " = None;", "console.log(" + v + ");"], b: 0, x: "let " + v + " = null;", f: "JavaScript's 'nothing' value is null. None is Python.", e: "ReferenceError: None is not defined.", l: "Nothing is null in JavaScript.", out: "null" }; }
  ];
  conceptOf("javascript", "Switch").v = [
    r => { const d = r.picks(DIRS, 2); return { n: "Missing break", lines: ['let way = "' + d[0] + '";', "switch (way) {", '  case "' + d[0] + '":', '    console.log("Sailing ' + d[0] + '");', '  case "' + d[1] + '":', '    console.log("Sailing ' + d[1] + '");', "    break;", "}"], b: 3, x: '    console.log("Sailing ' + d[0] + '"); break;', f: "Without break, the " + d[0] + " case falls through and also runs the " + d[1] + " case.", e: "It prints both Sailing " + d[0] + " and Sailing " + d[1] + ".", l: "End each case with break.", out: "Sailing " + d[0] }; },
    r => { const n = r.int(1, 4), w = r.pick(ITEMS); return { n: "Case is text, value is a number", lines: ["let door = " + n + ";", "switch (door) {", '  case "' + n + '":', '    console.log("You found a ' + w + '!");', "    break;", "  default:", '    console.log("Empty room");', "}"], b: 2, x: "  case " + n + ":", f: "switch compares with ===, so the text \"" + n + "\" never equals the number " + n + ".", e: "It prints Empty room.", l: "Case values must be the same type as the switch value.", out: "You found a " + w + "!" }; },
    r => { const d = r.picks(DIRS, 2); return { n: "default misspelled", lines: ['let way = "' + d[1] + '";', "switch (way) {", '  case "' + d[0] + '":', '    console.log("Sailing ' + d[0] + '");', "    break;", "  defualt:", '    console.log("Lost at sea!");', "}"], b: 5, x: "  default:", f: "defualt is a typo, so JavaScript treats it as a label and the fallback never runs.", e: "Nothing is printed.", l: "Spell default carefully.", out: "Lost at sea!" }; }
  ];

  /* ---------- JavaScript: new lessons ---------- */
  const RD = 'const line = require("fs").readFileSync(0, "utf8").trim();';
  insertAfter("javascript", "Comments", { k: "Input", m: "Programs can read what the player types. In Node we read it as TEXT, then turn it into a number with Number() if we need maths.", ex: RD + "\nconsole.log(Number(line) + 1);",
    v: [
      r => { const n = r.int(5, 40), a = r.int(1, 9); return { n: "Input is text", lines: [RD, "let n = line;", "console.log(n + " + a + ");"], b: 1, x: "let n = Number(line);", f: "What the player types arrives as text, so + glues \"" + n + "\" and " + a + ".", e: "It prints " + n + "" + a + " instead of " + (n + a) + ".", l: "Turn typed numbers into numbers with Number().", out: String(n + a), stdin: n + "\n" }; },
      r => { const p = r.pick(CREW), G = r.pick(["Ahoy, ", "Welcome aboard, ", "Hello, "]); return { n: "Wrong variable name", lines: [RD, 'console.log("' + G + '" + name);'], b: 1, x: 'console.log("' + G + '" + line);', f: "The typed answer is stored in line, but the code asks for name.", e: "ReferenceError: name is not defined.", l: "Use the variable that holds the answer.", out: G + p, stdin: p + "\n" }; },
      r => { const a = r.int(10, 30), b = r.int(2, 9); return { n: "parseInt on the wrong thing", lines: [RD, "let n = parseInt(" + b + ");", "console.log(n * 2);"], b: 1, x: "let n = parseInt(line);", f: "parseInt should read what the player typed (line), not a fixed number.", e: "It ignores the input and prints " + b * 2 + ".", l: "Convert the input variable itself.", out: String(a * 2), stdin: a + "\n" }; }
    ] });
  insertAfter("javascript", "Strings and numbers", { k: "Type conversion", m: "Number(\"8\") makes a number, String(8) makes text, and parseInt(\"8.9\") keeps the whole part. A failed conversion gives NaN.", ex: 'console.log(Number("8") + 2);   // 10\nconsole.log(String(8) + 2);   // "82"',
    v: [
      r => { const a = r.int(2, 30), b = r.int(2, 9); return { n: "String() instead of Number()", lines: ['let text = "' + a + '";', "let n = String(text);", "console.log(n + " + b + ");"], b: 1, x: "let n = Number(text);", f: "String() keeps it as text, so + glues.", e: "It prints " + a + "" + b + " instead of " + (a + b) + ".", l: "Number() turns text into a number.", out: String(a + b) }; },
      r => { const a = r.int(2, 9), d = r.int(1, 9); return { n: "parseInt drops the decimal", lines: ['let price = "' + a + "." + d + '";', "let n = parseInt(price);", "console.log(n * 10);"], b: 1, x: "let n = parseFloat(price);", f: "parseInt keeps only the whole number " + a + ". parseFloat keeps the ." + d + ".", e: "It prints " + a * 10 + " instead of " + (a * 10 + d) + ".", l: "parseFloat keeps decimals.", out: String(a * 10 + d) }; },
      r => { const v = r.pick(NUMS), a = r.int(2, 30); return { n: "Converting the label, not the value", lines: ['let label = "' + v + '";', 'let value = "' + a + '";', "let n = Number(label);", "console.log(n + 1);"], b: 2, x: "let n = Number(value);", f: "\"" + v + "\" is a word, so Number() gives NaN. Convert value instead.", e: "It prints NaN.", l: "Only digit text converts to a number.", out: String(a + 1) }; }
    ] });
  insertAfter("javascript", "Comparisons", { k: "Logic: &&, ||, !", m: "&& means AND (both true), || means OR (either true), ! flips true and false.", ex: "if (hasMap && hasKey) console.log(\"Open the chest!\");",
    v: [
      r => { const a = r.pick(["Map", "Key", "Boat"]), b = r.pick(["Crew", "Lamp", "Flag"]); return { n: "|| instead of &&", lines: ["let has" + a + " = true;", "let has" + b + " = false;", "// need BOTH", "if (has" + a + " || has" + b + ") {", '  console.log("Set sail!");', "} else {", '  console.log("Not ready");', "}"], b: 3, x: "if (has" + a + " && has" + b + ") {", f: "|| is happy if just one is true. We need both, so use &&.", e: "It prints Set sail! even though " + b.toLowerCase() + " is missing.", l: "&& needs both sides true.", out: "Not ready" }; },
      r => { const age = r.int(15, 40); return { n: "Range check with ||", lines: ["let age = " + age + ";", "// junior crew is 8 to 13", "if (age >= 8 || age <= 13) {", '  console.log("Junior crew");', "} else {", '  console.log("Senior crew");', "}"], b: 2, x: "if (age >= 8 && age <= 13) {", f: "Every age is either >= 8 OR <= 13, so the test is always true. A range needs &&.", e: "It prints Junior crew for age " + age + ".", l: "Use && for 'between'.", out: "Senior crew" }; },
      r => { const v = r.pick(["storm", "fog", "kraken"]); return { n: "Missing !", lines: ["let " + v + " = true;", "// sail only if there is NO " + v, "if (" + v + ") {", '  console.log("Sail!");', "} else {", '  console.log("Stay in port");', "}"], b: 2, x: "if (!" + v + ") {", f: "We want to sail when there is no " + v + ", so the test must be flipped with !.", e: "It prints Sail! right into the " + v + ".", l: "! means NOT.", out: "Stay in port" }; }
    ] });

  root.BB_MORE = { NUMS, WORDS, CREW, ITEMS, NOTES, DIRS, q };
})(typeof window !== "undefined" ? window : globalThis);
