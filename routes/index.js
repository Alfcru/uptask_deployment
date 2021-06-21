const expres = require("express");
const router = expres.Router();

// importar express Validator
const { body } = require('express-validator/check');

// importamos el controlador
const proyectosController = require('../controllers/proyectosController')
const tareasController = require('../controllers/tareasController');
const usuariosControllers = require('../controllers/usuariosController')
const authController = require('../controllers/authController');

module.exports = function () {
    // ruta para el home
    router.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectosHome);
    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    //Listar proyecto
    router.get('/proyectos/:url',
        authController.usuarioAutenticado, 
        proyectosController.proyectoPorurl);
    
    // Actualizar proyecto
    router.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado,
        proyectosController.proyectoEditar);
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    // Eliminar Proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,    
        proyectosController.eliminarProyecto)
    
    // Tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea)

    // Actualizar Tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,    
        tareasController.cambiarEstadoTarea)

    // Eliminar Tarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea)
    
    // Crear nueva Cuenta
    router.get('/crear-cuenta', usuariosControllers.formCrearCuenta)
    router.post('/crear-cuenta', usuariosControllers.crearCuenta)
    router.get('/confirmar/:correo', usuariosControllers.confirmarCuenta)

    //Iniciar session
    router.get('/iniciar-sesion', usuariosControllers.formIniciarSesion)
    router.post('/iniciar-sesion', authController.autenticarUsuario)

    // Cerrar Sesion
    router.get('/cerrar-sesion', authController.cerrarSesion)

    // Reestablecer COntraseña
    router.get('/reestablecer', usuariosControllers.formRestablecerPassword)
    router.post('/reestablecer', authController.enviarToken)
    router.get('/reestablecer/:token', authController.validarToken)
    router.post('/reestablecer/:token',authController.actualizarPassword)

    return router;

}