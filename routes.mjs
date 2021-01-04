import db from './models/index.mjs';
import items from './controllers/items.mjs'
import {resolve} from 'path';

export default function routes( app ){

  const ItemsController = items(db);

  app.get('/items', ItemsController.index);

  // special JS page. Include the webpack index.html file
  app.get('/home', (request,response) => {
    response.sendFile(resolve('dist', 'main.html'))
  });
}
