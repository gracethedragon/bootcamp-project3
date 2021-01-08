import { resolve } from 'path';
import db from './models/index.mjs';
import initItemsController from './controllers/items.mjs';

export default function bindRoutes(app) {
  const ItemsController = initItemsController(db);

  app.get('/items', ItemsController.index);

  // special JS page. Include the webpack index.html file
  app.get('/home', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
