const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')

exports.agregarTarea = async(req, res, next) =>{
    //Obtenemos el Proyecto ACTUAL
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    })

    //lleemos el valor del input
    const { tarea } = req.body;

    // estado 0 = incompleto y ID del PROYECTO
    const estado= 0;
    const proyectoId = proyecto.id

    //Insertar en la Base de Datos
    const resultado = await Tareas.create({
        tarea,
        estado,
        proyectoId
    })

    if(!resultado){
        return next();
    }

    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async(req, res)=>{
    //cuando se manda por .patch se resive por params
    const { id } = req.params;
    const tarea = await Tareas.findOne({
        where: {
            id
        }
    })
    //cambiar el estado 
    let estado = 0
    if(tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;
    
    const resultado = await tarea.save();

    if(!resultado) return next();
    res.status(200).send('Actualizado')
}

exports.eliminarTarea = async(req, res, next) =>{
    const {id} = req.params;

    //Eliminar Tarea

    const resultado = await Tareas.destroy({
        where: {
            id
        }
    })
    if(!resultado) return next();
    res.status(200).send('Tarea Eliminada Correctamente')
}