const mongoose = require("mongoose");
const { dbHost, dbName, dbUser, dbPort, dbPass } = require("../app/config");

mongoose.connect(
  `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=${dbName}`
);
const db = mongoose.connection;

module.exports = db;
