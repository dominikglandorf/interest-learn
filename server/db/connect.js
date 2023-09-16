const mongoose = require('mongoose');
const { DB_NAME } = require('../configuration');

mongoose.connect('mongodb://127.0.0.1:27017/' + DB_NAME);