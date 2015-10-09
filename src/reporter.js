export default {
  report(when, gameState, newGameState, legalActions, action) {
    console.log(legalActions.toString() + " => " + action + "\n" + JSON.stringify(newGameState) + "\n\n");
  }
}
