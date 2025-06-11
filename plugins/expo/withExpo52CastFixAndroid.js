const { withPlugins, withGradleProperties } = require('@expo/config-plugins');

/**
 * https://github.com/react-native-google-cast/react-native-google-cast/issues/551
 */
function withExpo52CastFixAndroid(config) {
    return withGradleProperties(config, config => {
        const enableJetifier = config.modResults.find(prop => prop.key === 'android.enableJetifier');

        if (enableJetifier) {
            enableJetifier.value = 'true';
        } else {
            config.modResults.push({ type: 'property', key: 'android.enableJetifier', value: 'true' });
        }

        const jvmArgs = config.modResults.find(prop => prop.key === 'org.gradle.jvmargs');

        if (jvmArgs) {
            jvmArgs.value = jvmArgs.value.replace(/-Xmx\d+[gm]/, '-Xmx4g');
        } else {
            config.modResults.push({ type: 'property', key: 'org.gradle.jvmargs', value: '-Xmx4g' });
        }

        return config;
    });
}

module.exports = config => withPlugins(config, [withExpo52CastFixAndroid]);
