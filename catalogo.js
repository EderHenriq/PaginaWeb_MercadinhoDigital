// --- INICIALIZAÇÃO E VERIFICAÇÃO DE LOGIN ---
if (localStorage.getItem("logado") !== "true") {
    window.location.href = "index.html";
  }
  
  let listaDeProdutos = [];
  let checkoutModal; // Variável para o modal de checkout
  
  document.addEventListener("DOMContentLoaded", () => {
    checkoutModal = document.getElementById('checkout-modal'); // Pega o modal
    configurarBoasVindasEListeners();
    carregarProdutos();
    atualizarVisualizacaoCarrinho();
  });
  
  
  // --- CONFIGURAÇÃO INICIAL E LISTENERS DE EVENTOS ---
  function configurarBoasVindasEListeners() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (usuarioLogado) {
      document.getElementById('welcome-message').textContent = `Bem-vindo(a), ${usuarioLogado}!`;
    }
  
    // Delegação de Eventos para a lista de produtos
    document.getElementById('produtos').addEventListener('click', (event) => {
      if (event.target && event.target.matches('.add-carrinho-btn')) {
        const idProduto = event.target.getAttribute('data-id');
        adicionarAoCarrinho(idProduto);
      }
    });
  
    // Delegação de Eventos para o carrinho de compras
    document.getElementById('carrinho-conteudo').addEventListener('click', (event) => {
      const target = event.target;
      if (target) {
          const idProduto = target.getAttribute('data-id');
          if (target.matches('.remover-item-btn')) removerItemDoCarrinho(idProduto);
          else if (target.matches('.diminuir-qtd-btn')) alterarQuantidade(idProduto, -1);
          else if (target.matches('.aumentar-qtd-btn')) alterarQuantidade(idProduto, 1);
      }
    });
  
    // **Listeners para o Modal de Checkout**
    const closeButton = document.querySelector('.close-button');
    const checkoutForm = document.getElementById('checkout-form');
  
    closeButton.addEventListener('click', () => fecharModalCheckout());
    checkoutModal.addEventListener('click', (event) => {
      if (event.target.id === 'checkout-modal') { // Fecha se clicar no fundo
        fecharModalCheckout();
      }
    });
    checkoutForm.addEventListener('submit', (event) => processarPedido(event));
  }
  
  
  // --- LÓGICA DE PRODUTOS E API ---
  async function carregarProdutos() {}
  async function carregarProdutos() {
      const divProdutos = document.getElementById("produtos");
      divProdutos.innerHTML = "<p>Carregando produtos...</p>"; 
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        listaDeProdutos = await res.json();
        divProdutos.innerHTML = "";
        listaDeProdutos.forEach(prod => {
          const card = document.createElement("div");
          card.className = "produto";
          card.innerHTML = `
            <img src="${prod.image}" alt="${prod.title}" />
            <div class="produto-info">
              <h3>${prod.title}</h3>
              <p class="produto-descricao">${prod.description.substring(0, 80)}...</p>
              <p class="produto-preco">R$ ${prod.price.toFixed(2)}</p>
            </div>
            <button class="add-carrinho-btn" data-id="${prod.id}">Adicionar ao Carrinho</button>
          `;
          divProdutos.appendChild(card);
        });
      } catch (error) {
        console.error("Falha ao carregar produtos:", error);
        divProdutos.innerHTML = "<p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>";
      }
  }
  
  
  // --- FUNÇÕES DO CARRINHO (USANDO LOCALSTORAGE) ---
  function obterCarrinho() { return JSON.parse(localStorage.getItem("carrinho")) || []; }
  function salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarVisualizacaoCarrinho();
  }
  function adicionarAoCarrinho(idProduto) {}
  function removerItemDoCarrinho(idProduto) {}
  function alterarQuantidade(idProduto, mudanca) {}
  function adicionarAoCarrinho(idProduto) {
      const carrinho = obterCarrinho();
      const produto = listaDeProdutos.find(p => p.id == idProduto);
      if (!produto) return;
      const itemExistente = carrinho.find(item => item.id == idProduto);
      if (itemExistente) {
        itemExistente.quantidade += 1;
      } else {
        carrinho.push({ ...produto, quantidade: 1 });
      }
      salvarCarrinho(carrinho);
  }
  function removerItemDoCarrinho(idProduto) {
      let carrinho = obterCarrinho();
      carrinho = carrinho.filter(item => item.id != idProduto);
      salvarCarrinho(carrinho);
  }
  function alterarQuantidade(idProduto, mudanca) {
      let carrinho = obterCarrinho();
      const item = carrinho.find(i => i.id == idProduto);
      if (item) {
        item.quantidade += mudanca;
        if (item.quantidade <= 0) {
          carrinho = carrinho.filter(i => i.id != idProduto);
        }
      }
      salvarCarrinho(carrinho);
  }
  
  
  
  function atualizarVisualizacaoCarrinho() {}
  function atualizarVisualizacaoCarrinho() {
      const carrinho = obterCarrinho();
      const containerItens = document.getElementById("itens-carrinho");
      const totalSpan = document.getElementById("total-carrinho");
      const quantidadeSpan = document.getElementById("quantidade-itens");
      const rodapeCarrinho = document.getElementById('carrinho-rodape');
      const msgCarrinhoVazio = document.querySelector('.carrinho-vazio-msg');
      containerItens.innerHTML = "";
      let totalPreco = 0;
      let totalItens = 0;
      if (carrinho.length === 0) {
        if(msgCarrinhoVazio) msgCarrinhoVazio.style.display = 'block';
        if(rodapeCarrinho) rodapeCarrinho.style.display = 'none';
      } else {
        if(msgCarrinhoVazio) msgCarrinhoVazio.style.display = 'none';
        if(rodapeCarrinho) rodapeCarrinho.style.display = 'flex';
        carrinho.forEach(item => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "item-carrinho";
          itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}" />
            <div class="item-info">
              <p class="item-titulo">${item.title}</p>
              <div class="item-controles">
                <button class="diminuir-qtd-btn" data-id="${item.id}">-</button>
                <span class="item-qtd">${item.quantidade}</span>
                <button class="aumentar-qtd-btn" data-id="${item.id}">+</button>
              </div>
            </div>
            <p class="item-subtotal">R$ ${(item.price * item.quantidade).toFixed(2)}</p>
            <button class="remover-item-btn" data-id="${item.id}">✖</button>
          `;
          containerItens.appendChild(itemDiv);
          totalPreco += item.price * item.quantidade;
          totalItens += item.quantidade;
        });
      }
      totalSpan.textContent = `Total: R$ ${totalPreco.toFixed(2)}`;
      quantidadeSpan.textContent = totalItens;
  }
  
  // --- FUNÇÕES GERAIS E LÓGICA DE CHECKOUT ---
  
  function alternarCarrinho() { document.getElementById("carrinho-conteudo").classList.toggle("hidden"); }
  
  // **ALTERADO: Função `finalizarCompra` agora abre o modal**
  function finalizarCompra() {
    const carrinho = obterCarrinho();
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    // Fecha o carrinho e abre o modal de checkout
    document.getElementById("carrinho-conteudo").classList.add("hidden");
    checkoutModal.classList.remove("hidden");
  }
  
  // **Função para fechar o modal**
  function fecharModalCheckout() {
    checkoutModal.classList.add("hidden");
  }
  
  // **Função para processar o pedido do formulário**
  function processarPedido(event) {
      event.preventDefault(); // Impede o recarregamento da página
  
      // Pega os dados do formulário
      const nome = document.getElementById('nome').value;
      const cpf = document.getElementById('cpf').value;
      const endereco = document.getElementById('endereco').value;
  
      // Validação simples
      if (!nome || !cpf || !endereco) {
          alert("Por favor, preencha todos os campos.");
          return;
      }
  
      // Mensagem de sucesso personalizada
      alert(`Obrigado, ${nome}! Sua compra foi finalizada com sucesso e será enviada para o endereço: ${endereco}.`);
      
      // Limpa o formulário
      document.getElementById('checkout-form').reset();
  
      // Fecha o modal
      fecharModalCheckout();
      
      // Limpa o carrinho
      salvarCarrinho([]);
  }
  
  function logout() {
      localStorage.removeItem("logado");
      localStorage.removeItem("usuarioLogado");
      localStorage.removeItem("carrinho");
      window.location.href = "index.html";
  }