const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const buildJson = fs.readFileSync('./build.json');
const version = JSON.parse(packageJson).version || 0;
const buildNumber = JSON.parse(buildJson).build || 0;
const webpack = require('webpack');

module.exports = {
  transpileDependencies: ['vuetify'],
  pages: {
    index: {
      entry: 'src/main.js',
      title: '5e Monster Maker',
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: '"' + version + '"',
          BUILD_NUMBER: '"' + buildNumber + '"',
        },
      }),
    ],
  },
};
