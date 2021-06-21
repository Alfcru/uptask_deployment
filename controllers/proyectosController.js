const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas')
//const slug = require('slug');

exports.proyectosHome = async (req, res)=> {

    //console.log(res.locals.usuario)

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });
    res.render('index',{
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });

    const { nombre } = req.body;
    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }

    //si tenemos errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //const url =slug(nombre).toLowerCase();
        const usuarioId = res.locals.usuario.id;
        const proyecto = await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

exports.proyectoPorurl = async(req, res, next) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({
        where: {
            usuarioId
        }
    });

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    })
    // Eliminamos la await para cada consulta y creamso un promisAll (multiple consultas)
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    // Constultar Tareas del Proyecto Actual 
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        //include: [
        //    {model: Proyectos}
        //]
    })
    if(!proyecto) return next();

    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.proyectoEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({
        where: {
            id:req.params.id,
            usuarioId
        }
    });

    // Eliminamos la await para cada consulta y creamso un promisAll 
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])


    // render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });

    const { nombre } = req.body;
    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }

    //si tenemos errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        await Proyectos.update(
            { nombre: nombre },{
                where: {
                    id: req.params.id
                }
            }
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) =>{
    //req, query o params
    //console.log(req.query);
    const { urlProyecto } = req.query;

    const resultado = await Proyectos.destroy({
        where:{
            url: urlProyecto
        }
    })

    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente')
}