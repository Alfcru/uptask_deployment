const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al MOdelo donde vamos a auntenticar
const Usuarios = require('../models/Usuarios');

//local strategy - Login con credenciales  propios ( usuario y password)
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordFiled: 'password'
        },
        async ( email, password, done) =>{
            try{
                const usuario = await Usuarios.findOne({
                    where: {
                        email: email,
                        activo: 1
                    }
                })
                //El Usuario Existe, Password COrrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })
                }
                //El Email existe y la contraseña es correcta
                return done(null, usuario);
            } catch (error){
                // Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
)

// Serializar el usuario
passport.serializeUser((usuario, callback)=> {
    callback(null, usuario);
})

// Deserializar el usuario
passport.deserializeUser((usuario, callback)=> {
    callback(null, usuario);
})

// exportar
module.exports = passport;