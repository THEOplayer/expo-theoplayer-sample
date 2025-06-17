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

### Enable Google Cast support

The latest `react-native-google-cast@4.8.3` package is not compatible with Expo 53, unfortunately. In order to use it
in an Expo project:

- A [patch](./patches/react-native-google-cast+4.8.3.patch) needs to be applied after installing the `react-native-google-cast` package. We use a patch based on [this PR](https://github.com/react-native-google-cast/react-native-google-cast/pull/566) to enabled support on Android. The example app uses patch-package to auto-apply it.
- An extra [Expo plugin](./plugins/expo/withExpo52CastFixAndroid.js) needs to be configured to enable Jetifier on Android. 

