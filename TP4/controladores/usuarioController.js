var {usuario} = require('../models');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
exports.inicio = function(req, res, next){
    res.render('inicio');
}

exports.singin = function(req,res,next){
    res.render('signin',{title: 'Registro de usuario'});
}
exports.singinsuccess = async function(req,res,next){
    let datos = {
        ...req.body
    }
    if(datos.nombre == '' || datos.password == ''){
        res.render('signin', {title: 'Registro de usuario', datosInvalidos: true})
    }else{
        let user = await usuario.create(datos);
        user.password = await bcrypt.hash(user.password, 10);
        user.save().then(() => {
            res.render('inicio', {creado: true});
        })
    }


    
}

exports.login = function(req,res,next){
    res.render('login', {title: 'Autenticacion de usuario', error: req.session.autenticado});
}

exports.loginsuccess = async function(req,res,next) {
    let datos = {
        ...req.body
    }


    let user = await usuario.findOne({
        where:{
            nombre: datos.nombre
        }
    });
    if(user){

        let validPassword = await bcrypt.compare(datos.password, user.password)
        console.log(validPassword);
        if(validPassword){
            let token = await jwt.sign({id: user.id}, 'duvara secret key', {expiresIn: '24h'});
            req.session.token = token;
            res.redirect('/listas/');
            
        }else{
            res.render('login', {title: 'Autenticacion de usuario', passwordInvalida: true});
        }
    }else{
        res.render('login', {title: 'Autenticacion de usuario', usuarioInvalido: true});
    }
}

exports.logout = function(req,res,next){
    if(req.session.token){
        req.session.destroy();
        res.render('inicio', {title: 'TO-DO-LIST', finalizada:true})
    }else{
        res.redirect('/');
    }
}