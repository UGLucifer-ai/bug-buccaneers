#!/usr/bin/env python3
"""Bug Buccaneers CI check: basic sanity of the shipped page.
 - every root .js file parses under `node --check`
 - index.html parses, and every local file it references exists
"""
import os
import subprocess
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class RefParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        for key, val in attrs:
            if key in ("src", "href") and val:
                self.refs.append(val)


def main():
    failures = []
    js_files = [fn for fn in sorted(os.listdir(ROOT)) if fn.endswith(".js")]
    for fn in js_files:
        r = subprocess.run(["node", "--check", os.path.join(ROOT, fn)],
                           capture_output=True, text=True)
        if r.returncode != 0:
            failures.append(f"JS syntax error in {fn}: {r.stderr.strip().splitlines()[-1] if r.stderr else 'unknown'}")
    parser = RefParser()
    with open(os.path.join(ROOT, "index.html"), encoding="utf-8") as f:
        parser.feed(f.read())
    for ref in parser.refs:
        if ref.startswith(("http://", "https://", "//", "data:", "#", "mailto:")):
            continue
        local = ref.split("#")[0].split("?")[0]
        if local and not os.path.exists(os.path.join(ROOT, local)):
            failures.append(f"index.html references missing file: {ref}")
    if failures:
        print("SYNTAX CHECK FAILED:")
        for f_ in failures:
            print(" -", f_)
        return 1
    print(f"syntax check OK ({len(js_files)} js files parse, all local references resolve)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
