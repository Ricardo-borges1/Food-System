function toggleSenha() {
  const input = document.getElementById('senha');
  input.type = input.type === 'password' ? 'text' : 'password';
}

// LOGIN
async function login() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const res = await fetch('http://localhost:3000/usuarios/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();

  document.getElementById('msg').innerText = data.mensagem;
}

// CADASTRO
async function cadastrar() {
  const nome = document.getElementById('nomeCadastro').value;
  const email = document.getElementById('emailCadastro').value;
  const senha = document.getElementById('senhaCadastro').value;

  try {
    const res = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });

    const data = await res.json();

    document.getElementById('msgCadastro').innerText = data.mensagem;

    if (res.ok) {
      document.getElementById('nomeCadastro').value = '';
      document.getElementById('emailCadastro').value = '';
      document.getElementById('senhaCadastro').value = '';
    }
  } catch (error) {
    document.getElementById('msgCadastro').innerText = 'Erro ao cadastrar usuário';
    console.error(error);
  }
}

// TROCAR TELAS
function mostrarCadastro() {
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('cadastroBox').classList.remove('hidden');

  document.body.classList.add('cadastro-ativo'); // 🔥
}

function voltarLogin() {
  document.getElementById('cadastroBox').classList.add('hidden');
  document.getElementById('loginBox').classList.remove('hidden');

  document.body.classList.remove('cadastro-ativo'); // 🔥
}

async function esqueciSenha() {
  const email = document.getElementById('email').value;

  if (!email) {
    document.getElementById('msg').innerText = 'Digite seu email primeiro';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/usuarios/esqueci-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    document.getElementById('msg').innerText = data.mensagem;
  } catch (error) {
    document.getElementById('msg').innerText = 'Erro ao solicitar recuperação';
    console.error(error);
  }
}