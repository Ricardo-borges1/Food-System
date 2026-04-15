const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');

router.post('/', controller.criarUsuario);
router.get('/', controller.listarUsuarios);
router.post('/login', controller.login);
router.post('/esqueci-senha', controller.esqueciSenha);
router.post('/reset-senha', controller.resetSenha);

module.exports = router;