const dbConfig = require('../config/db.config')

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.productos = require('./product.model.js')(mongoose);
db.users = require('./user.model.js')(mongoose);
db.role = require('./role.model.js')(mongoose);
db.sales = require('./sales.model')(mongoose);

module.exports = db;
