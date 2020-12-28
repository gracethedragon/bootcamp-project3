import { Sequelize } from 'sequelize';
import allConfig from '../config/config.js';

import itemModel from './item.mjs';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

let sequelize;

if( env === 'production' ){
  sequelize = new Sequelize(process.env.DATABASE_URL, config);
}else{
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Item = itemModel(sequelize, Sequelize.DataTypes);

export default db;
