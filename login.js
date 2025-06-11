document.addEventListener('DOMContentLoaded', () => {
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
  
    showRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
    });
  
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    });
  });
  
  function registrar() {
    const user = document.getElementById("register-username").value;
    const pass = document.getElementById("register-password").value;
  
    if (!user || !pass) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
  
    // Pega a lista de usuários do localStorage ou cria uma nova se não existir
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  
    // Verifica se o usuário já existe
    const usuarioExistente = usuarios.find(u => u.user === user);
    if (usuarioExistente) {
      alert("Este nome de usuário já está em uso. Por favor, escolha outro.");
      return;
    }
  
    // Adiciona o novo usuário à lista
    usuarios.push({ user, pass });
    // Salva a lista atualizada de volta no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  
    alert("Cadastro realizado com sucesso! Agora você pode fazer login.");
    
    // Limpa os campos e volta para a tela de login
    document.getElementById("register-username").value = '';
    document.getElementById("register-password").value = '';
    document.getElementById('show-login').click();
  }
  
  function login() {
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;
  
    if (!user || !pass) {
      alert("Por favor, preencha usuário e senha.");
      return;
    }
  
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  
    // Procura por um usuário que corresponda ao usuário e senha digitados
    const usuarioValido = usuarios.find(u => u.user === user && u.pass === pass);
  
    if (usuarioValido) {
      localStorage.setItem("logado", "true");
      localStorage.setItem("usuarioLogado", user); // Salva o nome do usuário logado
      window.location.href = "catalogo.html";
    } else {
      alert("Usuário ou senha inválidos.");
    }
  }