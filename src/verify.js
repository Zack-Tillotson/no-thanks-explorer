const functionNames = [
];

function verifyFunction(results, obj, name) {
  if(typeof obj[name] !== 'function') {
    results.push(name);
  }
}

function verifyPlayer(player) {

  if(typeof player !== 'object') {
    throw {message: 'player should be an object', player};
    return false;
  }

  const missingFunctions = [];
  functionNames.forEach((name) => {
    verifyFunction(missingFunctions, PredictionEngine, name);
  });

  if(missingFunctions.length > 0) {
    throw {
      message: 'PredictionEngine must define these functions: ' + missingFunctions.join(', '),
      player
    };
    return false;
  }

  return true;
}

export default {
  verifyPlayers(players = []) {
    players.forEach((player) => verifyPlayer(player));
    return players;
  },
  verifyConfig(config = {}) {
    return config;
  }
}