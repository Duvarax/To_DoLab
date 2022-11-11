
var {item, Lista, sequelize} = require('../models');



exports.listar = async function(req,res,next){
    
    let items = await item.findAll({
        where:{
            ListumId: req.session.listaId
        }
    });
    req.session.cantItems = await item.count({
        where:{
            ListumId: req.session.listaId
        }
    })
    let cantResueltas = await item.count({
        where:{
            ListumId: req.session.listaId,
            estado: 1
        },

    })
    if(req.session.cantItems == cantResueltas){
        Lista.findByPk(req.session.listaId)
        .then((x) => {
            x.estado = 1;
            x.fechaResolucion = new Date();
            x.save();
        })
    }else{
        Lista.findByPk(req.session.listaId)
        .then((x) => {
            x.estado = 0;
            x.fechaResolucion = null;
            x.save();
        })
    }
    res.render('tareasViews/tareas', { tareas: items, title: 'Tareas', idlista: req.session.listaId, cantidad:req.session.cantItems, agregado: req.session.agregar })
  }

exports.borrar = function(req, res, next){
    console.log(req.session);
    item.findByPk(req.params.id).then((x) => {
    console.log(x);
    if(x){
        console.log('entra')
        x.destroy()
        req.session.cantItems = req.session.cantItems-1
        item.findAll({
            where:{
                ListumId: req.session.listaId
            }
        }).then((items) => {
            res.render('tareasViews/tareas', {tareas: items, title:'Tareas', borrado:true, idlista: req.session.listaId, cantidad: req.session.cantItems})
        })
        
    }else{
        res.redirect(`/tareas/listar`)
    }
     })
  }

exports.ordenFechaC = function(req, res, next){
    if(req.params.orden === 'fechaC'){
        item.findAll({
            ListumId: req.session.listaId,
            order: [['fechaCreacion', 'DESC']]
        }).
        then((items) => {
            res.render('tareasViews/tareas', { tareas: items, title: 'Tareas', ordenado: 0})
        })
    }
    if(req.params.orden === 'fechaL'){
        item.findAll({
            ListumId: req.session.listaId,
            order: [['fechaLimite', 'DESC']]
        }).
        then((items) => {
            res.render('tareasViews/tareas', { tareas: items, title: 'Tareas', ordenado: 1})
        })
    }
    if(req.params.orden === 'prioridad'){
        item.findAll({
            ListumId: req.session.listaId,
            order: [['prioridad', 'DESC']]
        }).
        then((items) => {
            res.render('tareasViews/tareas', { tareas: items, title: 'Tareas', ordenado: 2})
        })
    }
}

exports.editar = async function(req, res, next) {
   let x = await item.findByPk(req.params.id);
   let listas = await Lista.findAll({
    where:{
        estado:[-1,0,1]
    }
   });

   res.render('tareasViews/editarTarea',{x: x, listas: listas, title: 'Editar Tarea', aux: req.session.listaId});
}

exports.editarItem = async function (req, res, next) {
    let x = await item.findByPk(req.params.id)
    console.log(x)
    let datosNuevos = {...req.body};
    
    x.titulo = datosNuevos.titulo;
    x.descripcion = datosNuevos.descripcion;
    x.fechaLimite = datosNuevos.fechaL;
    x.prioridad = datosNuevos.prioridad;
    x.estado = datosNuevos.estado;

    x.save().then((x) => {
        res.redirect(`/tareas/listar`)
    })
}

exports.agregarForm = async function (req, res, next){


    Lista.findAll({
    where:{
        estado:[-1,0,1]
    }
   }).then((listas) => {
        res.render('tareasViews/agregarTarea', {listas:listas, title: 'Agregar Tarea', aux: req.session.listaId});
    })
}

exports.agregar = async function (req, res, next){
    let datos = {...req.body
    }
    let fechaCreacion = new Date();

  


     let newItem = await item.create({
         ListumId: datos.ListumId,
         titulo: datos.titulo,
         descripcion: datos.descripcion,
         fechaCreacion: fechaCreacion,
         fechaLimite: datos.fechaL,
         prioridad: datos.prioridad,
         estado: datos.estado
     })
    res.redirect('/tareas/listar')
}



