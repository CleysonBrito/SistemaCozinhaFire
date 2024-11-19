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

// Referência ao banco de dados de saídas
const dbSaidas = firebase.database().ref('registrosaidas');

// Função para consultar dados de saídas com filtros
function consultarSaidas() {
    const sku = document.getElementById('sku').value.trim().toLowerCase();
    const descricao = document.getElementById('descricao').value.trim().toLowerCase();
    const responsavel = document.getElementById('responsavel').value.trim().toLowerCase();
    const dataInicio = document.getElementById('data-inicio').value;
    const dataFim = document.getElementById('data-fim').value;

    dbSaidas.once('value', (snapshot) => {
        const saidas = snapshot.val();
        const resultados = [];

        for (const key in saidas) {
            if (saidas.hasOwnProperty(key)) {
                const saida = saidas[key];
                const dataSaida = new Date(saida.data_saida);

                const atendeSku = !sku || (saida.sku || '').toLowerCase().includes(sku);
                const atendeDescricao = !descricao || (saida.descricao || '').toLowerCase().includes(descricao);
                const atendeResponsavel = !responsavel || (saida.responsavel || '').toLowerCase().includes(responsavel);
                const atendePeriodo = (!dataInicio || dataSaida >= new Date(dataInicio)) && 
                                      (!dataFim || dataSaida <= new Date(dataFim));

                if (atendeSku && atendeDescricao && atendeResponsavel && atendePeriodo) {
                    resultados.push(saida);
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

    resultados.forEach(saida => {
        const row = tabela.insertRow();

        // Verificação e formatação dos campos
        row.insertCell(0).innerText = saida.sku || 'N/A';
        row.insertCell(1).innerText = saida.quantidade_saida !== undefined && saida.quantidade_saida !== null ? saida.quantidade_saida : 'N/A';
        row.insertCell(2).innerText = saida.responsavel || 'N/A';
        row.insertCell(3).innerText = saida.descricao || 'N/A';
        row.insertCell(4).innerText = saida.data_saida ? new Date(saida.data_saida).toLocaleString('pt-BR') : 'N/A';
        row.insertCell(5).innerText = saida.data_cadastro ? new Date(saida.data_cadastro).toLocaleDateString('pt-BR') : 'N/A';
        row.insertCell(6).innerText = saida.data_vencimento ? new Date(saida.data_vencimento).toLocaleDateString('pt-BR') : 'N/A';
        row.insertCell(7).innerText = saida.grupo || 'N/A';
        row.insertCell(8).innerText = saida.unidade || 'N/A';
        row.insertCell(9).innerText = saida.tipo || 'N/A';
        row.insertCell(10).innerText = saida.fornecedor || 'N/A';
    });
}

// Função para limpar os filtros
function limparFiltros() {
    document.getElementById('sku').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('responsavel').value = '';
    document.getElementById('data-inicio').value = '';
    document.getElementById('data-fim').value = '';
    document.getElementById('resultados').innerHTML = '';
}

// Adicionar eventos aos botões
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('consultar-btn').addEventListener('click', consultarSaidas);
    document.getElementById('limpar-btn').addEventListener('click', limparFiltros);
});

function irParaHome() {
    window.location.href = './home.html';
}