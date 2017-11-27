const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      __DARWIN__: process.platform === 'darwin',
      __WIN32__: process.platform === 'win32',
      __LINUX__: process.platform === 'linux',
      __DEV__: process.env.ELECTRON_WEBPACK_APP_MODE === 'development',
    }),
  ],
  devtool: process.env.ELECTRON_WEBPACK_APP_MODE === 'development' ? 'inline-source-map' : false,
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },
}
