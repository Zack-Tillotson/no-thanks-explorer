import {turnReport, gameReport} from './reporter';
import {verifyPlayers, verifyConfig} from './verify';
import Engine from 'no-thanks-engine';

export default {
  play(players, config) {

    players = verifyPlayers(players);
    config = verifyConfig(config);

    players.forEach((player, index) => player.id = player.id || 'Player ' + (index + 1));

    let gameState = Engine.getInitialState(players);
    while(gameState.game.ongoing) {
      
      const currentPlayer = gameState.players.list[gameState.players.currentPlayer];
      const legalActions = Engine.getLegalActions(gameState);
      const predictions = currentPlayer.predict(gameState, legalActions);
      const action = predictions.sort((a,b) => a.value - b.value)[0].action;
      const newGameState = Engine.resolveAction(gameState, action);

      if(currentPlayer.update) {
        currentPlayer.update(predictions, action, gameState, newGameState);
      }

      if(config.reportEveryTurn) {
        turnReport(gameState, newGameState, legalActions, action);
      }

      gameState = newGameState;

    }

    if(config.reportAfter) {
      gameReport(gameState);
    }


    return gameState;

  } 

}