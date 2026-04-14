const app = require('./app');

// força conexão com banco
require('./config/db');

app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});