const { withPlugins, withGradleProperties } = require('@expo/config-plugins');

/**
 * https://github.com/react-native-google-cast/react-native-google-cast/issues/551
 */
function withExpo52CastFixAndroid(config) {
    return withGradleProperties(config, config => {

        /**
         * react-native-google-cast still needs to enable Jetifier to resolve this duplicate namespace issue:
         *
         *  Namespace 'android.support.graphics.drawable' is used in multiple modules and/or libraries:
         *  com.android.support:animated-vector-drawable:28.0.0, com.android.support:support-vector-drawable:28.0.0.
         */
        const enableJetifier = config.modResults.find(prop => prop.key === 'android.enableJetifier');
        if (enableJetifier) {
            enableJetifier.value = 'true';
        } else {
            config.modResults.push({ type: 'property', key: 'android.enableJetifier', value: 'true' });
        }

        /**
         * Increase maximum heap size of the JVM.
         */
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
