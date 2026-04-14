const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

module.exports = app;





// CRUDS 

const produtoRoutes = require('./routes/produtoRoutes');

app.use('/produtos', produtoRoutes);


const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/usuarios', usuarioRoutes);


const pedidoRoutes = require('./routes/pedidoRoutes');

app.use('/pedidos', pedidoRoutes);


const itemRoutes = require('./routes/itemPedidoRoutes');
app.use('/itens', itemRoutes);