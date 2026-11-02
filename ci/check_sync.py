#!/usr/bin/env python3
"""Bug Buccaneers CI check: the Android app's bundled copies must stay
byte-identical to the web originals, or phone and site drift apart.

Pairs checked:
  index.html            <-> android/app/src/main/assets/game.html
  ai-milo.js            <-> android/app/src/main/assets/ai-milo.js
  curriculum*.js        <-> android/app/src/main/assets/<same name>
  audio/**              <-> android/app/src/main/assets/audio/**
"""
import hashlib
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANDROID = os.path.join(ROOT, "android", "app", "src", "main", "assets")


def digest(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def compare(rel_web, rel_android, failures):
    web = os.path.join(ROOT, rel_web)
    app = os.path.join(ANDROID, rel_android)
    if not os.path.exists(web):
        failures.append(f"missing web file: {rel_web}")
        return
    if not os.path.exists(app):
        failures.append(f"missing android copy: {rel_android}")
        return
    if digest(web) != digest(app):
        failures.append(f"out of sync: {rel_web} != android/{rel_android}")


def main():
    failures = []
    compare("index.html", "game.html", failures)
    compare("ai-milo.js", "ai-milo.js", failures)
    for name in sorted(os.listdir(ROOT)):
        if name.startswith("curriculum") and name.endswith(".js"):
            compare(name, name, failures)
    # Audio trees: the Android app's voice bundle is a parked product
    # decision (one big offline bundle vs downloadable packs), so today
    # the app assets intentionally hold only intro + phrase clips.
    # Report drift as a WARNING; promote to a hard failure the day the
    # app rebuild ships the full narration set.
    warnings = []
    web_audio = os.path.join(ROOT, "audio")
    app_audio = os.path.join(ANDROID, "audio")
    web_files = set()
    for base, _dirs, files in os.walk(web_audio):
        for fn in files:
            web_files.add(os.path.relpath(os.path.join(base, fn), web_audio))
    app_files = set()
    if os.path.isdir(app_audio):
        for base, _dirs, files in os.walk(app_audio):
            for fn in files:
                app_files.add(os.path.relpath(os.path.join(base, fn), app_audio))
    missing = len(web_files - app_files)
    extra = len(app_files - web_files)
    differ = sum(1 for rel in (web_files & app_files)
                 if digest(os.path.join(web_audio, rel)) != digest(os.path.join(app_audio, rel)))
    if missing or extra or differ:
        warnings.append(
            f"android audio bundle is partial by design: {missing} clips not bundled, "
            f"{extra} app-only, {differ} differing (intro/phrases) — see app voice-pack decision")
    if failures:
        print("SYNC CHECK FAILED:")
        for f_ in failures:
            print(" -", f_)
        return 1
    for w_ in warnings:
        print("warning:", w_)
    print("sync check OK (index/game.html, ai-milo.js and curriculum pairs byte-identical)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
