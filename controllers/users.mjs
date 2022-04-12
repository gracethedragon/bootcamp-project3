export default function initUsersController(db) {
  const create = async (req, res) => {
    try {
      const user = await db.User.create({ name: req.body.name, password: req.body.password });

      res.redirect('/login');
    } catch (error) {
      console.log('error', error);
    }
  };

  const login = async (req, res) => {
    try {
      console.log(req.body);
      const user = await db.User.findOne({
        where:
        { name: req.body.name, password: req.body.password },
      });
      if (user === null) {
        res.redirect('/signup');
      } else {
        res.cookie('loggedIn', true);
        res.cookie('user', user.name);
        res.redirect('/');
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const users = async (req, res) => {
    try {
      // const playerOne = await db.User.create({ name: req.body.playerOne });
      // const playerTwo = await db.User.create({ name: req.body.playerTwo });
      const user = await db.User.findOne({ where: { name: req.cookies.user } });

      const game = await db.Game.create({
        turn: {
          turn: req.body.playerOne,

        },
        gamestate: {
          game: [7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 0],
          playerOne: req.body.playerOne,
          playerTwo: req.body.playerTwo,
          // game: [1, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 79],
        },
      });

      await db.Gamesuser.create({
        gameId: game.id,
        playerOne: req.body.playerOne,
        playerTwo: req.body.playerTwo,
        registeredUserId: user.id,
      });

      res.cookie('playerOneName', req.body.playerOne);
      res.cookie('playerTwoName', req.body.playerTwo);
      res.cookie('game', game.id);
      res.send({
        playerOneName: req.body.playerOne,
        playerTwoName: req.body.playerTwo,
        game: game.id,
        gamestate: game.gamestate,
        turn: game.turn,
      });
    }
    catch (error) {
      console.log('error', error);
    }
  };

  return {
    create,
    users,
    login,
  };
}
