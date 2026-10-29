# Debug Battleship

Debug Battleship is a kid-friendly pirate coding game that combines a
bug hunt with Battleship. Each round presents a short code snippet with
one planted fault. The player who spots the fault first earns a shot at
the opposing fleet; every round ends with a plain-language explanation
of the bug, why it breaks the code, the corrected line, and the lesson
to remember.

## Play it

**GitHub Pages:** `GITHUB_PAGES_URL_TO_BE_ADDED`

> Placeholder: this will be replaced with the GitHub Pages address once
> the repository's visibility has been decided and Pages is enabled.

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
