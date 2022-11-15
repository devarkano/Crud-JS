'use strict'


// janela de inclusão&exclusão

const openModal = () => document.getElementById('modal').classList.add('active')
const openModal2 = () => document.getElementById('modal2').classList.add('active')

const closeModal2 = () => {
    document.getElementById('modal2').classList.remove('active')
}

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}
// integração com o Local Storage

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_Produto')) ?? []
const setLocalStorage = (dbProduto) => localStorage.setItem("db_Produto", JSON.stringify(dbProduto))

// CRUD - create read update delete

const deleteProduto = (index) => {
    const dbProduto = readProduto()
    dbProduto.splice(index, 1)
    setLocalStorage(dbProduto)
}

const updateProduto = (index, Produto) => {
    const dbProduto = readProduto()
    dbProduto[index] = Produto
    setLocalStorage(dbProduto)
}

const readProduto = () => getLocalStorage()

const createProduto = (Produto) => {
    const dbProduto = getLocalStorage()
    dbProduto.push(Produto)
    setLocalStorage(dbProduto)
}

//validação de campos

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}


//funcionalidade de limpar campos

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('produto').dataset.index = 'new'
}

//funcionalidade de salvar produtos !

const saveProduto = () => {
    if (isValidFields()) {
        const Produto = {    
            produto: document.getElementById('produto').value,
            nome_prod: document.getElementById('nome_prod').value,
            cod_barra: document.getElementById('cod_barra').value,
            saldo_estoque: document.getElementById('saldo_estoque').value,
            preco: document.getElementById('preco').value,
        }
        const index = document.getElementById('produto').dataset.index
        if (index == 'new') {
            createProduto(Produto)
            updateTable()
            closeModal()
        } else {
            updateProduto(index, Produto)
            updateTable()
            closeModal()
        }
    }
}

//Inserção das regras de negocio !

const createRow = (Produto, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${Produto.produto}</td>
        <td>${Produto.nome_prod}</td>
        <td>${Produto.cod_barra}</td>
        <td>${Produto.saldo_estoque}</td>
        <td>${Produto.preco}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableProduto>tbody').appendChild(newRow);
}
// limpar tabela

const clearTable = () => {
    const rows = document.querySelectorAll('#tableProduto>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

// atualizar tablea

const updateTable = () => {
    const dbProduto = readProduto()
    clearTable()
    dbProduto.forEach(createRow)
}
// preencher os campos com os dados determinados 

const fillFields = (Produto) => {
    document.getElementById('produto').value = Produto.produto
    document.getElementById('nome_prod').value = Produto.nome_prod
    document.getElementById('cod_barra').value = Produto.cod_barra
    document.getElementById('saldo_estoque').value = Produto.saldo_estoque
    document.getElementById('preco').value = Produto.preco

    document.getElementById('produto').dataset.index = Produto.index
}


//edição de dados do produto !

const editProduto = (index) => {
    const Produto = readProduto()[index]
    Produto.index = index
    fillFields(Produto)
    openModal()
}

//edição ou deleção de dados cadastrados na tabela

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editProduto(index)
        } else {
            const Produto = readProduto()[index]
            let avisoDelete = document.querySelector('#avisoDelete')

            avisoDelete.textContent = `Deseja realmente excluir o Produtoe ${Produto.nome}`
            openModal2()

// apagar registro
            document.getElementById('apagar').addEventListener('click', () => {
                deleteProduto(index)
                updateTable()
                closeModal2()
            })
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarProduto')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('modalClose2')
    .addEventListener('click', closeModal2)

document.getElementById('salvar')
    .addEventListener('click', saveProduto)

document.querySelector('#tableProduto>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

document.getElementById('cancelar2')
    .addEventListener('click', closeModal2)
