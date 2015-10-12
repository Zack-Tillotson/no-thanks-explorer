export default {
  report(when, gameState, newGameState, legalActions = [], action) {
    console.log(JSON.stringify(gameState) + '\n\t' + legalActions.toString() + " => " + action + "\n" + JSON.stringify(newGameState) + "\n\n");
  }
}
