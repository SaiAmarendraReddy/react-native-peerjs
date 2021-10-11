/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
 const {FileStore} = require("metro-cache");
 const os = require("os");
 const path = require("path")
module.exports = {
  cacheStores: [
    new FileStore({
      root: path.join(os.homedir(), "metro-cache")
    })
  ],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
