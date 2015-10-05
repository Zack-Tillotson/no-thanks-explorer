import Engine from 'no-thanks-engine';

export default {
  play(players) {
    return players.map((player) => {
      return {...player, score: Math.random() * 10}
    });
  }
}