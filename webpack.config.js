const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

// THEOplayer's libraryLocation.
const libraryLocation = 'theoplayer';
const projectRoot = path.resolve(__dirname, '.');

const CopyWebpackPluginConfig = new CopyWebpackPlugin({
  patterns: [
    {
      // Copy transmuxer worker files.
      // THEOplayer will find them by setting `libraryLocation` in the playerConfiguration.
      from: path.resolve(projectRoot, './node_modules/theoplayer/THEOplayer.transmux.*').replace(/\\/g, '/'),
      to: `${libraryLocation}/[name][ext]`,
    }
  ],
});

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.plugins.push(CopyWebpackPluginConfig);

  // Customize the config before returning it.
  return config;
};
