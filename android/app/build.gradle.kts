plugins {
    id("com.android.application")
}

android {
    namespace = "com.uday.debugbattleship"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.uday.debugbattleship"
        minSdk = 29
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    signingConfigs {
        // Same debug key as the ZEUS app (copied from its build-manual/),
        // so installs from this workspace share one signing identity.
        getByName("debug") {
            storeFile = rootProject.file("debug.keystore")
            storePassword = "android"
            keyAlias = "androiddebugkey"
            keyPassword = "android"
        }
    }

    buildTypes {
        debug {
            signingConfig = signingConfigs.getByName("debug")
        }
        release {
            isMinifyEnabled = false
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

// No dependencies: the whole game is one HTML file in assets, shown by a
// plain android.webkit.WebView activity. Nothing to download beyond AGP.
dependencies {
}
