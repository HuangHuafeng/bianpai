const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      __DARWIN__: process.platform === 'darwin',
      __WIN32__: process.platform === 'win32',
      __LINUX__: process.platform === 'linux',
      __DEV__: process.env.NODE_ENV !== 'production',
    }),
  ],
  devtool: 'inline-source-map',
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },
}
