const db = require('../config/db');

// CREATE
exports.adicionarItem = (req, res) => {
  const { pedido_id, produto_id, quantidade } = req.body;

  db.query(
    'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES (?, ?, ?)',
    [pedido_id, produto_id, quantidade],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        mensagem: 'Item adicionado!',
        id: result.insertId
      });
    }
  );
};

// READ (todos itens)
exports.listarTodos = (req, res) => {
  db.query(
    `SELECT ip.*, p.nome 
     FROM itens_pedido ip
     JOIN produtos p ON ip.produto_id = p.id`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

// READ (itens de um pedido)
exports.listarPorPedido = (req, res) => {
  const { pedido_id } = req.params;

  db.query(
    `SELECT ip.*, p.nome 
     FROM itens_pedido ip
     JOIN produtos p ON ip.produto_id = p.id
     WHERE ip.pedido_id = ?`,
    [pedido_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

// UPDATE
exports.atualizarItem = (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;

  db.query(
    'UPDATE itens_pedido SET quantidade=? WHERE id=?',
    [quantidade, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ mensagem: 'Item atualizado!' });
    }
  );
};

// DELETE
exports.deletarItem = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM itens_pedido WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ mensagem: 'Item removido!' });
  });
};