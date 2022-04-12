import { Sequelize } from 'sequelize';
import url from 'url';
import allConfig from '../config/config.js';
import initGameModel from './game.mjs';
import initGamesuserModel from './gamesuser.mjs';
import initUserModel from './user.mjs';

const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};
let sequelize;

// If env is production, retrieve database auth details from the
// DATABASE_URL env var that Heroku provides us
if (env === 'production') {
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(dbUrl.auth.indexOf(':') + 1, dbUrl.auth.length);
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
}

// If env is not production, retrieve DB auth details from the config
else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.User = initUserModel(sequelize, Sequelize.DataTypes);
db.Game = initGameModel(sequelize, Sequelize.DataTypes);
db.Gamesuser = initGamesuserModel(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.Gamesuser, {
  as: 'pOne',
  foreignKey: 'player_one',
});

db.User.hasMany(db.Gamesuser, {
  as: 'pTwo',
  foreignKey: 'player_two',
});

db.Gamesuser.belongsTo(db.User, {
  as: 'PlayerOne',
  foreignKey: 'player_one',
});

db.Gamesuser.belongsTo(db.User, {
  as: 'PlayerTwo',
  foreignKey: 'player_two',
});

db.Game.hasOne(db.Gamesuser);
db.Gamesuser.belongsTo(db.Game);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
