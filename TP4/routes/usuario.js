var express = require('express')
var router = express.Router();
const passport = require('../middleware/oauth');

let usuarioController = require('../controladores/usuarioController');

router.get('/', usuarioController.inicio);
router.get('/user/signin', usuarioController.singin);
router.post('/user/singin', usuarioController.singinsuccess);
router.get('/user/login', usuarioController.login);
router.post('/user/login', usuarioController.loginsuccess);
router.post('/LogOut', usuarioController.logout);
router.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}));
router.get('/google/callback', passport.authenticate('google',{
    successRedirect: '/listas/',
    failureRedirect: '/login'
}))
module.exports = router;