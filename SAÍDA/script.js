// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC7eniB3_IFT8E-Tb1VkfktcWUsfLRRYXw",
    authDomain: "bancoreciclar.firebaseapp.com",
    databaseURL: "https://bancoreciclar-default-rtdb.firebaseio.com",
    projectId: "bancocozinha",
    storageBucket: "bancoreciclar.firebasestorage.app",
    messagingSenderId: "418801320354",
    appId: "1:418801320354:web:3f854deb9e2dda520732fb",
    measurementId: "G-5J6XFE0H02"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao banco de dados de produtos
const dbProdutos = firebase.database().ref('cadastroProdutos');

// Referência ao banco de dados de saídas
const dbSaidas = firebase.database().ref('registrosaidas');

// Função para consultar dados com filtros
function consultarDados() {
    const sku = document.getElementById('sku').value.trim().toLowerCase();
    const nome = document.getElementById('nome').value.trim().toLowerCase();

    dbProdutos.once('value', (snapshot) => {
        const produtos = snapshot.val();
        const resultados = [];

        for (const key in produtos) {
            if (produtos.hasOwnProperty(key)) {
                const produto = produtos[key];
                const atendeSku = !sku || (produto.sku || '').toLowerCase().includes(sku);
                const atendeNome = !nome || (produto.nome || '').toLowerCase().includes(nome);

                if (atendeSku && atendeNome) {
                    resultados.push(produto);
                }
            }
        }

        exibirResultados(resultados);
    });
}

// Função para exibir os resultados na tabela
function exibirResultados(resultados) {
    const tabela = document.getElementById('resultados');
    tabela.innerHTML = '';

    resultados.forEach(produto => {
        const row = tabela.insertRow();
        row.insertCell(0).innerText = produto.sku;
        row.insertCell(1).innerText = produto.descricao;
        row.insertCell(2).innerText = produto.tipo;
        row.insertCell(3).innerText = produto.unidade;
        row.insertCell(4).innerText = produto.grupo;
        row.insertCell(5).innerText = produto.quantidade;
        row.insertCell(6).innerText = produto.fornecedor;
        row.insertCell(7).innerText = new Date(produto.data_cadastro).toLocaleDateString('pt-BR');
        row.insertCell(8).innerText = new Date(produto.data_vencimento).toLocaleDateString('pt-BR');
        const actionCell = row.insertCell(9);
        const saidaButton = document.createElement('button');
        saidaButton.innerText = 'Registrar Saída';
        saidaButton.onclick = () => abrirModalSaida(produto);
        actionCell.appendChild(saidaButton);
    });
}

// Função para abrir o modal de saída
function abrirModalSaida(produto) {
    const modal = document.getElementById('saida-modal');
    modal.style.display = 'block';

    document.getElementById('saida-sku').value = produto.sku;
    document.getElementById('saida-descricao').innerText = `Descrição: ${produto.descricao}`;
    document.getElementById('saida-quantidade-atual').innerText = `Quantidade Atual: ${produto.quantidade}`;
    document.getElementById('saida-detalhes').innerText = `
        Tipo: ${produto.tipo}, Unidade: ${produto.unidade}, Grupo: ${produto.grupo}, 
        Fornecedor: ${produto.fornecedor}, Cadastro: ${new Date(produto.data_cadastro).toLocaleDateString('pt-BR')}, 
        Vencimento: ${new Date(produto.data_vencimento).toLocaleDateString('pt-BR')}
    `;
}

// Função para registrar a saída
document.getElementById('saida-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const sku = document.getElementById('saida-sku').value;
    const quantidadeSaida = parseInt(document.getElementById('saida-quantidade').value);
    const responsavel = document.getElementById('saida-responsavel').value;

    dbProdutos.child(sku).once('value', (snapshot) => {
        const produto = snapshot.val();
        const novaQuantidade = produto.quantidade - quantidadeSaida;

        if (novaQuantidade < 0) {
            alert('Quantidade insuficiente em estoque!');
            return;
        }

        // Atualizar a quantidade no banco de dados de produtos
        dbProdutos.child(sku).update({ quantidade: novaQuantidade })
            .then(() => {
                // Registrar a saída no banco de dados de saídas
                const saida = {
                    sku: sku,
                    descricao: produto.descricao,
                    tipo: produto.tipo,
                    unidade: produto.unidade,
                    grupo: produto.grupo,
                    fornecedor: produto.fornecedor,
                    quantidade_saida: quantidadeSaida,
                    responsavel: responsavel,
                    data_cadastro: new Date(produto.data_cadastro).toISOString().split('T')[0],
                    data_vencimento: new Date(produto.data_vencimento).toISOString().split('T')[0],
                    data_saida: new Date().toISOString()
                };
                dbSaidas.push(saida)
                    .then(() => {
                        alert('Saída registrada com sucesso!');
                        document.getElementById('saida-modal').style.display = 'none';
                        consultarDados(); // Atualiza a tabela com os novos dados
                    })
                    .catch(error => {
                        console.error('Erro ao registrar saída:', error);
                        alert('Ocorreu um erro ao registrar a saída. Por favor, tente novamente.');
                    });
            })
            .catch(error => {
                console.error('Erro ao atualizar quantidade:', error);
                alert('Ocorreu um erro ao atualizar a quantidade. Por favor, tente novamente.');
            });
    });
});

// Função para limpar os filtros
function limparFiltros() {
    document.getElementById('sku').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('resultados').innerHTML = '';
}

// Fechar o modal quando o usuário clicar no botão de fechar
document.querySelector('.close').onclick = function() {
    document.getElementById('saida-modal').style.display = 'none';
};

// Fechar o modal quando o usuário clicar fora do modal
window.onclick = function(event) {
    const modal = document.getElementById('saida-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Adicionar eventos aos botões
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('consultar-btn').addEventListener('click', consultarDados);
    document.getElementById('limpar-btn').addEventListener('click', limparFiltros);
    document.getElementById('registro-saida-btn').addEventListener('click', function() {
        window.location.href = 'registroSaida.html';
    });
});

function goHome() {
    window.location.href = './home.html';
}
