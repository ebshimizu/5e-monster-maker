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
    module: {
      rules: [
        {
          test: /\.(ttf|otf|eot|woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        },
      ],
    },
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/5emm/' : '/',
};
