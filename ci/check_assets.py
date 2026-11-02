#!/usr/bin/env python3
"""Bug Buccaneers CI check: every narration clip the game ships must be
present. The expected set lives in ci/audio-manifest.txt (one relative
path per line, generated from the verified live build). A missing clip
means a lesson plays in silence; an unexpected clip means the manifest
was not regenerated after a voice change.
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "ci", "audio-manifest.txt")
LANGS = ["c", "cpp", "csharp", "go", "java", "javascript",
         "php", "python", "ruby", "rust", "sql", "typescript"]


def main():
    failures = []
    with open(MANIFEST) as f:
        expected = {ln.strip() for ln in f if ln.strip()}
    actual = set()
    audio_root = os.path.join(ROOT, "audio")
    for base, _dirs, files in os.walk(audio_root):
        for fn in files:
            if fn.endswith(".mp3"):
                actual.add(os.path.relpath(os.path.join(base, fn), ROOT))
    for rel in sorted(expected - actual):
        failures.append(f"missing narration clip: {rel}")
    for rel in sorted(actual - expected):
        failures.append(f"unlisted clip (regenerate manifest): {rel}")
    for lang in LANGS:
        folder = os.path.join(audio_root, lang)
        if not os.path.isdir(folder):
            failures.append(f"missing language folder: audio/{lang}")
        elif not any(fn.endswith(".mp3") for fn in os.listdir(folder)):
            failures.append(f"language folder has no clips: audio/{lang}")
    for rel in ("audio/milo-intro.mp3",):
        if not os.path.exists(os.path.join(ROOT, rel)):
            failures.append(f"missing: {rel}")
    phrases = os.path.join(audio_root, "phrases")
    if not os.path.isdir(phrases) or not any(
            fn.endswith(".mp3") for fn in os.listdir(phrases)):
        failures.append("phrases folder missing or empty")
    if failures:
        print("ASSET CHECK FAILED:")
        for f_ in failures:
            print(" -", f_)
        return 1
    print(f"asset check OK ({len(expected)} clips in manifest, 12 languages, intro + phrases present)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
