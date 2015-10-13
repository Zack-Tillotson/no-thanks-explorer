var webpack = require("webpack");
var config = require('../webpack.config.js');
webpack(config).run(function(err, stats) {

  console.log("Compiled lib.js");
  var Simulator = require('../dist/lib.js');
  var player = require('./random.js');
  var players = [player(), player(), player()];
  
  Simulator.play(players, {
    reportEveryTurn: true,
    reportAfter: true
  });

});