const db = require('../config/db');

// CREATE
exports.criarProduto = (req, res) => {
  const { nome, descricao, preco } = req.body;

  db.query(
    'INSERT INTO produtos (nome, descricao, preco) VALUES (?, ?, ?)',
    [nome, descricao, preco],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ mensagem: 'Produto criado!' });
    }
  );
};

// READ
exports.listarProdutos = (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// UPDATE
exports.atualizarProduto = (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco } = req.body;

  db.query(
    'UPDATE produtos SET nome=?, descricao=?, preco=? WHERE id=?',
    [nome, descricao, preco, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ mensagem: 'Produto atualizado!' });
    }
  );
};

// DELETE
exports.deletarProduto = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM produtos WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ mensagem: 'Produto deletado!' });
  });
};