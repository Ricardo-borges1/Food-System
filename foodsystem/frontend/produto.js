const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

if (!usuario) {
  window.location.href = 'index.html';
}

let produtoEmEdicao = null;

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'index.html';
}

async function listarProdutos() {
  try {
    const res = await fetch('http://localhost:3000/produtos');
    if (!res.ok) {
      throw new Error('Erro ao buscar produtos');
    }

    const produtos = await res.json();

    const lista = document.getElementById('listaProdutos');
    lista.innerHTML = '';

    if (produtos.length === 0) {
      lista.innerHTML = `<div class="sem-produtos">Nenhum produto cadastrado ainda.</div>`;
      return;
    }

    produtos.forEach(produto => {
      lista.innerHTML += `
        <div class="produto-card">
          <h3>${produto.nome}</h3>
          <p><strong>Descrição:</strong> ${produto.descricao}</p>
          <div class="produto-preco">R$ ${Number(produto.preco).toFixed(2)}</div>

          <div class="card-acoes">
            <button class="btn-editar" onclick="editarProduto(${produto.id}, '${escapeHtml(produto.nome)}', '${escapeHtml(produto.descricao)}', '${produto.preco}')">
              Editar
            </button>
            <button class="btn-excluir" onclick="deletarProduto(${produto.id})">
              Excluir
            </button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error(error);
    document.getElementById('msg').innerText = 'Erro ao carregar produtos';
  }
}

async function salvarProduto() {
  if (produtoEmEdicao) {
    await atualizarProduto();
  } else {
    await cadastrarProduto();
  }
}

async function cadastrarProduto() {
  const nome = document.getElementById('nome').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const preco = document.getElementById('preco').value.trim();

  if (!nome || !descricao || !preco) {
    document.getElementById('msg').innerText = 'Preencha todos os campos.';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao, preco })
    });

    const data = await res.json();
    document.getElementById('msg').innerText = data.mensagem || 'Produto cadastrado com sucesso!';

    limparFormulario();
    listarProdutos();
  } catch (error) {
    console.error(error);
    document.getElementById('msg').innerText = 'Erro ao cadastrar produto';
  }
}

function editarProduto(id, nome, descricao, preco) {
  produtoEmEdicao = id;

  document.getElementById('nome').value = nome;
  document.getElementById('descricao').value = descricao;
  document.getElementById('preco').value = preco;

  document.getElementById('tituloFormulario').innerText = 'Editar produto';
  document.getElementById('btnSalvar').innerText = 'Salvar alterações';
  document.getElementById('btnCancelar').style.display = 'inline-block';

  document.getElementById('msg').innerText = 'Modo de edição ativado.';
}

async function atualizarProduto() {
  const nome = document.getElementById('nome').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const preco = document.getElementById('preco').value.trim();

  if (!nome || !descricao || !preco) {
    document.getElementById('msg').innerText = 'Preencha todos os campos.';
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/produtos/${produtoEmEdicao}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao, preco })
    });

    const data = await res.json();
    document.getElementById('msg').innerText = data.mensagem || 'Produto atualizado com sucesso!';

    cancelarEdicao();
    listarProdutos();
  } catch (error) {
    console.error(error);
    document.getElementById('msg').innerText = 'Erro ao atualizar produto';
  }
}

async function deletarProduto(id) {
  const confirmar = confirm('Tem certeza que deseja excluir este produto?');
  if (!confirmar) return;

  try {
    const res = await fetch(`http://localhost:3000/produtos/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    document.getElementById('msg').innerText = data.mensagem || 'Produto excluído com sucesso!';

    if (produtoEmEdicao === id) {
      cancelarEdicao();
    }

    listarProdutos();
  } catch (error) {
    console.error(error);
    document.getElementById('msg').innerText = 'Erro ao deletar produto';
  }
}

function cancelarEdicao() {
  produtoEmEdicao = null;
  limparFormulario();

  document.getElementById('tituloFormulario').innerText = 'Cadastrar produto';
  document.getElementById('btnSalvar').innerText = 'Cadastrar produto';
  document.getElementById('btnCancelar').style.display = 'none';
  document.getElementById('msg').innerText = '';
}

function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('preco').value = '';
}

function escapeHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

listarProdutos();