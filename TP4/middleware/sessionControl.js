let jwt = require('jsonwebtoken');
let secretKey = 'duvara secret key';
exports.autenticado = function(req,res,next){
    try{
        if(req.user){
            next();
        }else{
            let token = req.session.token
            if(token.startsWith('Bearer')){
                token = token.slice(7, token.length());
            }
            if(token){
                jwt.verify(token, secretKey, (error, decoded) =>{
                    if(error) {return res.status(401)({message: 'Usuario no autenticado'})
                }else{
                     req.session.autenticado = false;
                     next();
                };
                    
                })
            }else{
                return res.status(401)({message: 'No disponible'})
            }
        } 
    }catch(error){
        req.session.autenticado = true;
        res.redirect('/user/login')
    }
}

exports.listaSeleccionada = function(req,res,next){ // Evita que el servidor colapse ante posibles errores con el uso de variables de sesion

    if(req.session.listaId == undefined){
        req.session.error = true;
        res.redirect('/listas/');
      }else{
      req.session.error = false;
      next();
    }
    
  }