var {item, Lista, sequelize} = require('../models');





exports.listarListas = async function(req, res, next) {
    let [result, x] = await Lista.findAll();
    console.log(result);
    console.log(x);
    if(req.session.listaId){
        req.session.error = false;
    }
   let listas = await Lista.findAll({
    where:{
        estado: [-1,0,1]
    }
   });
   if(listas.length == 0){
    listas = [{
        id: null,
        titulo:null,
        fechaCreacion:null,
        fechaResolucion:null,
        estado:null,
    }]
   }
   res.render('listasViews/index',{listas: listas, title: 'TO-DO-LIST', error: req.session.error});
   
  }


exports.listarTareas = async function(req,res,next) {
    req.session.listaId = req.params.id;
    
    let items = await item.findAll({
        where:{
            ListumId: req.session.listaId
        }
    });
    let cantItems = await item.count({
        where:{
            ListumId: req.session.listaId
        }
    })
    res.render('tareasViews/tareas', { tareas: items, title: 'Tareas', idl: req.session.listaId, cantidad: cantItems })
}

exports.agregarForm = function (req, res, next){
    res.render('listasViews/agregarLista')
}
exports.agregar = async function (req, res, next){

    let fechaCreacion = new Date();
    let datos= {...req.body,
        fechaCreacion: fechaCreacion,
        fechaResolucion: null,
    }
    let newLista = await Lista.create({
        titulo: datos.titulo,
        fechaCreacion: datos.fechaCreacion,
        fechaResolucion: datos.fechaResolucion,
        estado: datos.estado
    })
    res.redirect('/');
}

exports.borrar = async function(req,res,next){
    Lista.findByPk(req.params.id).then((x) => {
    if(x){
            x.destroy();
            Lista.findAll().then((listas) => {
                res.render('listasViews/index', {listas:listas, title: 'TO-DO-LIST', borrado: true})
            })
        }else{
            res.redirect('/');
        }
    })
}

exports.archivo = async function(req, res,next){

    let listas = await Lista.findAll({
        where:{
            estado: 2
        }
    })
    res.render('listasViews/archivo', {listas: listas, title: 'Listas archivadas'})
}

exports.archivar = function(req, res, next){
    Lista.findByPk(req.params.id).
    then(async (x) => {
        if(x){
            x.estado = 2;
            x.save();
            let listas = await Lista.findAll({
                where:{
                    estado:[-1,0,1]
                }
            });
            res.render('listasViews/index', {listas: listas, title: 'TO-DO-LIST', archivado: true});
        }else if(x.estado == 2){
            res.redirect('/');
        }
    })
    
}

exports.activar = async function(req, res, next){
    Lista.findByPk(req.params.id).
    then((x) => {
        if(x){
            x.estado = 1;
            x.save();
            Lista.findAll({
                where:{
                    estado: 2
                }
            }).then((listas) => {
                res.render('listasViews/archivo', {listas: listas, title: 'Listas Archivadas', activado: true});
            })
        }else if(x.estado == 1){
            res.redirect('/');
        }
        
    })
}

