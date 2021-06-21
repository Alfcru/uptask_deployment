const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');



exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true
})

//FUncion para revisar si el usuario esta authenticado
exports.usuarioAutenticado = (req, res, next)=> {
    // si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }
    //si no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion')
}

// funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(()=> {
        res.redirect('/iniciar-sesion'); //nos lleva al login
    })
}

// funcion para generar Token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //verificar que usuario Existe
    const { email } = req.body;
    const usuario = await Usuarios.findOne({
        where:{
            email
        }
    })

    //Si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/reestablecer')
    }

    // Usuario existe generar TOken y tiempo
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000;
    
    // guardar en la base de dato
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`

    //enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecerPassword'
    })

    //terminar
    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    })

    //si no hay Usuario
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }

    //Fomrulario para generar password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

//cambiamos password por uno nuevo
exports.actualizarPassword = async (req, res) => {

    //verifica el token valido y fecha
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    })

    //verificar Usuario
    if(!usuario){
        res.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }

    //hashear el nuevo password

    usuario.password= bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) )
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}
