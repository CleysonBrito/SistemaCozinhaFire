// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDjuoTIoL4CX8KSkWXos1JEYQ9u0KhySmk",
    authDomain: "bancocozinha.firebaseapp.com",
    databaseURL: "https://bancocozinha-default-rtdb.firebaseio.com",
    projectId: "bancocozinha",
    storageBucket: "bancocozinha.appspot.com",
    messagingSenderId: "424572545119",
    appId: "1:424572545119:web:bc20a45001fbac1cbfd3ea",
    measurementId: "G-5J6XFE0H02"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao banco de dados
const db = firebase.database().ref('cadastrodefornecedores');

// Função para salvar os dados no Firebase
document.getElementById('supplier-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário

    // Coleta os dados do formulário
    const formData = {
        cnpj: document.getElementById('cnpj').value,
        razaoSocial: document.getElementById('razao-social').value,
        endereco: document.getElementById('endereco').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cep: document.getElementById('cep').value,
        municipio: document.getElementById('municipio').value,
        uf: document.getElementById('uf').value,
        pais: document.getElementById('pais').value,
        complemento: document.getElementById('complemento').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value
    };

    // Salva os dados no Firebase
    db.push(formData)
        .then(() => {
            alert('Dados enviados com sucesso!');
            document.getElementById('supplier-form').reset(); // Limpa o formulário
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
            alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
        });
});

function goBack() {
    window.history.back(); // Voltar para a página anterior
}
