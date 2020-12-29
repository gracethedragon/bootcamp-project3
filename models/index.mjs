import { Sequelize } from 'sequelize';
import allConfig from '../config/config.js';
import url from 'url';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

let sequelize;

if( env === 'production' ){

  // break apart the Heroku database url and rebuild the configs we need

  const DATABASE_URL = process.env.DATABASE_URL;
  const db_url = url.parse(DATABASE_URL);
  const username   = db_url.auth.substr(0, db_url.auth.indexOf(':'));
  const password   = db_url.auth.substr(db_url.auth.indexOf(':') + 1, db_url.auth.length);
  const dbName     = db_url.path.slice(1);

  const host   = db_url.hostname
  const port   = db_url.port;

  config.host = host;
  config.port = port;

  sequelize = new Sequelize(dbName, username, password, config);
}else{
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
