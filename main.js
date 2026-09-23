/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */
let transactions = [];
let editingTransactionId = null;

function generateId(){
    return +new Date();
}

const incomeList = document.getElementById('incomeList');
const expenseList = document.getElementById('expenseList');
const transactionForm = document.getElementById('transactionForm');
const transactionTitleInput = document.getElementById('transactionFormTitleInput');
const transactionAmountInput = document.getElementById('transactionFormAmountInput');
const transactionDateInput = document.getElementById('transactionFormDateInput');
const transactionTypeInput = document.getElementById('transactionFormTypeSelect');

const searchInput = document.getElementById('searchTransactionFormTitleInput');

function renderTransactions(data = transactions) {
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';

    const incomeTransactions = data.filter(function(item) {
        return item.type === 'income';
    });

    const expenseTransactions = data.filter(function(item) {
        return item.type === 'expense';
    });

    function createTransactionRow(transaction) {

        const transactionItem = document.createElement('div');
        transactionItem.classList.add('tracker-table__row');
        transactionItem.setAttribute('data-testid', 'transactionItem');

        // TRANSACTION TITLE
        const transactionTitle = document.createElement('div');
        transactionTitle.classList.add('tracker-table__cell', 'tracker-table__transaction');

        const titleElement = document.createElement('h3');
        titleElement.textContent = transaction.title;
        titleElement.setAttribute('data-testid', 'transactionItemTitle');

        transactionTitle.appendChild(titleElement);

        // DATE
        const transactionDate = document.createElement('div');
        transactionDate.classList.add('tracker-table__cell');

        transactionDate.textContent = transaction.date;
        transactionDate.setAttribute('data-testid', 'transactionItemDate');

        // TYPE
        const transactionType = document.createElement('div');
        transactionType.classList.add('tracker-table__cell');
        const typeBadge = document.createElement('span');

        if (transaction.type === 'income') {
            typeBadge.classList.add(
                'tracker-type-badge',
                'tracker-type-badge--income'
            );
            typeBadge.textContent = 'Pemasukan';
        } else {
            typeBadge.classList.add(
                'tracker-type-badge',
                'tracker-type-badge--expense'
            );
            typeBadge.textContent = 'Pengeluaran';
        }

        typeBadge.setAttribute('data-testid', 'transactionItemType');
        transactionType.appendChild(typeBadge);

        // AMOUNT
        const transactionAmount = document.createElement('div');
        transactionAmount.classList.add(
            'tracker-table__cell',
            'tracker-table__amount'
        );
        transactionAmount.textContent = `Rp ${transaction.amount.toLocaleString('id-ID')}`;

        if (transaction.type === 'income') {
            transactionAmount.classList.add(
                'tracker-table__amount--income'
            );
        } else {
            transactionAmount.classList.add(
                'tracker-table__amount--expense'
            );
        }
        transactionAmount.setAttribute(
            'data-testid',
            'transactionItemAmount'
        );

        // ACTIONS
        const transactionActions = document.createElement('div');
        transactionActions.classList.add(
            'tracker-table__cell',
            'tracker-table__actions'
        );

        // UBAH TIPE
        const editTypeButton = document.createElement('button');
        editTypeButton.textContent = 'Ubah Tipe';
        editTypeButton.classList.add('tracker-action-button');

        editTypeButton.setAttribute(
            'data-testid',
            'transactionItemEditTypeButton'
        );

        // EDIT
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('tracker-action-button');

        editButton.setAttribute(
            'data-testid',
            'transactionEditButton'
        );

        // DELETE
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.classList.add(
            'tracker-action-button',
            'tracker-action-button--delete'
        );
        deleteButton.setAttribute(
            'data-testid',
            'transactionItemDeleteButton'
        );
        transactionActions.appendChild(editTypeButton);
        transactionActions.appendChild(editButton);
        transactionActions.appendChild(deleteButton);

        // COMBINE ROW
        transactionItem.appendChild(transactionTitle);
        transactionItem.appendChild(transactionDate);
        transactionItem.appendChild(transactionType);
        transactionItem.appendChild(transactionAmount);
        transactionItem.appendChild(transactionActions);

        // DELETE EVENT
        deleteButton.addEventListener('click', function() {
            transactions = transactions.filter(function(item) {
                return item.id !== transaction.id;
            });
            saveTransactions();
            renderTransactions();
            updateDashboard();
        });

        // CHANGE TYPE EVENT
        editTypeButton.addEventListener('click', function() {
            if (transaction.type === 'income') {
                transaction.type = 'expense';
            } else {
                transaction.type = 'income';
            }
            saveTransactions();
            renderTransactions();
            updateDashboard();
        });

        // EDIT EVENT
        editButton.addEventListener('click', function() {
            editingTransactionId = transaction.id;
            const transactionToEdit = transactions.find(function(item) {
                return item.id === editingTransactionId;
            });

            transactionTitleInput.value = transactionToEdit.title;
            transactionAmountInput.value = transactionToEdit.amount;
            transactionDateInput.value = transactionToEdit.date;
            transactionTypeInput.value = transactionToEdit.type;
        });
        return transactionItem;
    }

    // RENDER INCOME
    for (const transaction of incomeTransactions) {
        const transactionRow = createTransactionRow(transaction);
        incomeList.appendChild(transactionRow);
    }

    // RENDER EXPENSE
    for (const transaction of expenseTransactions) {
        const transactionRow = createTransactionRow(transaction);
        expenseList.appendChild(transactionRow);
    }
}

function updateDashboard() {
    const balanceAmount = document.querySelector('.tracker-summary__balance-amount');
    const totalIncome = document.querySelector('.tracker-summary__stat-amount.tracker-summary__stat-amount--income');
    const totalExpense = document.querySelector('.tracker-summary__stat-amount.tracker-summary__stat-amount--expense');
    let income = 0;
    let expense = 0;
    let balance = 0;

    for (const transaction of transactions){
        if (transaction.type === 'income'){
            income = income + transaction.amount;
        }else if (transaction.type === 'expense'){
            expense = expense + transaction.amount;
        }
    }

    balance = income-expense;

    balanceAmount.textContent = balance;
    totalIncome.textContent = income;
    totalExpense.textContent = expense;
}

function saveTransactions() {
    localStorage.setItem(
        'transactions', 
        JSON.stringify(transactions)
    );
}

function loadTransactions() {
    const data = localStorage.getItem('transactions');

    if (data !== null){
        const parsedData = JSON.parse(data);
        transactions = parsedData;
    }
    renderTransactions();
    updateDashboard();
}
loadTransactions();

transactionForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = transactionTitleInput.value;
    const amount = Number(transactionAmountInput.value);
    const date = transactionDateInput.value;
    const type = transactionTypeInput.value;

    if (title === ''){
            alert('Judul transaksi tidak boleh kosong');
            return;
    }
    if (amount < 1 ){
            alert('Nominal tidak boleh kurang dari 1');
            return;
    }

    if (editingTransactionId !== null) {
        const transactionToEdit = transactions.find(function(item) {
            return item.id === editingTransactionId;
        });
        console.log(transactionToEdit);

        transactionToEdit.title = transactionTitleInput.value;
        transactionToEdit.amount = Number(transactionAmountInput.value);
        transactionToEdit.date = transactionDateInput.value;
        transactionToEdit.type =  transactionTypeInput.value;
        
        saveTransactions();
        renderTransactions();
        updateDashboard();

        const event = new CustomEvent('transactionUpdated', {
            detail : transactionToEdit
        });
            
        transactionForm.dispatchEvent(event);
        

        editingTransactionId = null;

        transactionTitleInput.value = '';
        transactionAmountInput.value = '';
        transactionDateInput.value = '';
        transactionTypeInput.value = 'income';
    } else {
        const transaction = {
            id: generateId(),
            title: title,
            amount: amount,
            date: date,
            type: type
        };

        transactions.push(transaction);
        saveTransactions();
        renderTransactions();
        updateDashboard();

        transactionTitleInput.value = '';
        transactionAmountInput.value = '';
        transactionDateInput.value = '';
        transactionTypeInput.value = 'income';
        }
});

transactionForm.addEventListener('transactionUpdated', function (){
    console.log('transaksi berhasil diperbarui');
});

searchInput.addEventListener('input', function(){
        const searchValue = searchInput.value.toLowerCase();

        const filteredTransactions = transactions.filter(function(item){
            return item.title.toLowerCase().includes(searchValue);
        })
        renderTransactions(filteredTransactions);
});
