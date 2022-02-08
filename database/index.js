const mongoose = require("mongoose");
const { dbHost, dbName, dbUser, dbPort, dbPass } = require("../app/config");

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`
);
const db = mongoose.connection;

module.exports = db;