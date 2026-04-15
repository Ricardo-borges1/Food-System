const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidoControllers');

router.post('/', controller.criarPedido);
router.get('/', controller.listarPedidos);
router.get('/completo', controller.listarPedidosCompleto);
router.put('/:id', controller.atualizarStatus);
router.delete('/:id', controller.deletarPedido);

module.exports = router;