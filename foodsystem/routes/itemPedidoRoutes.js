const express = require('express');
const router = express.Router();
const controller = require('../controllers/itemPedidoController');

router.post('/', controller.adicionarItem);
router.get('/', controller.listarTodos);
router.get('/:pedido_id', controller.listarPorPedido);
router.put('/:id', controller.atualizarItem);
router.delete('/:id', controller.deletarItem);

module.exports = router;