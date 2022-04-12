export default function initGamesController(db) {
  const root = (req, res) => {
    console.log('root');
    console.log(req.cookies);
    res.send(req.cookies);
  };
  const init = async (req, res) => {
    const currentGame = await db.Game.findByPk(req.params.id);
    const currentPlayers = await db.Gamesuser.findOne({
      where: {
        gameId: req.params.id,
      },
    });
    console.log(currentGame.gamestate, 'initgame');
    res.cookie('playerOneName', currentPlayers.playerOne);
    res.cookie('playerTwoName', currentPlayers.playerTwo);
    res.cookie('game', req.params.id);
    res.send({
      playerOneName: currentPlayers.playerOne,
      playerTwoName: currentPlayers.playerTwo,
      game: req.params.id,
      gamestate: currentGame.gamestate,
      turn: currentGame.turn,
    });
  };
  const gamestate = async (req, res) => {
    console.log(req.params, 'reqbody');
    try {
      const currentPlayers = await db.Gamesuser.findOne({ where: { gameId: req.params.id } });
      const currentGame = await db.Game.findByPk(req.params.id);
      console.log('current game', currentGame);
      if (req.params.player) {
        console.log(req.params.player, 'try');
        const updatedGame = await currentGame.update({
          turn: {
            turn: req.params.player,
            announcement: req.params.announcement,
          },
        });
        console.log('updated', updatedGame);
        res.send({
          gamestate: updatedGame,
        });
      } else {
        const updatedGame = await currentGame.update({
          gamestate: {
            game: req.params.data,
            playerOne: currentPlayers.playerOne,
            playerTwo: currentPlayers.playerTwo,
          },
        });
        console.log('updated', updatedGame);
        res.send({
          gamestate: updatedGame,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const turnstate = async (req, res) => {

  };
  const gameOver = async (req, res) => {
    console.log(req.params, 'reqbody');
    try {
      const currentGame = await db.Game.findByPk(req.params.id);
      // const players = await db.Gameusers.findOne({ where: { gameId: req.params.id } });

      console.log('current game', currentGame);

      const gameResult = await currentGame.update({
        gamestate: {
          winner: req.params.winner,
          winningMarbles: req.params.winningMarbles,
          loser: req.params.loser,
          losingMarbles: Number(req.params.losingMarbles),
        },
      });
      console.log('updated', gameResult);

      res.send({
        gamestate: gameResult,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    root,
    init,
    gamestate,
    turnstate,
    gameOver,
  };
}
