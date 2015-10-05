// Run all the tests all the time!

var Mocha = require('mocha');
var mocha = new Mocha();

var webpack = require("webpack");
var config = require('./webpack.config.js');
webpack(config).run(function(err, stats) {
  console.log("Recompiled");
  mocha.addFile('./dist/test.js');
  mocha.run();
});