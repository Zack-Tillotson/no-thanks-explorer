import {turnReport, gameReport} from './reporter';
import {verifyPlayers, verifyConfig} from './verify';
import Engine from 'no-thanks-engine';

export default {
  play(players, config) {

    players = verifyPlayers(players);
    config = verifyConfig(config);

    players.forEach((player, index) => {
      player.id = player.id || 'Player ' + (index + 1);
      player.stats = {take: 0, noThanks: 0, forcedTake: 0};
    });

    let gameState = Engine.getInitialState(players);
    while(gameState.game.ongoing) {
      
      const currentPlayer = gameState.players.list[gameState.players.currentPlayer];
      const actions = Engine.getLegalActions(gameState);
      const predictions = currentPlayer.predict(gameState, actions);
      
      const choice = predictions[0];
      const action = choice.action;

      currentPlayer.stats[action]++;
      if(action === 'take' && actions.length === 1) {
        currentPlayer.stats['forcedTake']++;
      }
      
      const newGameState = Engine.resolveAction(gameState, action);

      if(currentPlayer.update) {
        currentPlayer.update(predictions, action, gameState, newGameState);
      }

      if(config.reportEveryTurn) {
        turnReport(gameState, newGameState, predictions, action);
      }

      gameState = newGameState;

    }

    if(config.reportAfter) {
      gameReport(gameState);
    }


    return gameState;

  } 

}