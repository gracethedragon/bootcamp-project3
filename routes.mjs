import { resolve } from 'path';
import db from './models/index.mjs';

export default function routes(app) {
  // special JS page. Include the webpack index.html file
  app.get('/home', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
