var {item, Lista, usuario} = require('../models');
var jwt = require('jsonwebtoken');
let secret = 'duvara secret key';




exports.listarListas = async function(req, res, next) {
    if(req.session.listaId){
        req.session.error = false;
    }
    let decoded;
    if(req.session.token){
        decoded = jwt.decode(req.session.token, secret);
    }
    if(req.user){
        req.session.user = req.user[0].id;
        decoded = {
            id: req.session.user
        }
    }
   let listas = await Lista.findAll({
    where:{
        estado: [-1,0,1],
        usuarioId: decoded.id
        
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
    res.render('tareasViews/tareas', { tareas: items, title: 'Tareas', idlista: req.session.listaId, cantidad: cantItems })
}

exports.agregarForm = function (req, res, next){
    let decoded;
    if(req.session.token){
        let x = jwt.decode(req.session.token, secret);
        decoded = {
            id: x.id
        };
    }
    if(req.user){
        req.session.user = req.user[0].id;
        decoded = {
            id: req.session.user
        }
    }
    res.render('listasViews/agregarLista', {userId: decoded})
}
exports.agregar = async function (req, res, next){
    let fechaCreacion = new Date();
    let datos= {...req.body,
        fechaCreacion: fechaCreacion,
        fechaResolucion: null,
    }
    let newLista = await Lista.create({
        usuarioId: datos.user,
        titulo: datos.titulo,
        fechaCreacion: datos.fechaCreacion,
        fechaResolucion: datos.fechaResolucion,
        estado: datos.estado
    })
    let decoded;
    if(req.session.token){
        let x = jwt.decode(req.session.token, secret);
        decoded = {
            id: x.id
        };
    }
    if(req.user){
        req.session.user = req.user[0].id;
        decoded = {
            id: req.session.user
        }
    }
    let listas = await Lista.findAll({
        where:{
            estado: [-1,0,1],
            usuarioId: decoded.id
            
        }
       });
    res.render('listasViews/index', {title: 'TO-DO-LIST',listas:listas, agregada: true} )
}

exports.borrar = async function(req,res,next){
    Lista.findByPk(req.params.id).then((x) => {
        let decoded;
        if(req.session.token){
            let x = jwt.decode(req.session.token, secret);
            decoded = {
                id: x.id
            };
        }
        if(req.user){
            req.session.user = req.user[0].id;
            decoded = {
                id: req.session.user
            }
        }
    if(x){
            x.destroy();
            Lista.findAll({
                where:{
                    estado: [-1,0,1],
                    usuarioId: decoded.id
                    
                }
               }).then((listas) => {
                res.render('listasViews/index', {listas:listas, title: 'TO-DO-LIST', borrado: true})
            })
        }else{
            res.redirect('/listas/');
        }
    })
}

exports.archivo = async function(req, res,next){
    let decoded;
    if(req.session.token){
        let x = jwt.decode(req.session.token, secret);
        decoded = {
            id: x.id
        };
    }
    if(req.user){
        req.session.user = req.user[0].id;
        decoded = {
            id: req.session.user
        }
    }
    let listas = await Lista.findAll({
        where:{
            estado: 2,
            usuarioId: decoded.id
            
        }
       })
    res.render('listasViews/archivo', {listas: listas, title: 'Listas archivadas'})
}

exports.archivar = function(req, res, next){
    Lista.findByPk(req.params.id).
    then( (x) => {
        if(x){
            x.estado = 2;
            x.save();
            let decoded;
        if(req.session.token){
        let x = jwt.decode(req.session.token, secret);
        decoded = {
            id: x.id
        };
        }
        if(req.user){
            req.session.user = req.user[0].id;
            decoded = {
                id: req.session.user
            }
        }
            Lista.findAll({
                where:{
                    estado: [-1,0,1],
                    usuarioId: decoded.id
                    
                }
               }).then((listas) => {
                res.render('listasViews/index', {listas: listas, title: 'TO-DO-LIST', archivado: true});

               });
        }else if(x.estado == 2){
            res.redirect('/listas/');
        }
    })
    
}

exports.activar = async function(req, res, next){
    Lista.findByPk(req.params.id).
    then((x) => {
        if(x){
            x.estado = 1;
            x.save();
            let decoded;
    if(req.session.token){
        let x = jwt.decode(req.session.token, secret);
        decoded = {
            id: x.id
        };
    }
    if(req.user){
        req.session.user = req.user[0].id;
        decoded = {
            id: req.session.user
        }
    }
            Lista.findAll({
                where:{
                    estado: 2,
                    usuarioId: decoded.id
                }
            }).then((listas) => {
                res.render('listasViews/archivo', {listas: listas, title: 'Listas Archivadas', activado: true});
            })
        }else if(x.estado == 1){
            res.redirect('/listas/');
        }
        
    })
}


exports.asignar = async function(req,res, next){
    let usuarios = await usuario.findAll();
    let decoded;
    if(req.session.token){
        let x = jwt.decode(req.session.token, secret);
        decoded = {
            id: x.id
        };
    }
    if(req.user){
        decoded = {
            id: req.user[0].id
        }
    }
    res.render('listasViews/asignar', {usuarios:usuarios, aux:decoded.id});
}

exports.asignarTarea = async function(req,res,next){
    let feCreacion = formatDate(new Date());
    let datos = {
        ...req.body
       
    }
    if(datos.fechaLimite == ''){
        datos.fechaLimite = null;
    }
     let [lista, created] = await Lista.findOrCreate({where:{
        titulo: 'Tareas Asignadas',
        usuarioId: datos.usuario,

     },
     defaults: {
        usuarioId: datos.usuario,
        fechaCreacion: feCreacion,
        estado: 0
     }
     });
     console.log(lista),
     console.log(created)
     if(lista){
        let tarea = await item.create({
        ListumId: lista.id,
        titulo: datos.titulo,
        descripcion: datos.descripcion,
        fechaCreacion: feCreacion,
        fechaLimite: datos.fechaLimite,
        prioridad: datos.prioridad,
        estado: datos.estado
        })
        if(tarea){
            res.redirect('/listas/');
        }
     }

    
    
    }

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}