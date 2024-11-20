// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.server = {
    ...config.server,

    /**
     * THEOplayer needs to load its transmux libraries dynamically, so copy them from the npm package to the public
     * folder.
     */
    enhanceMiddleware: (middleware, server) => {
        const sourceFolder = path.resolve(__dirname, 'node_modules/theoplayer');
        const targetFolder = path.resolve(__dirname, 'public/theoplayer');

        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
        }
        fs.readdirSync(sourceFolder).forEach(file => {
            const sourcePath = path.join(sourceFolder, file);
            const targetPath = path.join(targetFolder, file);
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Copied ${file} to ${targetFolder}`);
        });
        return middleware;
    },
};

module.exports = config;
