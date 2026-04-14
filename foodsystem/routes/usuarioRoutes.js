const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');

router.post('/', controller.criarUsuario);
router.get('/', controller.listarUsuario);
router.put('/:id', controller.atualizarUsuario);
router.delete('/:id', controller.deletarUsuario);

router.post('/esqueci-senha', controller.esqueciSenha);

module.exports = router;

router.post('/login', controller.login);