import Sequelize from 'sequelize';
import config from '../config/config.js';
const db = new Sequelize(config.database, config.user, config.pw, {dialect : 'mysql', host : 'localhost', logging : false});
export default db;