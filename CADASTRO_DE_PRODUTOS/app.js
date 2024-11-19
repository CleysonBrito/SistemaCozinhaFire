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

// Função para calcular o valor total
function calcularValorTotal() {
    const quantidade = parseFloat(document.getElementById('quantidade').value);
    const valorUnitario = parseFloat(document.getElementById('valor_unitario').value);
    if (!isNaN(quantidade) && !isNaN(valorUnitario)) {
        const valorTotal = quantidade * valorUnitario;
        document.getElementById('valor_unitario').value = valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('valor_total').value = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        // Armazena os valores numéricos em atributos de dados
        document.getElementById('valor_unitario').setAttribute('data-valor', valorUnitario);
        document.getElementById('valor_total').setAttribute('data-valor', valorTotal);
    }
}

// Adiciona eventos para calcular o valor total quando a quantidade ou o valor unitário mudarem
document.getElementById('quantidade').addEventListener('input', calcularValorTotal);
document.getElementById('valor_unitario').addEventListener('input', calcularValorTotal);

// Função para salvar os dados no Firebase
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário

    // Coleta os dados do formulário
    const formData = {
        sku: document.getElementById('sku').value,
        descricao: document.getElementById('descricao').value,
        tipo: document.getElementById('tipo').value,
        unidade: document.getElementById('unidade').value,
        grupo: document.getElementById('grupo').value,
        quantidade: document.getElementById('quantidade').value,
        valor_unitario: parseFloat(document.getElementById('valor_unitario').getAttribute('data-valor')),
        valor_total: parseFloat(document.getElementById('valor_total').getAttribute('data-valor')),
        fornecedor: document.getElementById('fornecedor').value,
        data_cadastro: document.getElementById('data_cadastro').value,
        data_vencimento: document.getElementById('data_vencimento').value
    };

    // Define a chave personalizada usando o SKU
    const chaveProduto = formData.sku;  // Usando o SKU como chave única

    // Salva os dados no Firebase sem criar identificador aleatório
    db.child(chaveProduto).set(formData)
        .then(() => {
            alert('Dados enviados com sucesso!');
            document.getElementById('product-form').reset(); // Limpa o formulário
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
        });
});

function goBack() {
    window.history.back(); // Voltar para a página anterior
}
