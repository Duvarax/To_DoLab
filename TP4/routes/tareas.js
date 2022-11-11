var express = require('express')
var router = express.Router();

var tareaController = require('../controladores/tareaController');

router.get('/listar', tareaController.listar);

router.delete('/borrar/:id', tareaController.borrar)

router.get('/orden/:orden', tareaController.ordenFechaC)

router.get('/editar/:id', tareaController.editar)
router.put('/editar/item/:id', tareaController.editarItem)

router.get('/item/agregar', tareaController.agregarForm)
router.post('/item/success', tareaController.agregar)



module.exports = router;