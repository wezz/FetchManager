const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const getPackageJson = require('./scripts/getPackageJson');
const CopyPlugin = require("copy-webpack-plugin");

const {
  version,
  name,
  license,
  repository,
  author,
} = getPackageJson('version', 'name', 'license', 'repository', 'author');

const banner = `
  ${name} v${version}
  ${repository.url}

  Copyright (c) ${author.replace(/ *\<[^)]*\> */g, " ")}

  This source code is licensed under the ${license} license found in the
  LICENSE file in the root directory of this source tree.
`;


module.exports = {
  mode: "production",
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    globalObject: 'typeof global !== \'undefined\' ? global : this',
    library: {
      name: 'fetchmanager',
      type: 'umd',
    },
  },
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin({
      extractComments: false
    })],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        use: ['url-loader'],
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "src"), to: path.resolve(__dirname, "build") }
      ],
    }),
    new webpack.BannerPlugin(banner),
  ],
  resolve: {
      extensions: [".tsx", ".ts", ".js"]
  }
};