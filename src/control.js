import Game from './game';
import Reporter from './reporter';
import PredictionEngine from 'no-thanks-prediction-engine';

const 
  ERROR_THRESHOLD = 1,
  MAX_PLAYERS = 5,
  MIN_PLAYERS = 2;

function playGame(predictor) {
  const players = [];
  for(let i = 0 ; i < Math.random() * (MAX_PLAYERS - MIN_PLAYERS) + MIN_PLAYERS ; i++) {
    players.push(predictor);
  }
  const result = Game.play(players);
  return result[0].score;
}

function updateState(state, result) {
  return state;
}

function learningAlgorithm() {

  let state = PredictionEngine.getInitialState();
  let error = 999999999; // Big number to start with

  while(error > ERROR_THRESHOLD) {
    error = playGame(PredictionEngine.getPredictor(state));
    state = PredictionEngine.updateState(state, error);
    Reporter(state, PredictionEngine.getStateDescription(state), error);    
  }

}

export default learningAlgorithm;