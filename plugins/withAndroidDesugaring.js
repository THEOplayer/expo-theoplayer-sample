const { withAppBuildGradle } = require('expo/config-plugins');

const compileOptions = `    compileOptions {
        coreLibraryDesugaringEnabled true
    }
`;
const desugaringDependency = '    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.5")\n';

module.exports = (config) =>
  withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes('coreLibraryDesugaringEnabled true')) {
      if (!contents.includes('android {')) {
        throw new Error('Could not find the Android configuration block');
      }
      contents = contents.replace('android {\n', `android {\n${compileOptions}`);
    }

    if (!contents.includes('com.android.tools:desugar_jdk_libs')) {
      if (!contents.includes('dependencies {')) {
        throw new Error('Could not find the Android dependencies block');
      }
      contents = contents.replace('dependencies {\n', `dependencies {\n${desugaringDependency}`);
    }

    config.modResults.contents = contents;
    return config;
  });
