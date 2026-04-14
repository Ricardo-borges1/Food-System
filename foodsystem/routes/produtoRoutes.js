const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');

router.post('/', controller.criarProduto);
router.get('/', controller.listarProdutos);
router.put('/:id', controller.atualizarProduto);
router.delete('/:id', controller.deletarProduto);

module.exports = router;