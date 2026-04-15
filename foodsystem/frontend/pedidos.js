const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

if (!usuario) {
  window.location.href = 'index.html';
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'index.html';
}

async function listarPedidos() {
  try {
    const res = await fetch('http://localhost:3000/pedidos/completo');

    if (!res.ok) {
      throw new Error('Erro ao buscar pedidos');
    }

    const pedidos = await res.json();

    const lista = document.getElementById('listaPedidos');
    lista.innerHTML = '';

    atualizarResumo(pedidos);

    if (pedidos.length === 0) {
      lista.innerHTML = `<div class="sem-pedidos">Nenhum pedido cadastrado ainda.</div>`;
      return;
    }

    pedidos.forEach(pedido => {
      const statusClasse = getClasseStatus(pedido.status);

      const itensHtml = pedido.itens.length
        ? pedido.itens.map(item =>
            `<li>${item.produto} — Quantidade: ${item.quantidade}</li>`
          ).join('')
        : '<li>Sem itens cadastrados</li>';

      lista.innerHTML += `
        <div class="pedido-card">
          <div class="pedido-topo">
            <h3>Pedido #${pedido.id}</h3>
            <span class="badge-status ${statusClasse}">${pedido.status || 'sem status'}</span>
          </div>

          <div class="pedido-info">
            <p><strong>Cliente:</strong> ${pedido.cliente || 'Não informado'}</p>
          </div>

          <div class="itens-box">
            <h4>Itens do pedido</h4>
            <ul>
              ${itensHtml}
            </ul>
          </div>

          <div class="acoes-pedido">
            <select id="status-${pedido.id}">
              <option value="pendente" ${pedido.status === 'pendente' ? 'selected' : ''}>Pendente</option>
              <option value="concluido" ${pedido.status === 'concluido' ? 'selected' : ''}>Concluído</option>
              <option value="cancelado" ${pedido.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
            </select>

            <button class="btn-salvar-status" onclick="atualizarStatus(${pedido.id})">
              Salvar status
            </button>

            <button class="btn-excluir" onclick="deletarPedido(${pedido.id})">
              Excluir pedido
            </button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error(error);
    document.getElementById('msg').innerText = 'Erro ao carregar pedidos';
  }
}

function atualizarResumo(pedidos) {
  document.getElementById('totalPedidos').innerText = pedidos.length;

  const pendentes = pedidos.filter(p =>
    String(p.status || '').toLowerCase() === 'pendente'
  ).length;

  const concluidos = pedidos.filter(p =>
    String(p.status || '').toLowerCase() === 'concluido'
  ).length;

  document.getElementById('totalPendentes').innerText = pendentes;
  document.getElementById('totalConcluidos').innerText = concluidos;
}

function getClasseStatus(status) {
  const valor = String(status || '').toLowerCase();

  if (valor === 'pendente') return 'status-pendente';
  if (valor === 'concluido') return 'status-concluido';
  if (valor === 'cancelado') return 'status-cancelado';

  return 'status-pendente';
}

async function atualizarStatus(id) {
  const status = document.getElementById(`status-${id}`).value;

  try {
    const res = await fetch(`http://localhost:3000/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      throw new Error('Erro ao atualizar status');
    }

    const data = await res.json();
    document.getElementById('msg').innerText =
      data.mensagem || 'Status atualizado com sucesso!';

    listarPedidos();
  } catch (error) {
    console.error(error);
    document.getElementById('msg').innerText = 'Erro ao atualizar status';
  }
}

async function deletarPedido(id) {
  const confirmar = confirm('Tem certeza que deseja excluir este pedido?');
  if (!confirmar) return;

  try {
    const res = await fetch(`http://localhost:3000/pedidos/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      throw new Error('Erro ao excluir pedido');
    }

    const data = await res.json();
    document.getElementById('msg').innerText = data.mensagem || 'Pedido excluído com sucesso!';
    listarPedidos();
  } catch (error) {
    console.error(error);
    document.getElementById('msg').innerText = 'Erro ao excluir pedido';
  }
}

listarPedidos();