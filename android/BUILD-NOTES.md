# Debug Battleship — Android build notes

A minimal single-activity WebView shell around the Debug Battleship web
game. The whole game is one self-contained HTML file in assets; the app
needs no permissions and no network.

- **App name:** Debug Battleship
- **applicationId:** `com.uday.debugbattleship`
- **version:** versionCode 1 / versionName "1.0"
- **minSdk / targetSdk:** 29 / 35 (same as the ZEUS app)
- **APK output:** `build-manual/debug-battleship.apk` (~62 KB)

## Rebuild after the game changes

1. Re-export the finished game from the web artifact (the export writes
   `~/workspace/your_files/debug-battleship/debug-battleship.html`).
2. Copy it over the bundled copy:
   `cp ~/workspace/your_files/debug-battleship/debug-battleship.html app/src/main/assets/game.html`
3. Run `./build.sh` from this directory. It re-signs and rewrites
   `build-manual/debug-battleship.apk`.
4. Install on the phone by opening the APK (same signing key as ZEUS,
   so it installs/updates cleanly alongside it).

To bump the version, change `--version-code` / `--version-name` in
`build.sh` and `versionCode` / `versionName` in `app/build.gradle.kts`.

## Why build.sh instead of Gradle

Project files for Gradle/Android Studio are included
(`settings.gradle.kts`, `build.gradle.kts`, AGP 8.6.1 — the ZEUS
versions) and will build normally on a regular machine. In THIS dev VM
they cannot: the sandbox resets JVM loopback sockets between processes,
so the Gradle daemon protocol dies with "Could not receive a message
from the daemon" — the exact failure that gave ZEUS its manual pipeline
(`~/workspace/goals/jarvis-personal-ai-system/zeus-core-android/manual-build/`).

`build.sh` mirrors that approach with single-process SDK tools only
(SDK: `~/workspace/android-sdk`, build-tools 35.0.0, JDK 17 in
`~/workspace/tools/jdk17`):

aapt2 compile → aapt2 link (patched manifest copy with the package
attribute aapt2 requires) → javac → jar → d8 → zipalign → apksigner.

## Signing

`debug.keystore` in this directory is a copy of the ZEUS debug key
(`zeus-core-android/build-manual/debug.keystore`):
alias `androiddebugkey`, password `android`,
cert SHA-256 `8cffb1534c1304227564acb209b227ee923621bbdd08945860b2848adb80b519`.

## Notes

- The game HTML references Google Fonts; offline it falls back to
  system fonts and plays identically (no INTERNET permission by design).
- Activity: `app/src/main/java/com/uday/debugbattleship/MainActivity.java`
  (plain Java, framework WebView, JavaScript + DOM storage enabled,
  loads `file:///android_asset/game.html`).
