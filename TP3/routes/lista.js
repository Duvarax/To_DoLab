var express = require('express');
var router = express.Router();

let listaController = require('../controladores/listaController')


/* GET home page. */
router.get('/', listaController.listarListas);

router.get('/lista/:id/tareas', listaController.listarTareas);

router.delete('/lista/borrar/:id', listaController.borrar)

router.get('/lista/agregar', listaController.agregarForm)

router.post('/lista/agregar/success', listaController.agregar)


router.get('/lista/archivos', listaController.archivo)

router.put('/lista/archivar/:id', listaController.archivar)

router.put('/lista/activar/:id', listaController.activar)




module.exports = router;
