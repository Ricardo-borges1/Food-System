
// CREATE
const db = require('../config/db');
const bcrypt = require('bcrypt');

// CREATE
exports.criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos' });
  }

  try {
    db.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email],
      async (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (result.length > 0) {
          return res.status(400).json({ mensagem: 'Email já cadastrado' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        db.query(
          'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
          [nome, email, senhaCriptografada],
          (err, result) => {
            if (err) {
              return res.status(500).json(err);
            }

            res.status(201).json({
              mensagem: 'Usuário cadastrado com sucesso!',
              id: result.insertId
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' });
  }
};

// READ
exports.listarUsuario = (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};





// UPDATE
exports.atualizarUsuario = (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  db.query(
    'UPDATE usuarios SET nome=?, email=? WHERE id=?',
    [nome,email, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ mensagem: 'Usuario atualizado!' });
    }
  );
};




// DELETE
exports.deletarUsuario = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM usuarios WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ mensagem: 'Usuario deletado!' });
  });
};


exports.esqueciSenha = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ mensagem: 'Informe o email' });
  }

  db.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({ mensagem: 'Email não encontrado' });
      }

      return res.json({
        mensagem: 'Email encontrado. Próximo passo: enviar link de redefinição.'
      });
    }
  );
};



// LOGIN
exports.login = (req, res) => {
  const { email, senha } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(400).json({ mensagem: 'Usuário não encontrado' });
      }

      const usuario = result[0];

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(400).json({ mensagem: 'Senha inválida' });
      }

      res.json({
        mensagem: 'Login realizado!',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        }
      });
    }
  );
};