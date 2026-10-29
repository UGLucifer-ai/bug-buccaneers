/* Bug Buccaneers — NOVICE fundamentals curriculum (generated, never-repeating puzzles).
   Each concept: k = lesson name, m = Milo's mini-lesson, ex = tiny correct example,
   v = bug variants. A variant is a function of a random helper r and returns a puzzle
   whose names, values and (often) bug line are randomized, with the explanation, fix
   and expected output written to match exactly. Verified by tools/verify-curriculum. */
(function (root) {
  const NUMS = ["gold", "coins", "parrots", "cannons", "maps", "pearls", "barrels", "anchors"];
  const WORDS = ["Ahoy", "Land ho", "Yo ho ho", "Avast", "Shiver me timbers", "Arr"];
  const CREW = ["Milo", "Pearl", "Finn", "Ruby", "Jack", "Coral", "Marlo", "Sandy"];
  const ITEMS = ["map", "sword", "compass", "hat", "flag", "rope", "spyglass", "lantern"];
  function R(rng) {
    const r = {
      rng: rng,
      int: (a, b) => a + Math.floor(rng() * (b - a + 1)),
      pick: a => a[Math.floor(rng() * a.length)],
      picks: (a, n) => { const c = a.slice(), o = []; while (o.length < n && c.length) o.push(c.splice(Math.floor(rng() * c.length), 1)[0]); return o; }
    };
    return r;
  }
  function done(r, o, cm) {
    const lines = o.lines.slice(); let b = o.b;
    if (!o.fixed && cm && r.rng() < 0.5) { lines.unshift(cm + " " + r.pick(["Captain's log", "Treasure code", "Milo's practice", "Pirate program"])); b++; }
    const fixedLines = lines.slice(); fixedLines[b] = o.x;
    return { n: o.n, c: lines.join("\n"), b: b, x: o.x, f: o.f, e: o.e, l: o.l, out: o.out, stdin: o.stdin || "", fixedCode: fixedLines.join("\n"), gen: true };
  }
  const q = s => '"' + s + '"';

  /* ======================= PYTHON ======================= */
  const PY = [
    { k: "Printing", m: "print() shows words on the screen. Put the words inside quote marks, and the quotes inside round brackets.", ex: 'print("Ahoy, matey!")',
      v: [
        r => { const w = r.pick(WORDS), p = r.pick(CREW); return { n: "Missing closing quote", lines: ['print("' + w + ', ' + p + '!)'], b: 0, x: 'print("' + w + ', ' + p + '!")', f: "The text starts with a quote mark but never gets its closing quote, so Python can't tell where the words end.", e: "Python stops with a SyntaxError (unterminated string) before anything prints.", l: "Every opening quote needs a closing quote.", out: w + ", " + p + "!" }; },
        r => { const w = r.pick(WORDS); return { n: "Print with a capital P", lines: ['Print("' + w + '!")'], b: 0, x: 'print("' + w + '!")', f: "Python cares about capital letters. Print is not the same as print.", e: "Python says NameError: name 'Print' is not defined.", l: "Python is case-sensitive: print is all lowercase.", out: w + "!" }; },
        r => { const w = r.pick(WORDS), p = r.pick(CREW); return { n: "Missing bracket", lines: ['print("' + p + ' says ' + w + '"'], b: 0, x: 'print("' + p + ' says ' + w + '")', f: "print( opens a round bracket but it is never closed.", e: "Python stops with a SyntaxError: '(' was never closed.", l: "Every ( needs a matching ).", out: p + " says " + w }; }
      ] },
    { k: "Comments", m: "A comment is a note for humans. In Python it starts with #, and Python skips it.", ex: '# this is a note\nprint("Hi")',
      v: [
        r => { const w = r.pick(WORDS); return { n: "Wrong comment symbol", fixed: true, lines: ["// say hello to the crew", 'print("' + w + '")'], b: 0, x: "# say hello to the crew", f: "// makes a comment in some other languages, but Python comments start with #.", e: "Python tries to run // as code and stops with a SyntaxError.", l: "Python comments start with #.", out: w }; },
        r => { const p = r.pick(CREW); return { n: "Note without a #", fixed: true, lines: ['print("Captain ' + p + '")', "this line prints the captain"], b: 1, x: "# this line prints the captain", f: "The note on line 2 has no # in front, so Python thinks it is code.", e: "Python stops with a SyntaxError because the note isn't real code.", l: "Put # in front of every note.", out: "Captain " + p }; }
      ] },
    { k: "Variables", m: "A variable is a labelled treasure chest that stores a value. Use = to put a value in it.", ex: "gold = 5\nprint(gold)",
      v: [
        r => { const v = r.pick(NUMS), n = r.int(2, 30); return { n: "Misspelled variable", lines: [v + " = " + n, "print(" + v.slice(0, -1) + ")"], b: 1, x: "print(" + v + ")", f: "The chest was named " + v + ", but line 2 asks for " + v.slice(0, -1) + ", a different name.", e: "Python says NameError: name '" + v.slice(0, -1) + "' is not defined.", l: "Use exactly the same name every time.", out: String(n) }; },
        r => { const v = r.pick(NUMS), n = r.int(2, 30); return { n: "Name starts with a number", fixed: true, lines: ["2" + v + " = " + n, "print(" + v + "2)"], b: 0, x: v + "2 = " + n, f: "Variable names can't start with a number.", e: "Python stops with a SyntaxError.", l: "Names start with a letter or _ , never a digit.", out: String(n) }; },
        r => { const n = r.int(2, 30); return { n: "Space inside a name", fixed: true, lines: ["my gold = " + n, "print(my_gold)"], b: 0, x: "my_gold = " + n, f: "Variable names can't have spaces. Use an underscore instead.", e: "Python stops with a SyntaxError.", l: "Join words in names with _ like my_gold.", out: String(n) }; }
      ] },
    { k: "Data types", m: "Values come in types: whole numbers (int), decimals (float), text (str), True/False (bool) and None for 'nothing'.", ex: 'age = 9\nname = "Milo"\nhappy = True',
      v: [
        r => { const p = r.pick(CREW); return { n: "lowercase true", lines: ['name = "' + p + '"', "brave = true", "print(name, brave)"], b: 1, x: "brave = True", f: "Python's yes/no values are True and False with capital letters.", e: "Python says NameError: name 'true' is not defined.", l: "Booleans are True and False, capitalized.", out: p + " True" }; },
        r => { const v = r.pick(NUMS); return { n: "lowercase none", lines: [v + " = none", "print(" + v + ")"], b: 0, x: v + " = None", f: "Python's 'nothing' value is None with a capital N.", e: "Python says NameError: name 'none' is not defined.", l: "Nothing is spelled None.", out: "None" }; },
        r => { const v = r.pick(NUMS), a = r.int(2, 9); return { n: "Decimal with a comma", lines: [v + " = " + a + ",5", "print(" + v + " * 2)"], b: 0, x: v + " = " + a + ".5", f: "Decimals use a dot in Python. A comma makes a pair of values (a tuple) instead.", e: "Doubling the pair repeats it, so it prints (" + a + ", 5, " + a + ", 5) instead of " + (a * 2 + 1) + ".0.", l: "Write decimals with a dot: 3.5", out: (a * 2 + 1) + ".0" }; }
      ] },
    { k: "Strings vs numbers", m: "\"7\" in quotes is text, 7 without quotes is a number. You can't glue text and numbers with + until you turn the number into text with str().", ex: 'gold = 7\nprint("Gold: " + str(gold))',
      v: [
        r => { const v = r.pick(NUMS), n = r.int(2, 50); return { n: "Gluing text and a number", lines: [v + " = " + n, 'print("' + v + ': " + ' + v + ")"], b: 1, x: 'print("' + v + ': " + str(' + v + "))", f: "+ can't join text and a number. Turn the number into text with str().", e: "Python says TypeError: can only concatenate str (not \"int\") to str.", l: "Use str() to turn a number into text.", out: v + ": " + n }; },
        r => { const a = r.int(2, 9), b = r.int(2, 9); return { n: "Numbers in quotes", lines: ['a = "' + a + '"', "b = " + b, "print(a + b)"], b: 0, x: "a = " + a, f: "a is text because of the quotes, so it can't be added to the number b.", e: "Python says TypeError: can only concatenate str (not \"int\") to str.", l: "Numbers for math have no quotes.", out: String(a + b) }; }
      ] },
    { k: "Type conversion", m: "int() turns text like \"8\" into the number 8, float() makes a decimal and str() makes text.", ex: 'n = int("8")\nprint(n + 1)',
      v: [
        r => { const a = r.int(2, 40), b = r.int(1, 9); return { n: "Forgot int()", lines: ['text = "' + a + '"', "number = text", "print(number + " + b + ")"], b: 1, x: "number = int(text)", f: "text holds \"" + a + "\" in quotes, so number is still text. Wrap it in int().", e: "Python says TypeError: can only concatenate str (not \"int\") to str.", l: "Convert text to a number with int().", out: String(a + b) }; },
        r => { const a = r.int(2, 9); return { n: "int() of a decimal string", lines: ['price = "' + a + '.5"', "total = int(price) * 2", "print(total)"], b: 1, x: "total = float(price) * 2", f: "int() can't read the dot in \"" + a + ".5\". Decimals need float().", e: "Python says ValueError: invalid literal for int() with base 10.", l: "Use float() for decimal text.", out: (a * 2 + 1) + ".0" }; }
      ] },
    { k: "Math and order", m: "Python does * and / before + and -, just like in maths class. Use brackets to make a part happen first.", ex: "print((2 + 3) * 4)  # 20",
      v: [
        r => { const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 5); return { n: "Forgot the brackets", lines: ["# add the chests, then multiply by " + c, "total = " + a + " + " + b + " * " + c, "print(total)"], b: 1, x: "total = (" + a + " + " + b + ") * " + c, f: "* happens before +, so it multiplies " + b + " * " + c + " first.", e: "It prints " + (a + b * c) + " instead of " + ((a + b) * c) + ". No error, just a wrong answer.", l: "Brackets make a sum happen first.", out: String((a + b) * c) }; },
        r => { const a = r.int(2, 6), b = r.int(2, 3); return { n: "^ is not power", lines: ["# " + a + " to the power of " + b, "result = " + a + " ^ " + b, "print(result)"], b: 1, x: "result = " + a + " ** " + b, f: "In Python, ^ is a special bit trick, not 'to the power of'. Power is **.", e: "It prints " + (a ^ b) + " instead of " + Math.pow(a, b) + ".", l: "Power uses ** in Python.", out: String(Math.pow(a, b)) }; },
        r => { const b = r.int(2, 4), a = b * r.int(2, 5) + 1; return { n: "Sharing into whole piles", lines: ["# share " + a + " coins between " + b + " pirates: whole coins each", "each = " + a + " / " + b, "print(each)"], b: 1, x: "each = " + a + " // " + b, f: "/ always gives a decimal. // gives the whole-number part.", e: "It prints " + (a / b) + " instead of " + Math.floor(a / b) + ".", l: "// divides into whole numbers.", out: String(Math.floor(a / b)) }; }
      ] },
    { k: "String basics", m: "Strings are lines of letters. len() counts them, and word[0] is the FIRST letter because counting starts at 0.", ex: 'ship = "Pearl"\nprint(len(ship), ship[0])',
      v: [
        r => { const w = r.pick(CREW); return { n: "First letter is index 0", lines: ['name = "' + w + '"', "# print the first letter", "print(name[1])"], b: 2, x: "print(name[0])", f: "Counting starts at 0, so name[1] is the SECOND letter.", e: "It prints '" + w[1] + "' instead of '" + w[0] + "'.", l: "The first letter is at index 0.", out: w[0] }; },
        r => { const w = r.pick(ITEMS); return { n: "Index past the end", lines: ['word = "' + w + '"', "# print the last letter", "print(word[len(word)])"], b: 2, x: "print(word[-1])", f: "A word with " + w.length + " letters has indexes 0 to " + (w.length - 1) + ". len(word) is one too far.", e: "Python says IndexError: string index out of range.", l: "word[-1] is the last letter.", out: w[w.length - 1] }; },
        r => { const w = r.pick(ITEMS), p = r.pick(CREW); return { n: "Missing f in an f-string", lines: ['item = "' + w + '"', 'print("' + p + ' found a {item}")'], b: 1, x: 'print(f"' + p + ' found a {item}")', f: "{item} only gets filled in when the string starts with f.", e: "It prints the braces literally: " + p + " found a {item}.", l: "Put f before the quote to fill in {names}.", out: p + " found a " + w }; }
      ] },
    { k: "Input", m: "input() asks the player a question and gives back their answer as TEXT, even if they type a number.", ex: 'age = int(input("Age? "))\nprint(age + 1)',
      v: [
        r => { const n = r.int(5, 12); return { n: "input() gives text", lines: ['age = input("How old are ye? ")', "print(age + 1)"], b: 0, x: 'age = int(input("How old are ye? "))', f: "input() always returns text, so age is \"" + n + "\", not " + n + ".", e: "Python says TypeError: can only concatenate str (not \"int\") to str.", l: "Wrap input() in int() to get a number.", out: "How old are ye? " + (n + 1), stdin: n + "\n" }; },
        r => { const p = r.pick(CREW); return { n: "Forgot to store the answer", lines: ['input("What is yer name? ")', 'print("Ahoy, " + name)'], b: 0, x: 'name = input("What is yer name? ")', f: "The answer was never saved in a variable called name.", e: "Python says NameError: name 'name' is not defined.", l: "Save input() into a variable to use it later.", out: "What is yer name? Ahoy, " + p, stdin: p + "\n" }; }
      ] },
    { k: "Comparisons", m: "== asks 'are these equal?'. One = stores a value. Others: != not equal, < less, > greater, <= and >=.", ex: "if gold == 10:\n    print(\"Ten!\")",
      v: [
        r => { const v = r.pick(NUMS), n = r.int(2, 20); return { n: "= instead of ==", lines: [v + " = " + n, "if " + v + " = " + n + ":", '    print("Exactly ' + n + '!")'], b: 1, x: "if " + v + " == " + n + ":", f: "One = stores a value. To compare, use ==.", e: "Python stops with a SyntaxError.", l: "Compare with ==, store with =.", out: "Exactly " + n + "!" }; },
        r => { const v = r.pick(NUMS), n = r.int(5, 20); return { n: "=> is not >=", lines: [v + " = " + n, "if " + v + " => " + n + ":", '    print("Enough ' + v + '!")'], b: 1, x: "if " + v + " >= " + n + ":", f: "'Greater than or equal' is written >= (the > comes first).", e: "Python stops with a SyntaxError.", l: "Write >= and <=, symbol before the =.", out: "Enough " + v + "!" }; }
      ] },
    { k: "Logic: and, or, not", m: "and means BOTH must be true. or means at least ONE is true. not flips True and False.", ex: "if sunny and windy:\n    print(\"Sail!\")",
      v: [
        r => { const a = r.int(3, 9); return { n: "&& is not Python", lines: ["wind = " + a, "sun = True", "if wind > 2 && sun:", '    print("Set sail!")'], b: 2, x: "if wind > 2 and sun:", f: "&& means 'and' in other languages. Python uses the word and.", e: "Python stops with a SyntaxError.", l: "Python uses the words and, or, not.", out: "Set sail!" }; },
        r => { const a = r.int(1, 4), g = r.int(6, 9); return { n: "or instead of and", lines: ["age = " + g, "height = " + a, "# ride needs age over 5 AND height over 5", "if age > 5 or height > 5:", '    print("Ride the ship!")', "else:", '    print("Not yet!")'], b: 3, x: "if age > 5 and height > 5:", f: "or lets you ride if just ONE is true, but the rule needs BOTH.", e: "It prints 'Ride the ship!' even though height is only " + a + ".", l: "and needs both sides true.", out: "Not yet!" }; }
      ] },
    { k: "If / elif / else", m: "if checks a question. elif checks another one. else catches everything left. Each line ends with a colon and the code inside is indented.", ex: "if gold > 10:\n    print(\"Rich!\")\nelse:\n    print(\"Keep hunting\")",
      v: [
        r => { const n = r.int(1, 9); return { n: "Missing colon after else", lines: ["gold = " + n, "if gold > 10:", '    print("Rich!")', "else", '    print("Keep hunting!")'], b: 3, x: "else:", f: "else needs a colon at the end, like if.", e: "Python stops with a SyntaxError: expected ':'.", l: "if, elif and else lines end with a colon.", out: "Keep hunting!" }; },
        r => { const n = r.int(4, 6); return { n: "else if is elif", lines: ["waves = " + n, "if waves > 8:", '    print("Storm!")', "else if waves > 3:", '    print("Choppy!")', "else:", '    print("Calm!")'], b: 3, x: "elif waves > 3:", f: "Python spells 'else if' as one word: elif.", e: "Python stops with a SyntaxError.", l: "Use elif for another check.", out: "Choppy!" }; },
        r => { const n = r.int(11, 40); return { n: "Not indented", lines: ["gold = " + n, "if gold > 10:", 'print("Rich!")'], b: 2, x: '    print("Rich!")', f: "The code inside an if must be indented (pushed right with 4 spaces).", e: "Python says IndentationError: expected an indented block.", l: "Indent the code inside if.", out: "Rich!" }; }
      ] },
    { k: "Match (choices)", m: "match picks one case from many, like a menu. Each case line ends with a colon; case _ catches anything else.", ex: "match cmd:\n    case \"go\":\n        print(\"Sailing\")\n    case _:\n        print(\"Huh?\")",
      v: [
        r => { const c = r.pick(["north", "south", "east"]); return { n: "case missing colon", lines: ['way = "' + c + '"', "match way:", '    case "' + c + '"', '        print("Sailing ' + c + '")', "    case _:", '        print("Lost!")'], b: 2, x: '    case "' + c + '":', f: "Every case line needs a colon at the end.", e: "Python stops with a SyntaxError: expected ':'.", l: "case lines end with a colon.", out: "Sailing " + c }; },
        r => { const c = r.pick(["north", "south", "east"]); return { n: "switch is not Python", lines: ['way = "' + c + '"', "switch way:", '    case "' + c + '":', '        print("Sailing ' + c + '")', "    case _:", '        print("Lost!")'], b: 1, x: "match way:", f: "Some languages say switch, but Python's word is match.", e: "Python stops with a SyntaxError.", l: "Python picks cases with match.", out: "Sailing " + c }; }
      ] },
    { k: "While loops", m: "while repeats code as long as its question is True. Make sure something changes so it can stop!", ex: "n = 1\nwhile n <= 3:\n    print(n)\n    n = n + 1",
      v: [
        r => { const t = r.int(3, 6); return { n: "Off by one", lines: ["# count from 1 to " + t, "n = 1", "while n < " + t + ":", "    print(n)", "    n = n + 1"], b: 2, x: "while n <= " + t + ":", f: "n < " + t + " stops BEFORE reaching " + t + ".", e: "It only prints 1 to " + (t - 1) + ".", l: "Use <= to include the last number.", out: Array.from({ length: t }, (_, i) => i + 1).join("\n") }; },
        r => { const t = r.int(3, 6); return { n: "while missing colon", lines: ["n = 1", "while n <= " + t, "    print(n)", "    n = n + 1"], b: 1, x: "while n <= " + t + ":", f: "The while line needs a colon at the end.", e: "Python stops with a SyntaxError: expected ':'.", l: "while lines end with a colon.", out: Array.from({ length: t }, (_, i) => i + 1).join("\n") }; }
      ] },
    { k: "For loops and range", m: "for repeats once for each item. range(1, 6) counts 1, 2, 3, 4, 5. It stops BEFORE the second number.", ex: "for i in range(1, 4):\n    print(i)",
      v: [
        r => { const t = r.int(3, 7); return { n: "range stops early", lines: ["# print 1 to " + t, "for i in range(1, " + t + "):", "    print(i)"], b: 1, x: "for i in range(1, " + (t + 1) + "):", f: "range stops BEFORE its second number, so range(1, " + t + ") ends at " + (t - 1) + ".", e: "It prints 1 to " + (t - 1) + ", missing " + t + ".", l: "range(1, n + 1) counts 1 to n.", out: Array.from({ length: t }, (_, i) => i + 1).join("\n") }; },
        r => { const t = r.int(2, 5); return { n: "Looping over a number", lines: ["for i in " + t + ":", '    print("Yo ho!")'], b: 0, x: "for i in range(" + t + "):", f: "You can't loop over a plain number. range(" + t + ") makes " + t + " steps.", e: "Python says TypeError: 'int' object is not iterable.", l: "Use range(n) to repeat n times.", out: Array(t).fill("Yo ho!").join("\n") }; }
      ] },
    { k: "Break and continue", m: "break jumps OUT of a loop. continue skips to the next round of the loop.", ex: "for n in range(5):\n    if n == 2:\n        continue\n    print(n)",
      v: [
        r => { const s = r.int(2, 4); return { n: "break instead of continue", lines: ["# skip " + s + " but print the rest up to 5", "for n in range(1, 6):", "    if n == " + s + ":", "        break", "    print(n)"], b: 3, x: "        continue", f: "break stops the whole loop. To skip just one number, use continue.", e: "It stops at " + s + " and never prints the numbers after it.", l: "continue skips one round; break ends the loop.", out: [1, 2, 3, 4, 5].filter(x => x !== s).join("\n") }; },
        r => { const s = r.int(1, 3); const it = r.picks(ITEMS, 5); return { n: "continue instead of break", lines: ["items = " + JSON.stringify(it).replace(/,/g, ", "), "# stop when we find the " + it[s], "for item in items:", "    if item == " + q(it[s]) + ":", "        continue", "    print(item)"], b: 4, x: "        break", f: "continue only skips the " + it[s] + ". To STOP the loop there, use break.", e: "It keeps printing the items after the " + it[s] + ".", l: "break leaves the loop.", out: it.slice(0, s).join("\n") }; }
      ] },
    { k: "Lists", m: "A list holds many values in order, inside [ ]. The first item is at index 0. .append() adds one to the end.", ex: 'crew = ["Milo", "Pearl"]\ncrew.append("Finn")\nprint(crew[0])',
      v: [
        r => { const c = r.picks(CREW, 3); return { n: "Index out of range", lines: ["crew = " + JSON.stringify(c).replace(/,/g, ", "), "# print the last pirate", "print(crew[3])"], b: 2, x: "print(crew[2])", f: "3 pirates sit at indexes 0, 1 and 2. There is no index 3.", e: "Python says IndexError: list index out of range.", l: "The last of n items is at index n - 1 (or use -1).", out: c[2] }; },
        r => { const c = r.picks(CREW, 3); return { n: "add is not append", lines: ["crew = " + JSON.stringify(c.slice(0, 2)).replace(/,/g, ", "), "crew.add(" + q(c[2]) + ")", "print(crew)"], b: 1, x: "crew.append(" + q(c[2]) + ")", f: "Lists don't have .add(). The word is .append().", e: "Python says AttributeError: 'list' object has no attribute 'add'.", l: "Use .append() to add to a list.", out: "['" + c.join("', '") + "']" }; },
        r => { const c = r.picks(ITEMS, 3); return { n: "Missing comma", lines: ['loot = ["' + c[0] + '", "' + c[1] + '" "' + c[2] + '"]', "print(len(loot))"], b: 0, x: 'loot = ["' + c[0] + '", "' + c[1] + '", "' + c[2] + '"]', f: "Without a comma, Python glues \"" + c[1] + "\" and \"" + c[2] + "\" into ONE string.", e: "It prints 2 instead of 3. No error at all, sneaky!", l: "Separate list items with commas.", out: "3" }; }
      ] },
    { k: "Dictionaries", m: "A dictionary stores pairs: a key and its value, like a word and its meaning. Keys are usually strings in quotes.", ex: 'ship = {"name": "Pearl", "guns": 4}\nprint(ship["name"])',
      v: [
        r => { const n = r.int(2, 12), p = r.pick(CREW); return { n: "Key without quotes", lines: ['ship = {"captain": "' + p + '", "guns": ' + n + "}", "print(ship[guns])"], b: 1, x: 'print(ship["guns"])', f: "The key is the text \"guns\", so it needs quotes. Without them Python looks for a variable named guns.", e: "Python says NameError: name 'guns' is not defined.", l: "String keys need quotes.", out: String(n) }; },
        r => { const n = r.int(2, 12); return { n: "Wrong capital letter in key", lines: ['chest = {"gold": ' + n + ', "gems": 2}', 'print(chest["Gold"])'], b: 1, x: 'print(chest["gold"])', f: "Keys are case-sensitive: \"Gold\" and \"gold\" are different keys.", e: "Python says KeyError: 'Gold'.", l: "Use the exact key, same capitals.", out: String(n) }; }
      ] },
    { k: "Functions", m: "def makes your own command. Parameters go in the brackets, and return sends an answer back.", ex: "def double(n):\n    return n * 2\nprint(double(4))",
      v: [
        r => { const a = r.int(2, 9), b = r.int(2, 9); return { n: "Forgot return", lines: ["def add(a, b):", "    a + b", "print(add(" + a + ", " + b + "))"], b: 1, x: "    return a + b", f: "The function adds, but never sends the answer back with return.", e: "It prints None instead of " + (a + b) + ".", l: "Use return to give back an answer.", out: String(a + b) }; },
        r => { const p = r.pick(CREW); return { n: "def missing colon", lines: ["def greet(name)", '    print("Ahoy, " + name)', "greet(" + q(p) + ")"], b: 0, x: "def greet(name):", f: "A def line needs a colon at the end.", e: "Python stops with a SyntaxError: expected ':'.", l: "def lines end with a colon.", out: "Ahoy, " + p }; },
        r => { const p = r.pick(CREW); return { n: "Missing argument", lines: ["def greet(name):", '    print("Ahoy, " + name)', "greet()"], b: 2, x: "greet(" + q(p) + ")", f: "greet needs a name, but none was given.", e: "Python says TypeError: greet() missing 1 required positional argument: 'name'.", l: "Give a function every value it asks for.", out: "Ahoy, " + p }; }
      ] },
    { k: "Scope", m: "A variable made inside a function only lives inside it. Pass values in and return them out.", ex: "def make():\n    x = 5\n    return x\nprint(make())",
      v: [
        r => { const n = r.int(2, 20); return { n: "Forgot to save the answer", lines: ["def find_gold():", "    gold = " + n, "    return gold", "find_gold()", "print(gold)"], b: 3, x: "gold = find_gold()", f: "gold only lives inside find_gold. The function returns it, but line 4 throws the answer away instead of saving it.", e: "Python says NameError: name 'gold' is not defined.", l: "Save a function's returned value in a variable.", out: String(n) }; },
        r => { const n = r.int(2, 9); return { n: "Changing a global inside", lines: ["score = " + n, "def win():", "    score = score + 1", "win()", "print(score)"], b: 2, x: "    global score; score = score + 1", f: "Changing score inside the function makes Python think it's a new local variable, which has no value yet.", e: "Python says UnboundLocalError: cannot access local variable 'score'.", l: "Use global (or better, return a new value) to change outside variables.", out: String(n + 1) }; }
      ] },
    { k: "Errors and try/except", m: "try runs risky code. If it breaks, except catches the error so the program keeps going. Catch the right error type!", ex: "try:\n    n = int(\"abc\")\nexcept ValueError:\n    print(\"Not a number\")",
      v: [
        r => { const w = r.pick(ITEMS); return { n: "Catching the wrong error", lines: ["try:", '    n = int("' + w + '")', "except TypeError:", '    print("That is not a number!")'], b: 2, x: "except ValueError:", f: "int(\"" + w + "\") raises a ValueError, not a TypeError, so except doesn't catch it.", e: "The program crashes with ValueError instead of printing the friendly message.", l: "Catch the error type that actually happens.", out: "That is not a number!" }; },
        r => { const n = r.int(2, 30); return { n: "Catching the wrong divide error", lines: ["pirates = 0", "try:", "    each = " + n + " / pirates", "except ValueError:", '    print("No pirates to share with!")'], b: 3, x: "except ZeroDivisionError:", f: "Dividing by 0 raises ZeroDivisionError, but the except is waiting for a ValueError.", e: "The program crashes with ZeroDivisionError: division by zero.", l: "Match except to the error that really happens.", out: "No pirates to share with!" }; }
      ] }
  ];

  /* ======================= JAVASCRIPT ======================= */
  const JS = [
    { k: "Printing", m: "console.log() shows text on the screen. Put text in quotes inside the round brackets.", ex: 'console.log("Ahoy!");',
      v: [
        r => { const w = r.pick(WORDS); return { n: "Missing closing quote", lines: ['console.log("' + w + '!);'], b: 0, x: 'console.log("' + w + '!");', f: "The text opens a quote but never closes it.", e: "JavaScript stops with SyntaxError: Invalid or unexpected token.", l: "Every opening quote needs a closing quote.", out: w + "!" }; },
        r => { const w = r.pick(WORDS); return { n: "console.Log with a capital L", lines: ['console.Log("' + w + '");'], b: 0, x: 'console.log("' + w + '");', f: "JavaScript cares about capitals: log is lowercase.", e: "TypeError: console.Log is not a function.", l: "JavaScript is case-sensitive.", out: w }; }
      ] },
    { k: "Comments", m: "// starts a note that JavaScript skips. /* ... */ wraps longer notes.", ex: '// a note\nconsole.log("Hi");',
      v: [
        r => { const w = r.pick(WORDS); return { n: "# is not a comment", fixed: true, lines: ["# greet the crew", 'console.log("' + w + '");'], b: 0, x: "// greet the crew", f: "# makes comments in Python, but JavaScript uses //.", e: "SyntaxError: Invalid or unexpected token.", l: "JavaScript comments start with //.", out: w }; }
      ] },
    { k: "Variables: let and const", m: "let makes a variable you can change. const makes one that stays the same forever.", ex: "let gold = 5;\ngold = 6;\nconst ship = \"Pearl\";",
      v: [
        r => { const v = r.pick(NUMS), n = r.int(2, 20); return { n: "Changing a const", lines: ["const " + v + " = " + n + ";", v + " = " + v + " + 1;", "console.log(" + v + ");"], b: 0, x: "let " + v + " = " + n + ";", f: v + " is changed on line 2, but const values can't change. Use let.", e: "TypeError: Assignment to constant variable.", l: "Use let for values that change.", out: String(n + 1) }; },
        r => { const v = r.pick(NUMS), n = r.int(2, 20); return { n: "Misspelled variable", lines: ["let " + v + " = " + n + ";", "console.log(" + v.slice(0, -1) + ");"], b: 1, x: "console.log(" + v + ");", f: "The variable is " + v + ", not " + v.slice(0, -1) + ".", e: "ReferenceError: " + v.slice(0, -1) + " is not defined.", l: "Use exactly the same name.", out: String(n) }; }
      ] },
    { k: "Data types", m: "JavaScript values: numbers, strings in quotes, true/false booleans, null for 'nothing' and undefined for 'not set yet'.", ex: 'let age = 9;\nlet name = "Milo";\nlet brave = true;',
      v: [
        r => { const p = r.pick(CREW); return { n: "True with a capital T", lines: ['let name = "' + p + '";', "let brave = True;", "console.log(name, brave);"], b: 1, x: "let brave = true;", f: "JavaScript booleans are lowercase: true and false.", e: "ReferenceError: True is not defined.", l: "Booleans are true and false, lowercase.", out: p + " true" }; }
      ] },
    { k: "Strings and numbers", m: "+ adds numbers, but if either side is text it GLUES them. Number(\"7\") turns text into a number.", ex: 'console.log(Number("7") + 1); // 8',
      v: [
        r => { const a = r.int(2, 9), b = r.int(2, 9); return { n: "Text plus number glues", lines: ['let a = "' + a + '";', "let b = " + b + ";", "console.log(a + b);"], b: 0, x: "let a = " + a + ";", f: "a is text, so + glues instead of adding.", e: "It prints " + a + "" + b + " instead of " + (a + b) + ".", l: "Numbers for math have no quotes.", out: String(a + b) }; },
        r => { const a = r.int(10, 40), b = r.int(1, 9); return { n: "Forgot Number()", lines: ['let text = "' + a + '";', "let n = text;", "console.log(n + " + b + ");"], b: 1, x: "let n = Number(text);", f: "n is still text, so + glues instead of adding.", e: "It prints " + a + "" + b + " instead of " + (a + b) + ".", l: "Convert text with Number().", out: String(a + b) }; }
      ] },
    { k: "Math and order", m: "* and / happen before + and -. Brackets go first. ** means 'to the power of'.", ex: "console.log((2 + 3) * 4); // 20",
      v: [
        r => { const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 5); return { n: "Forgot the brackets", lines: ["// add, then multiply by " + c, "let total = " + a + " + " + b + " * " + c + ";", "console.log(total);"], b: 1, x: "let total = (" + a + " + " + b + ") * " + c + ";", f: "* happens before +.", e: "It prints " + (a + b * c) + " instead of " + ((a + b) * c) + ".", l: "Brackets make a sum happen first.", out: String((a + b) * c) }; },
        r => { const a = r.int(2, 6), b = r.int(2, 3); return { n: "^ is not power", lines: ["let result = " + a + " ^ " + b + "; // power", "console.log(result);"], b: 0, x: "let result = " + a + " ** " + b + "; // power", f: "^ is a bit trick, not power. Use **.", e: "It prints " + (a ^ b) + " instead of " + Math.pow(a, b) + ".", l: "Power is **.", out: String(Math.pow(a, b)) }; }
      ] },
    { k: "String basics", m: "Strings have .length, and str[0] is the first letter. Template strings use backticks and ${name}.", ex: 'let s = "Pearl";\nconsole.log(s.length, s[0]);',
      v: [
        r => { const w = r.pick(CREW); return { n: "First letter is index 0", lines: ['let name = "' + w + '";', "console.log(name[1]); // first letter"], b: 1, x: "console.log(name[0]); // first letter", f: "Counting starts at 0, so [1] is the second letter.", e: "It prints '" + w[1] + "' instead of '" + w[0] + "'.", l: "The first letter is at index 0.", out: w[0] }; },
        r => { const w = r.pick(ITEMS), p = r.pick(CREW); return { n: "Quotes instead of backticks", lines: ['let item = "' + w + '";', 'console.log("' + p + ' found a ${item}");'], b: 1, x: "console.log(`" + p + " found a ${item}`);", f: "${item} only fills in inside backticks ` `, not normal quotes.", e: "It prints " + p + " found a ${item} literally.", l: "Use backticks for ${} templates.", out: p + " found a " + w }; }
      ] },
    { k: "Comparisons", m: "=== checks 'exactly equal'. One = stores a value. !== means not equal.", ex: "if (gold === 10) console.log(\"Ten!\");",
      v: [
        r => { const n = r.int(2, 9); return { n: "= instead of ===", lines: ["let gold = " + (n + 1) + ";", "if (gold = " + n + ") {", '  console.log("Exactly ' + n + '!");', "} else {", '  console.log("Not ' + n + '");', "}"], b: 1, x: "if (gold === " + n + ") {", f: "= stores " + n + " into gold instead of comparing. Use ===.", e: "It wrongly prints 'Exactly " + n + "!' because gold just got changed.", l: "Compare with ===, store with =.", out: "Not " + n }; },
        r => { const n = r.int(2, 9); return { n: "== lets text match numbers", lines: ['let input = "' + n + '";', "if (input == " + n + ") {", '  console.log("number");', "} else {", '  console.log("text");', "}"], b: 1, x: "if (input === " + n + ") {", f: "== quietly converts text to a number before comparing. === checks the type too.", e: "It prints 'number' even though input is text.", l: "Prefer === over ==.", out: "text" }; }
      ] },
    { k: "If / else", m: "if (question) { ... } else { ... }. The question goes in round brackets.", ex: "if (gold > 10) {\n  console.log(\"Rich!\");\n} else {\n  console.log(\"Keep hunting\");\n}",
      v: [
        r => { const n = r.int(11, 30); return { n: "Missing brackets around question", lines: ["let gold = " + n + ";", "if gold > 10 {", '  console.log("Rich!");', "}"], b: 1, x: "if (gold > 10) {", f: "JavaScript needs ( ) around the if question.", e: "SyntaxError: Unexpected identifier.", l: "if questions go inside ( ).", out: "Rich!" }; },
        r => { const n = r.int(4, 6); return { n: "elif is not JavaScript", lines: ["let waves = " + n + ";", "if (waves > 8) {", '  console.log("Storm!");', "} elif (waves > 3) {", '  console.log("Choppy!");', "}"], b: 3, x: "} else if (waves > 3) {", f: "JavaScript writes 'else if', not elif.", e: "SyntaxError: Unexpected token '{'.", l: "Use else if for another check.", out: "Choppy!" }; }
      ] },
    { k: "Switch", m: "switch picks a case. Each case needs break, or it falls into the next one!", ex: "switch (way) {\n  case \"n\": console.log(\"North\"); break;\n  default: console.log(\"?\");\n}",
      v: [
        r => { return { n: "Missing break", lines: ['let way = "north";', "switch (way) {", '  case "north":', '    console.log("Sailing north");', '  case "south":', '    console.log("Sailing south");', "    break;", "}"], b: 3, x: '    console.log("Sailing north"); break;', f: "Without break, the code falls through into the south case too.", e: "It prints both 'Sailing north' and 'Sailing south'.", l: "End each case with break.", out: "Sailing north" }; }
      ] },
    { k: "Loops", m: "for (let i = 1; i <= 3; i++) counts 1, 2, 3. while repeats while its question is true.", ex: "for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}",
      v: [
        r => { const t = r.int(3, 6); return { n: "Off by one", lines: ["// count 1 to " + t, "for (let i = 1; i < " + t + "; i++) {", "  console.log(i);", "}"], b: 1, x: "for (let i = 1; i <= " + t + "; i++) {", f: "i < " + t + " stops before " + t + ".", e: "It only prints 1 to " + (t - 1) + ".", l: "Use <= to include the last number.", out: Array.from({ length: t }, (_, i) => i + 1).join("\n") }; },
        r => { const t = r.int(3, 6); return { n: "Commas instead of semicolons", lines: ["for (let i = 1, i <= " + t + ", i++) {", "  console.log(i);", "}"], b: 0, x: "for (let i = 1; i <= " + t + "; i++) {", f: "The three parts of a for loop are separated by semicolons.", e: "SyntaxError.", l: "for (start; check; step).", out: Array.from({ length: t }, (_, i) => i + 1).join("\n") }; }
      ] },
    { k: "Arrays", m: "An array holds a list in [ ]. Index 0 is first, .length counts items and .push() adds one.", ex: 'let crew = ["Milo"];\ncrew.push("Pearl");\nconsole.log(crew.length);',
      v: [
        r => { const c = r.picks(CREW, 3); return { n: "Past the end", lines: ["let crew = " + JSON.stringify(c).replace(/,/g, ", ") + ";", "console.log(crew[crew.length]); // last pirate"], b: 1, x: "console.log(crew[crew.length - 1]); // last pirate", f: "Indexes go 0 to length - 1. crew[length] is one past the end.", e: "It prints undefined instead of " + c[2] + ".", l: "The last item is at length - 1.", out: c[2] }; },
        r => { const c = r.picks(CREW, 3); return { n: "append is not JavaScript", lines: ["let crew = " + JSON.stringify(c.slice(0, 2)).replace(/,/g, ", ") + ";", "crew.append(" + q(c[2]) + ");", "console.log(crew.length);"], b: 1, x: "crew.push(" + q(c[2]) + ");", f: "Arrays use .push(), not .append().", e: "TypeError: crew.append is not a function.", l: "Use .push() to add to an array.", out: "3" }; }
      ] },
    { k: "Objects", m: "An object stores key: value pairs in { }. Read one with ship.name or ship[\"name\"].", ex: 'let ship = { name: "Pearl", guns: 4 };\nconsole.log(ship.name);',
      v: [
        r => { const n = r.int(2, 12); return { n: "Wrong key name", lines: ["let ship = { guns: " + n + " };", "console.log(ship.gun);"], b: 1, x: "console.log(ship.guns);", f: "The key is guns, not gun.", e: "It prints undefined instead of " + n + ".", l: "Use the exact key name.", out: String(n) }; },
        r => { const n = r.int(2, 12); return { n: "= instead of :", lines: ["let chest = { gold = " + n + " };", "console.log(chest.gold);"], b: 0, x: "let chest = { gold: " + n + " };", f: "Inside an object, keys and values are joined with a colon.", e: "SyntaxError: Invalid shorthand property initializer.", l: "Objects use key: value.", out: String(n) }; }
      ] },
    { k: "Functions", m: "function name(params) { return answer; } makes your own command.", ex: "function double(n) {\n  return n * 2;\n}\nconsole.log(double(4));",
      v: [
        r => { const a = r.int(2, 9), b = r.int(2, 9); return { n: "Forgot return", lines: ["function add(a, b) {", "  a + b;", "}", "console.log(add(" + a + ", " + b + "));"], b: 1, x: "  return a + b;", f: "The function never returns its answer.", e: "It prints undefined instead of " + (a + b) + ".", l: "Use return to give back an answer.", out: String(a + b) }; },
        r => { const p = r.pick(CREW); return { n: "Calling without brackets", lines: ["function greet() {", '  return "Ahoy, ' + p + '";', "}", "console.log(greet);"], b: 3, x: "console.log(greet());", f: "greet without () is the function itself, not its answer.", e: "It prints [Function: greet] instead of the greeting.", l: "Call functions with ().", out: "Ahoy, " + p }; }
      ] },
    { k: "Scope", m: "Variables made with let inside { } only live inside those braces.", ex: "let x = 1;\n{ let y = 2; }\nconsole.log(x);",
      v: [
        r => { const n = r.int(2, 20); return { n: "Using a variable outside its block", lines: ["if (true) {", "  let gold = " + n + ";", "}", "console.log(gold);"], b: 1, x: "  var gold = " + n + ";", f: "let gold only lives inside the if's braces. (Better: make gold before the if.)", e: "ReferenceError: gold is not defined.", l: "let variables live only inside their { }.", out: String(n) }; }
      ] },
    { k: "Errors and try/catch", m: "try runs risky code; catch handles the error so the program keeps going.", ex: "try {\n  JSON.parse(\"oops\");\n} catch (err) {\n  console.log(\"Bad data\");\n}",
      v: [
        r => { const w = r.pick(ITEMS); return { n: "No try around risky code", lines: ['let data = "' + w + '";', "let obj = JSON.parse(data);", 'console.log("parsed");'], b: 1, x: 'let obj; try { obj = JSON.parse(data); } catch (e) { console.log("Bad data"); }', f: "\"" + w + "\" isn't valid JSON, so JSON.parse throws and nothing catches it.", e: "SyntaxError: Unexpected token, and the program stops.", l: "Wrap risky code in try/catch.", out: "Bad data\nparsed" }; }
      ] }
  ];

  const CURRICULUM = { python: PY, javascript: JS };
  const COMMENT = { python: "#", javascript: "//" };
  function makeLesson(lang, ci, vi, rng) {
    const C = CURRICULUM[lang][ci]; const r = R(rng);
    const raw = C.v[vi](r);
    const p = done(r, raw, COMMENT[lang]);
    if (raw.setup) p.setup = raw.setup; if (raw.sc) p.sc = raw.sc; if (raw.task) p.task = raw.task;
    p.k = C.k; p.m = C.m; p.ex = C.ex; p.vid = ci + ":" + vi;
    return p;
  }
  root.BB_CURRICULUM = CURRICULUM;
  root.BB_COMMENT = COMMENT;
  root.BB_makeLesson = makeLesson;
  if (typeof module !== "undefined") module.exports = { CURRICULUM, makeLesson };
})(typeof window !== "undefined" ? window : globalThis);
