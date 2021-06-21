const express = require("express");
const routes = require('./routes');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//Importar variables de entorno
require('dotenv').config({path:'variables.env'});


// helper con algunas funciones
const helpers = require('./helpers');

//const bodyParser = require('body-parser');

// crear coneccion a la DB
const db = require('./config/db');

// Importar el Modelo
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')

db.sync()  
    .then(()=> console.log(' Conectado al Servidor'))
    .catch(error => console.log('Mi error !',error));

// crear una app de express
const app  = express();

// Agregamos expres validator a toda la aplicacion
//app.use(expressValidator());

// Donde cargamos los archivos estaticos
app.use(express.static('public'));

// Habilitamos Pug
app.set('view engine', 'pug');

// Añaidr carpeta de las Vistas
app.set('views', path.join(__dirname, './views'));

//agregar flass messages
app.use(flash());

//cookiparse
app.use(cookieParser());

// Sessiones nos permiten navegar entre paginas sin perder autenticacion
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session())

//Pasar var dump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user } || null
    next();
})

// Aprendiendo Middleware
//app.use((req, res, next) =>{
//    const fecha = new Date();
//    res.locals.year = fecha.getFullYear();
//    next();
//})

//app.use((req, res, next) =>{
//    console.log(' Yo soy otro middleware');
//    next();
//})

// habilitar bodyParser para leer datos del Formulario
app.use(express.urlencoded({ extended: true }))

// ruta para el home
app.use("/", routes() );
// Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El Servidor esta funcionando')
});

