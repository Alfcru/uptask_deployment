const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handlers/email')

exports.formCrearCuenta = (req, res)=>{
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    })    
}

exports.formIniciarSesion = (req, res)=>{
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en UpTask',
        error
    })    
}

exports.crearCuenta = async (req, res) => {
    //leer los datos
    const { email, password } = req.body;

    try {
        //crear usuario
        await Usuarios.create({
            email,
            password
        });
        //Crear una URL de Confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;


        //Crear objeto usuario
        const usuario = {
            email
        }

        //Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        })

        //redirigir al usuario
        req.flash('correcto', ' Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion')
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en UpTask',
            email,
            password
        })
    }

    // crear el Usuario
}

// funcion para reestablecer contraseña
exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

// Confirmar cuenta cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    })

    // si no existe usuario
    if(!usuario){
        req.flash('error', 'No valido')
        res.redirect('/crear-cuenta')
    }
    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente')
    res.redirect('/iniciar-sesion')

}