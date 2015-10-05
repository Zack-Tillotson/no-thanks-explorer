var path = require('path');
var webpack = require('webpack');

var buildEnv = process.env.BUILD || 'dev';

module.exports = {
  entry: {
    run: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  resolve: {
    root: [
      __dirname
    ],
    extensions: ['', '.js']
  },
  node: {
    fs: "empty"
  },
  displayErrorDetails: true,
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel?stage=2', exclude: /node_modules/ },
    ]
  }
};
