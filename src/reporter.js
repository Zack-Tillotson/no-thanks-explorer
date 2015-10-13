function printGameState(gameState, showWinner = false) {
  console.log(gameState.game.ongoing ? '' : 'Game Over');

  if(gameState.game.ongoing) {
    console.log('$' + gameState.table.pot + ' ' + JSON.stringify(gameState.deck));
  }
  
  const highscore = gameState.players.list.reduce((best, player) => 
        player.score < best ? player.score : best
      , 9999);
  gameState.players.list.forEach((player, index) => {

    let winnerMarker = '   ';
    if(showWinner && player.score == highscore) {
      winnerMarker = 'won';
    }

    const currentPlayerMarker = gameState.players.currentPlayer === index ? '*' : ' ';
    console.log(winnerMarker + ' ' + currentPlayerMarker + ' ' + JSON.stringify(player));
  });
  
}

export default {

  turnReport(gameState, newGameState, actionOptions = [], action) {
    console.log("Turn ===============");
    printGameState(gameState);
    console.log('\n\tActions: ' + actionOptions.map((option) => option.action).toString() + " => " + action);
    printGameState(newGameState);
    console.log('\n');
  },

  gameReport(gameState) {
    console.log("============== Summary ===============");
    printGameState(gameState, true);
  }
}
