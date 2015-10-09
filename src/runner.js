import {report} from './reporter';
import {verifyPlayers, verifyConfig} from './verify';
import Engine from 'no-thanks-engine';

export default {
  play(players, config) {

    players = verifyPlayers(players);
    config = verifyConfig(config);

    let gameState = Engine.getInitialState(players);
    while(gameState.game.ongoing) {
      
      const currentPlayer = gameState.players.list[gameState.players.currentPlayer];
      const legalActions = Engine.getLegalActions(gameState);
      const action = currentPlayer.predict(gameState, legalActions);
      const newGameState = Engine.resolveAction(gameState, action);

      if(config.reportEveryTurn) {
        report('turn', gameState, newGameState, legalActions, action);
      }

      gameState = newGameState;

    }

    if(config.reportAfter) {
      report('game', gameState, newGameState, currentPlayerId, legalActions, action);
    }


    return gameState;

  } 

}