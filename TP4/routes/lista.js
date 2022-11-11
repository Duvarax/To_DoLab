var express = require('express');
var router = express.Router();

let listaController = require('../controladores/listaController')


/* GET home page. */
router.get('/', listaController.listarListas);

router.get('/:id/tareas', listaController.listarTareas);

router.delete('/borrar/:id', listaController.borrar)

router.get('/agregar', listaController.agregarForm)

router.post('/agregar', listaController.agregar)


router.get('/archivos', listaController.archivo)

router.put('/archivar/:id', listaController.archivar)

router.put('/activar/:id', listaController.activar)

router.get('/asignar', listaController.asignar)

router.post('/asignar', listaController.asignarTarea)

module.exports = router;
