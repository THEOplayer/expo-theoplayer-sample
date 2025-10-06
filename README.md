# expo-theoplayer-sample

This project demonstrates using [react-native-theoplayer](https://github.com/THEOplayer/react-native-theoplayer)
in an [Expo](https://expo.dev/) app.

Expo provides a set of tools and services that aim to simplify the process of developing, testing, and deploying
React Native apps.

## Quick Start

### Setup

```bash
$ npm install
$ npm run android
$ npm run web
$ npm run ios
```

### Expo Plugins

Rather than modifying native platform code directly, Expo uses plugins to configure native functionality. This sample app includes the following Expo plugins:

- `expo-router`: sets up the Expo Router library.
- `expo-splash-screen`: manages splash screen settings.
- `react-native-theoplayer`: adds additional Maven repositories for Android used by `react-native-theoplayer`.
- `react-native-google-cast`: configures native Cast settings.

### THEOplayer Extensions

Use the `react-native-theoplayer` Expo plugin to configure extensions.

Either once for all platforms:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-theoplayer",
        {
          "extensions": ["cast", "dai", "ima", "millicast", "theoads"]
        }
      ]
    ]
  }
}
```

or otherwise with specific values for each platform separately:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-theoplayer",
        {
          "ios": {
            "extensions": ["cast", "ima", "millicast", "sideloaded-texttracks","theoads"]
          },
          "android": {
            "extensions": ["cast", "dai", "ima", "millicast", "theoads"]
          }
        }
      ]
    ]
  }
}
```

#### Enabling Chromecast support on iOS

Our iOS SDK Cast extension needs a specific flavor of the `react-native-google-cast` package 
to link to. The Expo plugin will add this native dependency, which means auto-linking
to the default package [needs to be disabled in the `react-native.config.js` file](./react-native.config.js) .
