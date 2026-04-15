document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuario) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('saudacao').innerHTML =
    `${getSaudacao()}, <span>${usuario.nome}</span> 👋`;

  atualizarDataHora();
  setInterval(atualizarDataHora, 1000);

  carregarDashboard();

  const dicas = [
    "Clique em Produtos para cadastrar novos itens 🍔",
    "Você pode acompanhar os pedidos por aqui 🧾",
    "Gerencie os usuários do sistema com facilidade 👤",
    "Seu painel está funcionando perfeitamente hoje ✅"
  ];

  const dicaMascote = document.getElementById('dicaMascote');
  if (dicaMascote) {
    dicaMascote.innerText = dicas[Math.floor(Math.random() * dicas.length)];
  }

  const atividades = [
    "✅ Dashboard carregada com sucesso",
    "📦 Dados sincronizados com o banco",
    "👤 Usuário administrador acessou a dashboard",
    "🕒 Sistema pronto para uso"
  ];

  const listaAtividade = document.getElementById('atividadeLista');
  if (listaAtividade) {
    listaAtividade.innerHTML = '';
    atividades.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      listaAtividade.appendChild(li);
    });
  }
});

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'index.html';
}

function irPara(secao) {
  if (secao === 'produtos') {
    window.location.href = 'produtos.html';
  } else if (secao === 'pedidos') {
    window.location.href = 'pedidos.html';
  } else if (secao === 'usuarios') {
    alert('Tela de usuários vamos fazer depois');
  }
}

function getSaudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

function atualizarDataHora() {
  const agora = new Date();

  const data = agora.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const hora = agora.toLocaleTimeString('pt-BR');

  const dataHora = document.getElementById('dataHora');
  if (dataHora) {
    dataHora.innerText = `${data} - ${hora}`;
  }
}

async function carregarDashboard() {
  const totalProdutos = document.getElementById('totalProdutos');
  const totalUsuarios = document.getElementById('totalUsuarios');
  const pedidosHoje = document.getElementById('pedidosHoje');
  const pedidosPendentes = document.getElementById('pedidosPendentes');

  if (totalProdutos) totalProdutos.innerText = '...';
  if (totalUsuarios) totalUsuarios.innerText = '...';
  if (pedidosHoje) pedidosHoje.innerText = '...';
  if (pedidosPendentes) pedidosPendentes.innerText = '...';

  // PRODUTOS
  try {
    const resProdutos = await fetch('http://localhost:3000/produtos');
    if (!resProdutos.ok) throw new Error('Erro ao buscar produtos');

    const produtos = await resProdutos.json();
    console.log('Produtos:', produtos);

    if (totalProdutos) totalProdutos.innerText = produtos.length;
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro);
    if (totalProdutos) totalProdutos.innerText = 'Erro';
  }

  // USUÁRIOS
  try {
    const resUsuarios = await fetch('http://localhost:3000/usuarios');
    if (!resUsuarios.ok) throw new Error('Erro ao buscar usuários');

    const usuarios = await resUsuarios.json();
    console.log('Usuários:', usuarios);

    if (totalUsuarios) totalUsuarios.innerText = usuarios.length;
  } catch (erro) {
    console.error('Erro ao buscar usuários:', erro);
    if (totalUsuarios) totalUsuarios.innerText = 'Erro';
  }

   // PEDIDOS
  try {
    const resPedidos = await fetch('http://localhost:3000/pedidos');

    if (!resPedidos.ok) {
      throw new Error('Erro ao buscar pedidos');
    }

    const pedidos = await resPedidos.json();
    console.log('Pedidos:', pedidos);

    document.getElementById('pedidosHoje').innerText = pedidos.length;

    const pendentes = pedidos.filter(p => {
      const status = String(p.status || '').toLowerCase();
      return status === 'pendente';
    });

    document.getElementById('pedidosPendentes').innerText = pendentes.length;
  } catch (erro) {
    console.error('Erro ao buscar pedidos:', erro);
    document.getElementById('pedidosHoje').innerText = 'Erro';
    document.getElementById('pedidosPendentes').innerText = 'Erro';
  }}