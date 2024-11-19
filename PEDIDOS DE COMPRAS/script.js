document.getElementById('homeButton').addEventListener('click', function() {
    window.location.href = './home.html';
});

function adicionarItem() {
    const data = document.getElementById('data').value;
    const numeroPedido = document.getElementById('numeroPedido').value;
    const sku = document.getElementById('sku').value;
    const descricao = document.getElementById('descricao').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const tipo = document.getElementById('tipo').value;
    const valorUnit = parseFloat(document.getElementById('valorUnit').value);
    const total = quantidade * valorUnit;

    const tableBody = document.getElementById('pedidoTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${data}</td>
        <td>${numeroPedido}</td>
        <td>${sku}</td>
        <td>${descricao}</td>
        <td>${quantidade}</td>
        <td>${tipo}</td>
        <td>${valorUnit.toFixed(2)}</td>
        <td>${total.toFixed(2)}</td>
        <td>
            <button class="acaoButton" onclick="editarLinha(this)">Editar</button>
            <button class="acaoButton" onclick="excluirLinha(this)">Excluir</button>
        </td>
    `;

    tableBody.appendChild(newRow);
}

function editarLinha(button) {
    const row = button.parentNode.parentNode;
    document.getElementById('data').value = row.cells[0].innerText;
    document.getElementById('numeroPedido').value = row.cells[1].innerText;
    document.getElementById('sku').value = row.cells[2].innerText;
    document.getElementById('descricao').value = row.cells[3].innerText;
    document.getElementById('quantidade').value = row.cells[4].innerText;
    document.getElementById('tipo').value = row.cells[5].innerText;
    document.getElementById('valorUnit').value = row.cells[6].innerText;
    row.remove();
}

function excluirLinha(button) {
    const row = button.parentNode.parentNode;
    row.remove();
}

function exportarExcel() {
    alert('Função de exportar para Excel ainda não implementada.');
}

function exportarPDF() {
    alert('Função de exportar para PDF ainda não implementada.');
}

function salvar() {
    alert('Dados salvos com sucesso!');
}

function limpar() {
    document.getElementById('pedidoForm').reset();
    document.getElementById('pedidoTableBody').innerHTML = '';
}
