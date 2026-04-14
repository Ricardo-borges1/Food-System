const db = require('../config/db');

// CREATE
exports.criarPedido = (req, res) => {
  const { usuario_id } = req.body;

  db.query(
    'INSERT INTO pedidos (usuario_id) VALUES (?)',
    [usuario_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        mensagem: 'Pedido criado!',
        pedidoId: result.insertId
      });
    }
  );
};

// READ
exports.listarPedidos = (req, res) => {
  db.query('SELECT * FROM pedidos', (err, result) => {
    console.log("RESULTADO:", result);
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};


// UPDATE STATUS
exports.atualizarStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    'UPDATE pedidos SET status=? WHERE id=?',
    [status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ mensagem: 'Status atualizado!' });
    }
  );
};

// DELETE
exports.deletarPedido = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM pedidos WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ mensagem: 'Pedido deletado!' });
  });
};




exports.listarPedidosCompleto = (req, res) => {
  const sql = `
    SELECT 
      p.id AS pedido_id,
      p.status,
      u.nome AS cliente,
      pr.nome AS produto,
      ip.quantidade
    FROM pedidos p
    JOIN usuarios u ON p.usuario_id = u.id
    LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id
    LEFT JOIN produtos pr ON ip.produto_id = pr.id
    ORDER BY p.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    // organizar dados
    const pedidos = [];

    results.forEach(row => {
      let pedido = pedidos.find(p => p.id === row.pedido_id);

      if (!pedido) {
        pedido = {
          id: row.pedido_id,
          cliente: row.cliente,
          status: row.status,
          itens: []
        };
        pedidos.push(pedido);
      }

      if (row.produto) {
        const itemExistente = pedido.itens.find(
  i => i.produto === row.produto
);

if (itemExistente) {
  itemExistente.quantidade += row.quantidade;
} else {
  pedido.itens.push({
    produto: row.produto,
    quantidade: row.quantidade
  });
}
      }
    });

    res.json(pedidos);
  });
};