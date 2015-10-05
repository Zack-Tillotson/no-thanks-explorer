var webpack = require("webpack");
var config = require('./webpack.config.js');
webpack(config).run(function(err, stats) {
  console.log("Compiled");
  require('./dist/run.js');
});