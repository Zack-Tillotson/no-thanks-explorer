(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["NoThanksLearner"] = factory();
	else
		root["NoThanksLearner"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _runner = __webpack_require__(1);

	var _runner2 = _interopRequireDefault(_runner);

	exports['default'] = _runner2['default'];
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _reporter = __webpack_require__(2);

	var _verify = __webpack_require__(3);

	var _noThanksEngine = __webpack_require__(4);

	var _noThanksEngine2 = _interopRequireDefault(_noThanksEngine);

	exports['default'] = {
	  play: function play(players, config) {

	    players = (0, _verify.verifyPlayers)(players);
	    config = (0, _verify.verifyConfig)(config);

	    players.forEach(function (player, index) {
	      player.id = player.id || 'Player ' + (index + 1);
	      player.stats = { take: 0, noThanks: 0, forcedTake: 0 };
	    });

	    var gameState = _noThanksEngine2['default'].getInitialState(players);
	    while (gameState.game.ongoing) {

	      var currentPlayer = gameState.players.list[gameState.players.currentPlayer];
	      var actions = _noThanksEngine2['default'].getLegalActions(gameState);
	      var predictions = currentPlayer.predict(gameState, actions);

	      var choice = predictions[0];
	      var action = choice.action;

	      currentPlayer.stats[action]++;
	      if (action === 'take' && actions.length === 1) {
	        currentPlayer.stats['forcedTake']++;
	      }

	      var newGameState = _noThanksEngine2['default'].resolveAction(gameState, action);

	      if (currentPlayer.update) {
	        currentPlayer.update(predictions, action, gameState, newGameState);
	      }

	      if (config.reportEveryTurn) {
	        (0, _reporter.turnReport)(gameState, newGameState, predictions, action);
	      }

	      gameState = newGameState;
	    }

	    if (config.reportAfter) {
	      (0, _reporter.gameReport)(gameState);
	    }

	    return gameState;
	  }

	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	function printGameState(gameState) {
	  var showWinner = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	  console.log(gameState.game.ongoing ? '' : 'Game Over');

	  if (gameState.game.ongoing) {
	    console.log('$' + gameState.table.pot + ' ' + JSON.stringify(gameState.deck));
	  }

	  var highscore = gameState.players.list.reduce(function (best, player) {
	    return player.score < best ? player.score : best;
	  }, 9999);

	  gameState.players.list.forEach(function (player, index) {

	    var winnerMarker = '   ';
	    if (showWinner && player.score == highscore) {
	      winnerMarker = 'won';
	    }

	    var currentPlayerMarker = gameState.players.currentPlayer === index ? '*' : ' ';
	    console.log(winnerMarker + ' ' + currentPlayerMarker + ' ' + player.id + ' ' + ':' + ' ' + 'Score ' + player.score + ' ' + '$' + player.money + ' ' + JSON.stringify(player.cards) + ' ' + JSON.stringify(player.stats));
	  });
	}

	exports['default'] = {

	  turnReport: function turnReport(gameState, newGameState, actionOptions, action) {
	    if (actionOptions === undefined) actionOptions = [];

	    console.log("Turn ===============");
	    printGameState(gameState);
	    console.log('\n\tActions: ' + actionOptions.map(function (option) {
	      return option.action;
	    }).toString() + " => " + action);
	    printGameState(newGameState);
	    console.log('\n');
	  },

	  gameReport: function gameReport(gameState) {
	    console.log("============== Summary ===============");
	    printGameState(gameState, true);
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var functionNames = [];

	function verifyFunction(results, obj, name) {
	  if (typeof obj[name] !== 'function') {
	    results.push(name);
	  }
	}

	function verifyPlayer(player) {

	  if (typeof player !== 'object') {
	    throw { message: 'player should be an object', player: player };
	    return false;
	  }

	  var missingFunctions = [];
	  functionNames.forEach(function (name) {
	    verifyFunction(missingFunctions, PredictionEngine, name);
	  });

	  if (missingFunctions.length > 0) {
	    throw {
	      message: 'PredictionEngine must define these functions: ' + missingFunctions.join(', '),
	      player: player
	    };
	    return false;
	  }

	  return true;
	}

	exports['default'] = {
	  verifyPlayers: function verifyPlayers() {
	    var players = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	    players.forEach(function (player) {
	      return verifyPlayer(player);
	    });
	    return players;
	  },
	  verifyConfig: function verifyConfig() {
	    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    return config;
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Engine = __webpack_require__(5);
	module.exports = Engine;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["NoThanksEngine"] = factory();
		else
			root["NoThanksEngine"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	var parentHotUpdateCallback = this["webpackHotUpdateNoThanksEngine"];
	/******/ 	this["webpackHotUpdateNoThanksEngine"] = 
	/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
	/******/ 		hotAddUpdateChunk(chunkId, moreModules);
	/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
	/******/ 	}
	/******/ 	
	/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
	/******/ 		var head = document.getElementsByTagName("head")[0];
	/******/ 		var script = document.createElement("script");
	/******/ 		script.type = "text/javascript";
	/******/ 		script.charset = "utf-8";
	/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
	/******/ 		head.appendChild(script);
	/******/ 	}
	/******/ 	
	/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
	/******/ 		if(typeof XMLHttpRequest === "undefined")
	/******/ 			return callback(new Error("No browser support"));
	/******/ 		try {
	/******/ 			var request = new XMLHttpRequest();
	/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
	/******/ 			request.open("GET", requestPath, true);
	/******/ 			request.timeout = 10000;
	/******/ 			request.send(null);
	/******/ 		} catch(err) {
	/******/ 			return callback(err);
	/******/ 		}
	/******/ 		request.onreadystatechange = function() {
	/******/ 			if(request.readyState !== 4) return;
	/******/ 			if(request.status === 0) {
	/******/ 				// timeout
	/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
	/******/ 			} else if(request.status === 404) {
	/******/ 				// no update available
	/******/ 				callback();
	/******/ 			} else if(request.status !== 200 && request.status !== 304) {
	/******/ 				// other failure
	/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
	/******/ 			} else {
	/******/ 				// success
	/******/ 				try {
	/******/ 					var update = JSON.parse(request.responseText);
	/******/ 				} catch(e) {
	/******/ 					callback(e);
	/******/ 					return;
	/******/ 				}
	/******/ 				callback(null, update);
	/******/ 			}
	/******/ 		};
	/******/ 	}

	/******/ 	
	/******/ 	
	/******/ 	var hotApplyOnUpdate = true;
	/******/ 	var hotCurrentHash = "4857bd954af4588c32ed"; // eslint-disable-line no-unused-vars
	/******/ 	var hotCurrentModuleData = {};
	/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
	/******/ 	
	/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
	/******/ 		var me = installedModules[moduleId];
	/******/ 		if(!me) return __webpack_require__;
	/******/ 		var fn = function(request) {
	/******/ 			if(me.hot.active) {
	/******/ 				if(installedModules[request]) {
	/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
	/******/ 						installedModules[request].parents.push(moduleId);
	/******/ 					if(me.children.indexOf(request) < 0)
	/******/ 						me.children.push(request);
	/******/ 				} else hotCurrentParents = [moduleId];
	/******/ 			} else {
	/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
	/******/ 				hotCurrentParents = [];
	/******/ 			}
	/******/ 			return __webpack_require__(request);
	/******/ 		};
	/******/ 		for(var name in __webpack_require__) {
	/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
	/******/ 				fn[name] = __webpack_require__[name];
	/******/ 			}
	/******/ 		}
	/******/ 		fn.e = function(chunkId, callback) {
	/******/ 			if(hotStatus === "ready")
	/******/ 				hotSetStatus("prepare");
	/******/ 			hotChunksLoading++;
	/******/ 			__webpack_require__.e(chunkId, function() {
	/******/ 				try {
	/******/ 					callback.call(null, fn);
	/******/ 				} finally {
	/******/ 					finishChunkLoading();
	/******/ 				}
	/******/ 	
	/******/ 				function finishChunkLoading() {
	/******/ 					hotChunksLoading--;
	/******/ 					if(hotStatus === "prepare") {
	/******/ 						if(!hotWaitingFilesMap[chunkId]) {
	/******/ 							hotEnsureUpdateChunk(chunkId);
	/******/ 						}
	/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
	/******/ 							hotUpdateDownloaded();
	/******/ 						}
	/******/ 					}
	/******/ 				}
	/******/ 			});
	/******/ 		};
	/******/ 		return fn;
	/******/ 	}
	/******/ 	
	/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
	/******/ 		var hot = {
	/******/ 			// private stuff
	/******/ 			_acceptedDependencies: {},
	/******/ 			_declinedDependencies: {},
	/******/ 			_selfAccepted: false,
	/******/ 			_selfDeclined: false,
	/******/ 			_disposeHandlers: [],
	/******/ 	
	/******/ 			// Module API
	/******/ 			active: true,
	/******/ 			accept: function(dep, callback) {
	/******/ 				if(typeof dep === "undefined")
	/******/ 					hot._selfAccepted = true;
	/******/ 				else if(typeof dep === "function")
	/******/ 					hot._selfAccepted = dep;
	/******/ 				else if(typeof dep === "object")
	/******/ 					for(var i = 0; i < dep.length; i++)
	/******/ 						hot._acceptedDependencies[dep[i]] = callback;
	/******/ 				else
	/******/ 					hot._acceptedDependencies[dep] = callback;
	/******/ 			},
	/******/ 			decline: function(dep) {
	/******/ 				if(typeof dep === "undefined")
	/******/ 					hot._selfDeclined = true;
	/******/ 				else if(typeof dep === "number")
	/******/ 					hot._declinedDependencies[dep] = true;
	/******/ 				else
	/******/ 					for(var i = 0; i < dep.length; i++)
	/******/ 						hot._declinedDependencies[dep[i]] = true;
	/******/ 			},
	/******/ 			dispose: function(callback) {
	/******/ 				hot._disposeHandlers.push(callback);
	/******/ 			},
	/******/ 			addDisposeHandler: function(callback) {
	/******/ 				hot._disposeHandlers.push(callback);
	/******/ 			},
	/******/ 			removeDisposeHandler: function(callback) {
	/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
	/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
	/******/ 			},
	/******/ 	
	/******/ 			// Management API
	/******/ 			check: hotCheck,
	/******/ 			apply: hotApply,
	/******/ 			status: function(l) {
	/******/ 				if(!l) return hotStatus;
	/******/ 				hotStatusHandlers.push(l);
	/******/ 			},
	/******/ 			addStatusHandler: function(l) {
	/******/ 				hotStatusHandlers.push(l);
	/******/ 			},
	/******/ 			removeStatusHandler: function(l) {
	/******/ 				var idx = hotStatusHandlers.indexOf(l);
	/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
	/******/ 			},
	/******/ 	
	/******/ 			//inherit from previous dispose call
	/******/ 			data: hotCurrentModuleData[moduleId]
	/******/ 		};
	/******/ 		return hot;
	/******/ 	}
	/******/ 	
	/******/ 	var hotStatusHandlers = [];
	/******/ 	var hotStatus = "idle";
	/******/ 	
	/******/ 	function hotSetStatus(newStatus) {
	/******/ 		hotStatus = newStatus;
	/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
	/******/ 			hotStatusHandlers[i].call(null, newStatus);
	/******/ 	}
	/******/ 	
	/******/ 	// while downloading
	/******/ 	var hotWaitingFiles = 0;
	/******/ 	var hotChunksLoading = 0;
	/******/ 	var hotWaitingFilesMap = {};
	/******/ 	var hotRequestedFilesMap = {};
	/******/ 	var hotAvailibleFilesMap = {};
	/******/ 	var hotCallback;
	/******/ 	
	/******/ 	// The update info
	/******/ 	var hotUpdate, hotUpdateNewHash;
	/******/ 	
	/******/ 	function toModuleId(id) {
	/******/ 		var isNumber = (+id) + "" === id;
	/******/ 		return isNumber ? +id : id;
	/******/ 	}
	/******/ 	
	/******/ 	function hotCheck(apply, callback) {
	/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
	/******/ 		if(typeof apply === "function") {
	/******/ 			hotApplyOnUpdate = false;
	/******/ 			callback = apply;
	/******/ 		} else {
	/******/ 			hotApplyOnUpdate = apply;
	/******/ 			callback = callback || function(err) {
	/******/ 				if(err) throw err;
	/******/ 			};
	/******/ 		}
	/******/ 		hotSetStatus("check");
	/******/ 		hotDownloadManifest(function(err, update) {
	/******/ 			if(err) return callback(err);
	/******/ 			if(!update) {
	/******/ 				hotSetStatus("idle");
	/******/ 				callback(null, null);
	/******/ 				return;
	/******/ 			}
	/******/ 	
	/******/ 			hotRequestedFilesMap = {};
	/******/ 			hotAvailibleFilesMap = {};
	/******/ 			hotWaitingFilesMap = {};
	/******/ 			for(var i = 0; i < update.c.length; i++)
	/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
	/******/ 			hotUpdateNewHash = update.h;
	/******/ 	
	/******/ 			hotSetStatus("prepare");
	/******/ 			hotCallback = callback;
	/******/ 			hotUpdate = {};
	/******/ 			var chunkId = 0;
	/******/ 			{ // eslint-disable-line no-lone-blocks
	/******/ 				/*globals chunkId */
	/******/ 				hotEnsureUpdateChunk(chunkId);
	/******/ 			}
	/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
	/******/ 				hotUpdateDownloaded();
	/******/ 			}
	/******/ 		});
	/******/ 	}
	/******/ 	
	/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
	/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
	/******/ 			return;
	/******/ 		hotRequestedFilesMap[chunkId] = false;
	/******/ 		for(var moduleId in moreModules) {
	/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
	/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
	/******/ 			}
	/******/ 		}
	/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
	/******/ 			hotUpdateDownloaded();
	/******/ 		}
	/******/ 	}
	/******/ 	
	/******/ 	function hotEnsureUpdateChunk(chunkId) {
	/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
	/******/ 			hotWaitingFilesMap[chunkId] = true;
	/******/ 		} else {
	/******/ 			hotRequestedFilesMap[chunkId] = true;
	/******/ 			hotWaitingFiles++;
	/******/ 			hotDownloadUpdateChunk(chunkId);
	/******/ 		}
	/******/ 	}
	/******/ 	
	/******/ 	function hotUpdateDownloaded() {
	/******/ 		hotSetStatus("ready");
	/******/ 		var callback = hotCallback;
	/******/ 		hotCallback = null;
	/******/ 		if(!callback) return;
	/******/ 		if(hotApplyOnUpdate) {
	/******/ 			hotApply(hotApplyOnUpdate, callback);
	/******/ 		} else {
	/******/ 			var outdatedModules = [];
	/******/ 			for(var id in hotUpdate) {
	/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
	/******/ 					outdatedModules.push(toModuleId(id));
	/******/ 				}
	/******/ 			}
	/******/ 			callback(null, outdatedModules);
	/******/ 		}
	/******/ 	}
	/******/ 	
	/******/ 	function hotApply(options, callback) {
	/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
	/******/ 		if(typeof options === "function") {
	/******/ 			callback = options;
	/******/ 			options = {};
	/******/ 		} else if(options && typeof options === "object") {
	/******/ 			callback = callback || function(err) {
	/******/ 				if(err) throw err;
	/******/ 			};
	/******/ 		} else {
	/******/ 			options = {};
	/******/ 			callback = callback || function(err) {
	/******/ 				if(err) throw err;
	/******/ 			};
	/******/ 		}
	/******/ 	
	/******/ 		function getAffectedStuff(module) {
	/******/ 			var outdatedModules = [module];
	/******/ 			var outdatedDependencies = {};
	/******/ 	
	/******/ 			var queue = outdatedModules.slice();
	/******/ 			while(queue.length > 0) {
	/******/ 				var moduleId = queue.pop();
	/******/ 				var module = installedModules[moduleId];
	/******/ 				if(!module || module.hot._selfAccepted)
	/******/ 					continue;
	/******/ 				if(module.hot._selfDeclined) {
	/******/ 					return new Error("Aborted because of self decline: " + moduleId);
	/******/ 				}
	/******/ 				if(moduleId === 0) {
	/******/ 					return;
	/******/ 				}
	/******/ 				for(var i = 0; i < module.parents.length; i++) {
	/******/ 					var parentId = module.parents[i];
	/******/ 					var parent = installedModules[parentId];
	/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
	/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
	/******/ 					}
	/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
	/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
	/******/ 						if(!outdatedDependencies[parentId])
	/******/ 							outdatedDependencies[parentId] = [];
	/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
	/******/ 						continue;
	/******/ 					}
	/******/ 					delete outdatedDependencies[parentId];
	/******/ 					outdatedModules.push(parentId);
	/******/ 					queue.push(parentId);
	/******/ 				}
	/******/ 			}
	/******/ 	
	/******/ 			return [outdatedModules, outdatedDependencies];
	/******/ 		}
	/******/ 	
	/******/ 		function addAllToSet(a, b) {
	/******/ 			for(var i = 0; i < b.length; i++) {
	/******/ 				var item = b[i];
	/******/ 				if(a.indexOf(item) < 0)
	/******/ 					a.push(item);
	/******/ 			}
	/******/ 		}
	/******/ 	
	/******/ 		// at begin all updates modules are outdated
	/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
	/******/ 		var outdatedDependencies = {};
	/******/ 		var outdatedModules = [];
	/******/ 		var appliedUpdate = {};
	/******/ 		for(var id in hotUpdate) {
	/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
	/******/ 				var moduleId = toModuleId(id);
	/******/ 				var result = getAffectedStuff(moduleId);
	/******/ 				if(!result) {
	/******/ 					if(options.ignoreUnaccepted)
	/******/ 						continue;
	/******/ 					hotSetStatus("abort");
	/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
	/******/ 				}
	/******/ 				if(result instanceof Error) {
	/******/ 					hotSetStatus("abort");
	/******/ 					return callback(result);
	/******/ 				}
	/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
	/******/ 				addAllToSet(outdatedModules, result[0]);
	/******/ 				for(var moduleId in result[1]) {
	/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
	/******/ 						if(!outdatedDependencies[moduleId])
	/******/ 							outdatedDependencies[moduleId] = [];
	/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
	/******/ 					}
	/******/ 				}
	/******/ 			}
	/******/ 		}
	/******/ 	
	/******/ 		// Store self accepted outdated modules to require them later by the module system
	/******/ 		var outdatedSelfAcceptedModules = [];
	/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
	/******/ 			var moduleId = outdatedModules[i];
	/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
	/******/ 				outdatedSelfAcceptedModules.push({
	/******/ 					module: moduleId,
	/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
	/******/ 				});
	/******/ 		}
	/******/ 	
	/******/ 		// Now in "dispose" phase
	/******/ 		hotSetStatus("dispose");
	/******/ 		var queue = outdatedModules.slice();
	/******/ 		while(queue.length > 0) {
	/******/ 			var moduleId = queue.pop();
	/******/ 			var module = installedModules[moduleId];
	/******/ 			if(!module) continue;
	/******/ 	
	/******/ 			var data = {};
	/******/ 	
	/******/ 			// Call dispose handlers
	/******/ 			var disposeHandlers = module.hot._disposeHandlers;
	/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
	/******/ 				var cb = disposeHandlers[j];
	/******/ 				cb(data);
	/******/ 			}
	/******/ 			hotCurrentModuleData[moduleId] = data;
	/******/ 	
	/******/ 			// disable module (this disables requires from this module)
	/******/ 			module.hot.active = false;
	/******/ 	
	/******/ 			// remove module from cache
	/******/ 			delete installedModules[moduleId];
	/******/ 	
	/******/ 			// remove "parents" references from all children
	/******/ 			for(var j = 0; j < module.children.length; j++) {
	/******/ 				var child = installedModules[module.children[j]];
	/******/ 				if(!child) continue;
	/******/ 				var idx = child.parents.indexOf(moduleId);
	/******/ 				if(idx >= 0) {
	/******/ 					child.parents.splice(idx, 1);
	/******/ 				}
	/******/ 			}
	/******/ 		}
	/******/ 	
	/******/ 		// remove outdated dependency from module children
	/******/ 		for(var moduleId in outdatedDependencies) {
	/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
	/******/ 				var module = installedModules[moduleId];
	/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
	/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
	/******/ 					var dependency = moduleOutdatedDependencies[j];
	/******/ 					var idx = module.children.indexOf(dependency);
	/******/ 					if(idx >= 0) module.children.splice(idx, 1);
	/******/ 				}
	/******/ 			}
	/******/ 		}
	/******/ 	
	/******/ 		// Not in "apply" phase
	/******/ 		hotSetStatus("apply");
	/******/ 	
	/******/ 		hotCurrentHash = hotUpdateNewHash;
	/******/ 	
	/******/ 		// insert new code
	/******/ 		for(var moduleId in appliedUpdate) {
	/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
	/******/ 				modules[moduleId] = appliedUpdate[moduleId];
	/******/ 			}
	/******/ 		}
	/******/ 	
	/******/ 		// call accept handlers
	/******/ 		var error = null;
	/******/ 		for(var moduleId in outdatedDependencies) {
	/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
	/******/ 				var module = installedModules[moduleId];
	/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
	/******/ 				var callbacks = [];
	/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
	/******/ 					var dependency = moduleOutdatedDependencies[i];
	/******/ 					var cb = module.hot._acceptedDependencies[dependency];
	/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
	/******/ 					callbacks.push(cb);
	/******/ 				}
	/******/ 				for(var i = 0; i < callbacks.length; i++) {
	/******/ 					var cb = callbacks[i];
	/******/ 					try {
	/******/ 						cb(outdatedDependencies);
	/******/ 					} catch(err) {
	/******/ 						if(!error)
	/******/ 							error = err;
	/******/ 					}
	/******/ 				}
	/******/ 			}
	/******/ 		}
	/******/ 	
	/******/ 		// Load self accepted modules
	/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
	/******/ 			var item = outdatedSelfAcceptedModules[i];
	/******/ 			var moduleId = item.module;
	/******/ 			hotCurrentParents = [moduleId];
	/******/ 			try {
	/******/ 				__webpack_require__(moduleId);
	/******/ 			} catch(err) {
	/******/ 				if(typeof item.errorHandler === "function") {
	/******/ 					try {
	/******/ 						item.errorHandler(err);
	/******/ 					} catch(err) {
	/******/ 						if(!error)
	/******/ 							error = err;
	/******/ 					}
	/******/ 				} else if(!error)
	/******/ 					error = err;
	/******/ 			}
	/******/ 		}
	/******/ 	
	/******/ 		// handle errors in accept handlers and self accepted module load
	/******/ 		if(error) {
	/******/ 			hotSetStatus("fail");
	/******/ 			return callback(error);
	/******/ 		}
	/******/ 	
	/******/ 		hotSetStatus("idle");
	/******/ 		callback(null, outdatedModules);
	/******/ 	}

	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false,
	/******/ 			hot: hotCreateModule(moduleId),
	/******/ 			parents: hotCurrentParents,
	/******/ 			children: []
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// __webpack_hash__
	/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

	/******/ 	// Load entry module and return exports
	/******/ 	return hotCreateRequire(0)(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		Object.defineProperty(exports, '__esModule', {
		  value: true
		});

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

		var _engine = __webpack_require__(1);

		var _engine2 = _interopRequireDefault(_engine);

		exports['default'] = _engine2['default'];
		module.exports = exports['default'];

	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

		// Engine
		// Should implement pure functions: getInitialState, getActionOptions
		'use strict';

		Object.defineProperty(exports, '__esModule', {
		  value: true
		});

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

		var _deck = __webpack_require__(2);

		var _deck2 = _interopRequireDefault(_deck);

		var _players = __webpack_require__(3);

		var _players2 = _interopRequireDefault(_players);

		var _table = __webpack_require__(4);

		var _table2 = _interopRequireDefault(_table);

		var Actions = {
		  NoThanks: 'noThanks',
		  Take: 'take'
		};

		function getInitialState(playerList) {

		  var deck = _deck2['default'].resetDeck();
		  var players = _players2['default'].resetPlayers(playerList);
		  var table = _table2['default'].resetTable();
		  var game = getGameState(deck);

		  return { deck: deck, players: players, table: table, game: game };
		}

		function getGameState(deck) {
		  return {
		    ongoing: deck.length > 0
		  };
		}

		function getLegalActions(state) {
		  var ret = [Actions.Take];
		  if (state.players.list[state.players.currentPlayer].money > 0) {
		    ret.push(Actions.NoThanks);
		  }
		  return ret;
		}

		function resolveAction(state, action) {

		  var card = state.deck[0];
		  var pot = state.table.pot;

		  var players = action === Actions.NoThanks ? _players2['default'].noThanksCard(state.players) : _players2['default'].takeCard(state.players, card, pot);

		  var deck = action === Actions.NoThanks ? state.deck : _deck2['default'].drawCard(state.deck);

		  var table = action === Actions.NoThanks ? _table2['default'].bumpPot(state.table) : _table2['default'].takePot(state.table);

		  var game = getGameState(deck);

		  return { deck: deck, players: players, table: table, game: game };
		}

		var Engine = { getLegalActions: getLegalActions, resolveAction: resolveAction };

		exports['default'] = {
		  getInitialState: getInitialState,
		  getLegalActions: getLegalActions,
		  resolveAction: resolveAction,
		  __debug__: { Engine: Engine, Deck: _deck2['default'], Players: _players2['default'], Table: _table2['default'] }
		};
		module.exports = exports['default'];

	/***/ },
	/* 2 */
	/***/ function(module, exports) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		var MIN_CARD_VALUE = 3;
		var MAX_CARD_VALUE = 35;
		var NUMBER_OF_CARDS_LEFT_OUT = 9;

		function buildDeck() {
		  var ret = [];
		  for (var i = MIN_CARD_VALUE; i <= MAX_CARD_VALUE; i++) {
		    ret.push(i);
		  }
		  return ret.sort(function () {
		    return Math.random() > .5;
		  }).slice(NUMBER_OF_CARDS_LEFT_OUT);
		}

		exports["default"] = {
		  resetDeck: function resetDeck() {
		    var deck = buildDeck();
		    return deck;
		  },
		  drawCard: function drawCard(deck) {
		    deck = deck.slice(0);
		    if (deck.length > 0) {
		      deck.shift();
		    }
		    return deck;
		  }
		};
		module.exports = exports["default"];

	/***/ },
	/* 3 */
	/***/ function(module, exports) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var STARTING_PLAYER_MONEY = 11;

		function resetPlayerList(playerList) {
		  return playerList.map(function (player) {
		    var money = STARTING_PLAYER_MONEY;
		    var cards = [];
		    var score = getCardValue(cards) - money;
		    return _extends({}, player, { money: money, cards: cards, score: score });
		  }).sort(function (a, b) {
		    return Math.random() > .5;
		  });
		}

		function decrementMoney(player) {
		  var money = player.money - 1;
		  var score = getCardValue(player.cards) - money;
		  return _extends({}, player, { money: money, score: score });
		}

		function getCardValue(cards) {
		  return cards.slice(0).sort(function (a, b) {
		    return b - a;
		  }).reduce(function (sum, card, index) {
		    return index !== 0 && cards[index] === cards[index - 1] + 1 ? sum : sum + card;
		  }, 0);
		}

		function addCard(player, card, pot) {
		  var cards = player.cards.slice(0);
		  cards.push(card);

		  var money = player.money + pot;
		  var score = getCardValue(cards) - money;

		  return _extends({}, player, { cards: cards, money: money, score: score });
		}

		exports["default"] = {
		  resetPlayers: function resetPlayers(playerList) {
		    return {
		      currentPlayer: parseInt(Math.random() * playerList.length),
		      list: resetPlayerList(playerList)
		    };
		  },
		  noThanksCard: function noThanksCard(players) {

		    var list = players.list.slice(0);
		    var currentPlayer = list[players.currentPlayer];

		    var updatedPlayer = decrementMoney(currentPlayer);
		    list[players.currentPlayer] = updatedPlayer;

		    return {
		      currentPlayer: (players.currentPlayer + 1) % list.length,
		      list: list
		    };
		  },

		  takeCard: function takeCard(players, card, pot) {
		    var list = players.list.slice(0);
		    var currentPlayer = list[players.currentPlayer];

		    var updatedPlayer = addCard(currentPlayer, card, pot);
		    list[players.currentPlayer] = updatedPlayer;

		    return {
		      currentPlayer: players.currentPlayer,
		      list: list
		    };
		  },
		  __debug__: {
		    getCardValue: getCardValue
		  }
		};
		module.exports = exports["default"];

	/***/ },
	/* 4 */
	/***/ function(module, exports) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		exports["default"] = {
		  resetTable: function resetTable() {
		    return { pot: 0 };
		  },
		  takePot: function takePot(state) {
		    return _extends({}, state, { pot: 0 });
		  },
		  bumpPot: function bumpPot(state) {
		    return _extends({}, state, { pot: state.pot + 1 });
		  }
		};
		module.exports = exports["default"];

	/***/ }
	/******/ ])
	});
	;

/***/ }
/******/ ])
});
;