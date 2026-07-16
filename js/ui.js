const STORAGE_KEY = 'resultUniversityBankClients'; // Key for local storage
// Loads clients from local storage
function loadClientsFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveClientsToStorage(bank) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bank.getAllClients()));
}   

const bank = createBank('Result University Bank', loadClientsFromStorage());

const clientContainer = document.getElementById('clients-container');

function renderClients() {
    const clients = bank.getAllClients();
    clientContainer.innerHTML = ''; // Clear previous content

    clients.forEach(client => {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.dataset.id = client.id;

        card.innerHTML = `
        <p><strong>${client.name}</strong> ${client.id}</p>
        <p>Баланс: ${client.balance} руб.</p>
        <p class="card-message"></p>
        `;

        clientContainer.appendChild(card);
    });
}




const clientSelect = document.getElementById('client-select');
const targetSelect = document.getElementById('target-select');

function renderClientOptions() {
    const clients = bank.getAllClients();
    const optionsHtml = clients
        .map(client => `<option value="${client.id}">${client.name} (ID: ${client.id})</option>`)
        .join('');
    clientSelect.innerHTML = optionsHtml;
    targetSelect.innerHTML = optionsHtml;
}


function updateUi() {
    renderClients();
    renderClientOptions();

}


updateUi(); // Initial render

const addClientBtn = document.getElementById('add-client-btn');
const nameInput = document.getElementById('client-name-input');
const balanceInput = document.getElementById('client-balance-input');

addClientBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const balance = balanceInput.value;

    const result = bank.addClient({ name, balance });

    if (result.success) {
        nameInput.value = '';
        balanceInput.value = '';
        saveClientsToStorage(bank);
        updateUi();
    } else {
        alert(result.message);
    }
});

// Показ/скрытие полей в зависимости от выбранного действия
const actionSelect = document.getElementById('action-select');
const amountField = document.getElementById('amount-field');
const targetField = document.getElementById('target-field');

function updateFieldsVisibility() {
    const action = actionSelect.value;

    amountField.style.display = (action === 'remove') ? 'none' : '';
    targetField.style.display = (action === 'transfer') ? '' : 'none';
}

actionSelect.addEventListener('change', updateFieldsVisibility);
updateFieldsVisibility(); // сразу выставляем правильное состояние при загрузке


// Обработчик кнопки "Применить"

const applyActionBtn = document.getElementById('apply-action-btn');
const amountInput = document.getElementById('amount-input');

function showMessage(clientId, message, success) {
    const card = clientContainer.querySelector(`[data-id="${clientId}"]`);
    if (!card) return; // клиента могли удалить — карточки больше нет
    const messageEl = card.querySelector('.card-message');
    messageEl.textContent = message;
    messageEl.style.color = success ? 'green' : 'red';
}

applyActionBtn.addEventListener('click', () => {
    const clientId = parseInt(clientSelect.value, 10);
    const action = actionSelect.value;
    const amount = parseInt(amountInput.value, 10);
    const targetId = parseInt(targetSelect.value, 10);

    let result;

    switch (action) {
        case 'deposit':
            result = bank.deposit(clientId, amount);
            break;
        case 'withdraw':
            result = bank.withdraw(clientId, amount);
            break;
        case 'transfer':
            result = bank.transfer(clientId, targetId, amount);
            break;
        case 'remove':
            result = bank.removeClient(clientId);
            break;
    }

    saveClientsToStorage(bank);
    updateUi();
    showMessage(clientId, result.message, result.success);
    amountInput.value = ''; // очищаем поле суммы после действия
});


nameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        balanceInput.focus(); // переходим к следующему полю, не отправляем форму
    }
});

balanceInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addClientBtn.click(); // последнее поле — Enter применяет действие
    }
});

const controlPanel = document.getElementById('control-panel');

const panelFields = [clientSelect, actionSelect, amountInput, targetSelect];

function isVisible(el) {
    return el.offsetParent !== null;
}

controlPanel.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();

    const currentIndex = panelFields.indexOf(event.target);
    if (currentIndex === -1) return; // Enter нажали не на одном из полей цепочки

    const nextField = panelFields.slice(currentIndex + 1).find(isVisible);

    if (nextField) {
        nextField.focus();
    } else {
        applyActionBtn.click(); // видимых полей больше нет — применяем действие
    }
});

