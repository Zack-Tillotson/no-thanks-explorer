import Game from './game';
import Reporter from './reporter';
import uuid from 'uuid';
import 'array.prototype.find';

const 
  ERROR_THRESHOLD = 50,
  MAX_PLAYERS = 5,
  MIN_PLAYERS = 2;

const PredictionEngineErrorMessage = 
  'PredictionEngine requires getPredictor, updateState, and getStateDescription functions';

function getCompetitorPredictors(PredictionEngine, config, state) {
  const numPlayers = Math.random() * (config.max_players - config.min_players) + config.min_players;
  const players = [];
  for(let i = 1 ; i <  numPlayers; i++) {
    players.push(wrapPredictorWithId(PredictionEngine.getCompetitorPredictor(state, i, numPlayers)));
  }
  return players;
}

function wrapPredictorWithId(predictor) {
  return {...predictor,__id__: uuid.v4()};
}

function runGame(testPredictor, competitorPredictors) {
  const players = [testPredictor, ...competitorPredictors];
  const result = Game.play(players);
  return result.list.find((player) => player.__id__ === testPredictor.__id__).score;
}

function verifyPredictionEngine(PredictionEngine) {
  if(typeof PredictionEngine !== 'object'
    || typeof PredictionEngine.getInitialState !== 'function'
    || typeof PredictionEngine.shouldStop !== 'function'
    || typeof PredictionEngine.getPredictor !== 'function'
    || typeof PredictionEngine.updateState !== 'function'
    || typeof PredictionEngine.getStateDescription !== 'function') {
    throw PredictionEngineErrorMessage;
  }
}

function verifyConfig(config) {
  config.error_threshold = config.error_threshold || ERROR_THRESHOLD;
  config.max_players = config.max_players || MAX_PLAYERS;
  config.min_players = config.min_players || MIN_PLAYERS;
}

function learn(PredictionEngine, config = {}) {
  verifyPredictionEngine(PredictionEngine);
  verifyConfig(config);

  let state = PredictionEngine.getInitialState();
  const results = {};

  while(!PredictionEngine.shouldStop(state)) {

    let sumScore = 0;
    const runsToSum = 300;
    for(let i = 0 ; i < runsToSum ; i++) {
      const result = runGame(
        wrapPredictorWithId(PredictionEngine.getPredictor(state)),
        getCompetitorPredictors(PredictionEngine, config, state),
        config
      );
      sumScore += result;
    }
    sumScore = parseInt(sumScore / runsToSum);
    results[PredictionEngine.getStateDescription(state)] = sumScore;

    console.log('%');

    state = PredictionEngine.updateState(state, sumScore);

  }

  Reporter(results);

}

export default learn;