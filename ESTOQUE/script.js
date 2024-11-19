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

// Referência ao banco de dados
const db = firebase.database().ref('cadastroProdutos');

// Função para consultar dados com filtros
function consultarDados() {
    const sku = document.getElementById('sku').value;
    const descricao = document.getElementById('descricao').value;
    const tipo = document.getElementById('tipo').value;
    const grupo = document.getElementById('grupo').value;
    const fornecedor = document.getElementById('fornecedor').value;

    db.once('value', (snapshot) => {
        const produtos = snapshot.val();
        const resultados = [];
        const quantidadePorDescricao = {};

        for (const key in produtos) {
            if (produtos.hasOwnProperty(key)) {
                const produto = produtos[key];
                if ((sku === '' || produto.sku.includes(sku)) &&
                    (descricao === '' || produto.descricao.includes(descricao)) &&
                    (tipo === '' || produto.tipo === tipo) &&
                    (grupo === '' || produto.grupo === grupo) &&
                    (fornecedor === '' || produto.fornecedor.includes(fornecedor))) {
                    resultados.push(produto);
                    if (quantidadePorDescricao[produto.descricao]) {
                        quantidadePorDescricao[produto.descricao] += Number(produto.quantidade);
                    } else {
                        quantidadePorDescricao[produto.descricao] = Number(produto.quantidade);
                    }
                }
            }
        }

        exibirResultados(resultados);
        exibirTotalQuantidade(quantidadePorDescricao);
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
        row.insertCell(7).innerText = produto.data_cadastro;
        row.insertCell(8).innerText = produto.data_vencimento;
        row.insertCell(9).innerText = Number(produto.valor_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        row.insertCell(10).innerText = (Number(produto.valor_unitario) * Number(produto.quantidade)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Adicionar botão de editar
        const editarBtn = document.createElement('button');
        editarBtn.innerText = 'Editar';
        editarBtn.onclick = () => abrirModalEditar(produto);
        const acoesCell = row.insertCell(11);
        acoesCell.appendChild(editarBtn);
    });
}

// Função para exibir a quantidade total de produtos com a mesma descrição
function exibirTotalQuantidade(quantidadePorDescricao) {
    const totalQuantidade = Object.values(quantidadePorDescricao).reduce((acc, curr) => acc + curr, 0);
    const totalQuantidadeElement = document.getElementById('total-quantidade');
    totalQuantidadeElement.innerText = `Total Quantidade: ${totalQuantidade}`;
    if (totalQuantidade <= 10) {
        totalQuantidadeElement.classList.add('total-vermelho');
    } else {
        totalQuantidadeElement.classList.remove('total-vermelho');
    }
}

// Função para limpar os filtros
function limparFiltros() {
    document.getElementById('sku').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('grupo').value = '';
    document.getElementById('fornecedor').value = '';
    document.getElementById('resultados').innerHTML = '';
    document.getElementById('total-quantidade').innerText = '';
    document.getElementById('total-quantidade').classList.remove('total-vermelho');
}

// Função para abrir o modal de edição
function abrirModalEditar(produto) {
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editForm');

    document.getElementById('editSKU').value = produto.sku;
    document.getElementById('editDescricao').value = produto.descricao;
    document.getElementById('editTipo').value = produto.tipo;
    document.getElementById('editUnidade').value = produto.unidade;
    document.getElementById('editGrupo').value = produto.grupo;
    document.getElementById('editQuantidade').value = produto.quantidade;
    document.getElementById('editFornecedor').value = produto.fornecedor;
    document.getElementById('editDataCadastro').value = produto.data_cadastro;
    document.getElementById('editDataVencimento').value = produto.data_vencimento;
    document.getElementById('editValorUnitario').value = produto.valor_unitario;
    document.getElementById('editValorTotal').value = produto.valor_total;

    modal.style.display = "block";

    form.onsubmit = function(event) {
        event.preventDefault();
        salvarEdicao(produto.sku);
    }
}

// Função para salvar a edição
function salvarEdicao(sku) {
    const produtoAtualizado = {
        sku: document.getElementById('editSKU').value,
        descricao: document.getElementById('editDescricao').value,
        tipo: document.getElementById('editTipo').value,
        unidade: document.getElementById('editUnidade').value,
        grupo: document.getElementById('editGrupo').value,
        quantidade: document.getElementById('editQuantidade').value,
        fornecedor: document.getElementById('editFornecedor').value,
        data_cadastro: document.getElementById('editDataCadastro').value,
        data_vencimento: document.getElementById('editDataVencimento').value,
        valor_unitario: document.getElementById('editValorUnitario').value,
        valor_total: document.getElementById('editValorTotal').value
    };

    db.child(sku).update(produtoAtualizado, (error) => {
        if (error) {
            alert("Erro ao atualizar produto: " + error.message);
        } else {
            alert("Produto atualizado com sucesso!");
            fecharModal();
            consultarDados();
        }
    });
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = "none";
}

// Fechar o modal ao clicar no "x"
document.querySelector('.close').onclick = function() {
    fecharModal();
}

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        fecharModal();
    }
}

// Adicionar eventos aos botões
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('consultar-btn').addEventListener('click', consultarDados);
    document.getElementById('limpar-btn').addEventListener('click', limparFiltros);
});

document.getElementById('cadastrar-btn').addEventListener('click', function() {
    window.location.href = 'cadastrodeprodutos.html';
});
