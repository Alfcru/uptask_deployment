const { Sequelize } = require('sequelize');
require('dotenv').config({path:'variables.env'});
const nombre = process.env.BD_NOMBRE
const usuario = process.env.BD_USER
const pass = process.env.BD_PASS
const host = process.env.BD_HOST
const port = process.env.BD_PORT


// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(nombre, usuario, pass, {
    host: host,
    port: port,
    dialect: 'mysql'
  });

module.exports = db;
