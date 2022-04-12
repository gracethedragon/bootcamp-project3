import { resolve } from 'path';
import db from './models/index.mjs';
import initItemsController from './controllers/items.mjs';
import initUsersController from './controllers/users.mjs';
import initGamesController from './controllers/games.mjs';

export default function bindRoutes(app) {
  const ItemsController = initItemsController(db);
  const UsersController = initUsersController(db);
  const GamesController = initGamesController(db);

  app.get('/items', ItemsController.index);

  // special JS page. Include the webpack index.html file
  app.get('/', (request, response) => {
    if (request.cookies.loggedIn !== 'true') {
      response.redirect('/login');
    } else {
      response.sendFile(resolve('dist', 'main.html'));
    }
  });
  app.get('/signup', (request, response) => {
    response.sendFile(resolve('src', 'signup.html'));
  });
  app.post('/signup', UsersController.create);
  // app.get('/login', (request, response) => {
  //   response.sendFile(resolve('src', 'login.html'));
  // });
  // app.post('/login', UsersController.login);
  app.get('/login', (request, response) => {
    response.sendFile(resolve('src', 'login.html'));
  });
  app.post('/login', UsersController.login);

  app.post('/home', UsersController.users);
  app.get('/home', (req, res) => res.send(req.cookies));
  app.get('/start/:id', GamesController.init);
  app.put('/gamedetails/:id/:data', GamesController.gamestate);
  app.put('/gamedetails/:id/:player/:announcement', GamesController.gamestate);
  app.put('/gameresults/:id/:winner/:winningMarbles/:loser/:losingMarbles', GamesController.gameOver);
}
