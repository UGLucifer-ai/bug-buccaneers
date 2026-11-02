# Bug Buccaneers

Bug Buccaneers (formerly Debug Battleship) is a kid-friendly pirate coding game that combines a
bug hunt with Battleship. Each round presents a short code snippet with
one planted fault. The player who spots the fault first earns a shot at
the opposing fleet; every round ends with a plain-language explanation
of the bug, why it breaks the code, the corrected line, and the lesson
to remember.

## Play it

**Play on GitHub Pages:** [https://uglucifer-ai.github.io/bug-buccaneers/](https://uglucifer-ai.github.io/bug-buccaneers/)

The complete web game is also contained in this repository as
`index.html`.

## Game modes and content

- **Solo Adventure** — race Captain Barnaclebeard's sonar, arrange your
  own fleet, and pause the solo race when you need a break.
- **Join a Crew** — two players use the same room code, language, level,
  and opposite player sides, then read their shots aloud over their own
  call.
- **12 languages** — Python, JavaScript, Java, C++, SQL, C, C#,
  TypeScript, Go, PHP, Ruby, and Rust.
- **Three levels** — Novice, Beginner, and Expert.
- Players arrange four ships on an 8×8 board before battle.

## Repository layout

- `index.html` — the complete, self-contained web game.
- `android/` — the Android WebView project that packages the same game
  as an installable app.
- `android/BUILD-NOTES.md` — the original Android build notes.

## CI/CD pipeline

[![CI/CD](https://github.com/UGLucifer-ai/bug-buccaneers/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/UGLucifer-ai/bug-buccaneers/actions/workflows/ci-cd.yml)

Every push and pull request runs the check suite in `.github/workflows/ci-cd.yml`:

1. **Asset completeness** (`ci/check_assets.py`) — all 973 narration clips listed in
   `ci/audio-manifest.txt` must be present across the 12 language folders, plus the
   intro and phrase clips. A missing clip would mean a lesson playing in silence.
2. **Web/Android sync** (`ci/check_sync.py`) — `index.html`, `ai-milo.js` and the
   curriculum files must be byte-identical to the copies bundled in the Android app,
   so the site and the app can never quietly drift apart. (The app's audio bundle is
   currently partial by design — a tracked warning in the check output, pending the
   offline-bundle vs voice-pack decision.)
3. **Syntax and references** (`ci/check_syntax.py`) — every shipped JS file must parse,
   and every local file `index.html` references must exist.

**Deploying:** a green build on `main` may deploy to GitHub Pages, but the deploy job
runs in the `production` environment, which requires a human approval first. Nothing
reaches the live site automatically — automation proposes, a person disposes. That
gate is deliberate: the live game is played by children, and its maintainer approves
every release personally.

Run the checks locally any time:

```sh
python3 ci/check_assets.py && python3 ci/check_sync.py && python3 ci/check_syntax.py
```

## Rebuild the Android app

The Android app is a minimal single-activity WebView shell. It needs no
internet permission; it loads the bundled game from
`android/app/src/main/assets/game.html`.

In the original development environment, the Android SDK is at
`~/workspace/android-sdk` (platform 35, build-tools 35.0.0) and JDK 17 is
at `~/workspace/tools/jdk17`. Gradle project files are included for use
in Android Studio on a regular machine. In the original development VM,
Gradle cannot run because the sandbox resets JVM loopback sockets, so
`build.sh` uses a manual single-process pipeline instead:
aapt2 → javac → jar → d8 → zipalign → apksigner.

To rebuild after changing the game:

1. Copy the final game HTML over the Android asset:

   ```sh
   cp index.html android/app/src/main/assets/game.html
   ```

2. Run the build script:

   ```sh
   cd android
   ./build.sh
   ```

   If the executable bit is not present after checkout, use
   `bash build.sh`.

3. The signed APK is written to:

   ```text
   android/build-manual/debug-battleship.apk
   ```

### Signing note

`build.sh` expects a local `android/debug.keystore`. Keystores are
intentionally **not** committed to this repository. Supply a local
debug keystore with alias `androiddebugkey` and password `android`, or
adjust the signing section of `build.sh` for your own key. Never commit
a keystore or other credential.
