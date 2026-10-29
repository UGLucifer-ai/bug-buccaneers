#!/usr/bin/env bash
# Debug Battleship — manual APK build (no Gradle).
#
# Why: this dev VM's sandbox resets JVM loopback sockets between
# processes, which kills the Gradle daemon protocol ("Could not receive
# a message from the daemon") — the same reason the ZEUS app ships a
# manual pipeline (see ../goals/jarvis-personal-ai-system/
# zeus-core-android/manual-build/manual_build.py). This script mirrors
# that approach with single-process tools only:
# aapt2 -> javac -> d8 -> zipalign -> apksigner.
#
# Usage:  ./build.sh
# Output: build-manual/debug-battleship.apk  (debug-signed, ZEUS key)
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
SDK="${ANDROID_HOME:-/home/hatch/workspace/android-sdk}"
BT="$SDK/build-tools/35.0.0"
ANDROID_JAR="$SDK/platforms/android-35/android.jar"
export JAVA_HOME="${JAVA_HOME:-$HOME/workspace/tools/jdk17}"
export PATH="$JAVA_HOME/bin:$PATH"
JAVAC="$JAVA_HOME/bin/javac"

APP="$HERE/app/src/main"
WORK="$HERE/build-manual"
PKG="com.uday.debugbattleship"
rm -rf "$WORK"
mkdir -p "$WORK/gen" "$WORK/classes" "$WORK/dex"

echo "[1/6] aapt2 compile resources"
"$BT/aapt2" compile --dir "$APP/res" -o "$WORK/res.zip"

echo "[2/6] aapt2 link (manifest + resources + assets/game.html)"
# aapt2 requires a package attribute in the manifest itself; the project
# manifest stays namespace-only for Gradle, so link against a patched copy.
sed "s|<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\">|<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\" package=\"$PKG\">|" \
    "$APP/AndroidManifest.xml" > "$WORK/AndroidManifest.xml"
"$BT/aapt2" link -o "$WORK/unsigned.apk" \
    -I "$ANDROID_JAR" \
    --manifest "$WORK/AndroidManifest.xml" \
    --java "$WORK/gen" \
    --min-sdk-version 29 --target-sdk-version 35 \
    --version-code 1 --version-name "1.0" \
    -A "$APP/assets" \
    "$WORK/res.zip"

echo "[3/6] javac (activity + generated R)"
"$JAVAC" -encoding UTF-8 -source 17 -target 17 -cp "$ANDROID_JAR" -d "$WORK/classes" \
    "$APP/java/com/uday/debugbattleship/MainActivity.java" \
    "$WORK/gen/com/uday/debugbattleship/R.java"

echo "[4/6] d8 (dex)"
"$JAVA_HOME/bin/jar" cf "$WORK/classes.jar" -C "$WORK/classes" .
"$BT/d8" --lib "$ANDROID_JAR" --min-api 29 --output "$WORK/dex" "$WORK/classes.jar"

echo "[5/6] add classes.dex, zipalign"
python3 - "$WORK/unsigned.apk" "$WORK/dex/classes.dex" <<'EOF'
import sys, zipfile
apk, dex = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(apk, "a", zipfile.ZIP_DEFLATED) as z:
    z.write(dex, "classes.dex")
EOF
"$BT/zipalign" -f -p 4 "$WORK/unsigned.apk" "$WORK/aligned.apk"

echo "[6/6] apksigner sign (ZEUS debug key)"
"$BT/apksigner" sign \
    --ks "$HERE/debug.keystore" \
    --ks-pass pass:android --key-pass pass:android \
    --out "$WORK/debug-battleship.apk" "$WORK/aligned.apk"

"$BT/apksigner" verify --print-certs "$WORK/debug-battleship.apk" | head -4
ls -la "$WORK/debug-battleship.apk"
echo "DONE: $WORK/debug-battleship.apk"
