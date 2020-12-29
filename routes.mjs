import db from './models/index.mjs';
import {resolve} from 'path';

export default function routes( app ){

  // special JS page. Include the webpack index.html file
  app.get('/home', (request,response) => {
    response.sendFile(resolve('js/dist', 'index.html'))
  });
}
