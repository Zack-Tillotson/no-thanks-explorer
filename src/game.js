import Engine from 'no-thanks-engine';

export default {
  play(players) {

    const playerMap = {};
    players.forEach((player) => {
      playerMap[player.__id__] = player;
    });

    const playerIds = players.map(({__id__}) => {
      return {__id__};
    });

    let gameState = Engine.getInitialState(players);
    while(gameState.game.ongoing) {
      const currentPlayerId = gameState.players.list[gameState.players.currentPlayer].__id__;
      const legalActions = Engine.getLegalActions(gameState);
      const action = playerMap[currentPlayerId].predict(gameState, legalActions);
      gameState = Engine.resolveAction(gameState, action);
    }

    return gameState.players;
  }
}