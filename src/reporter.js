export default {
  turnReport(gameState, newGameState, legalActions = [], action) {
    console.log(JSON.stringify(gameState) + '\n\t' + legalActions.toString() + " => " + action + "\n" + JSON.stringify(newGameState) + "\n\n");
  },
  gameReport(gameState, newGameState, legalActions = [], action) {
    console.log(JSON.stringify(gameState.players.list));
    console.log('Winner: ', gameState.players.list.reduce((best, player) => 
      best.score > player.score ? player : best)
    );
  }
}
