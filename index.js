
// Банковский модуль через замыкание : приватное состояние clients и публичные методы для работы с ним.
function createBank(bankName, initialClients = []) {
    // Нормализуем начальные данные клиентов.
    let clients = initialClients.map((client) => ({
        id: client.id,
        name: client.name,
        balance: parseInt(client.balance,10) || 0,
    }));

    // Приватная функция поиска клиента по id.
    const findClientById = (id) => clients.find((client) => client.id === id);
    
    return {
        // Получение информации о клиенте
        getInfo(id) {
            const client = findClientById(id);
            if (!client) {
                console.log(`Ошибка: клиент с id ${id} не найден`);
                return;
            }
            const info = `Банк: ${bankName} | Клиент: ${client.name} | ID: ${client.id} | Баланс: ${client.balance} руб.`;
            console.log(info);
            return {
                bankName,
                id: client.id,
                name: client.name,
                balance: client.balance,
            };
        },
           // Пополнение баланса
        deposit(id, amount) {
            const client = findClientById(id);
            if (!client) {
                console.log(`Ошибка: клиент с id ${id} не найден`);
                return;
            }
            if (!Number.isInteger(amount) || amount <= 0) {
                console.log(`Ошибка: некорректная сумма для пополнения`);
                return;
            }
            client.balance += amount;
            console.log(`Баланс клиента ${client.name} пополнен на ${amount} руб. Новый баланс: ${client.balance} руб.`);
            return;
        },
        // Снятие средств
        withdraw(id, amount) {
            const client = findClientById(id);
            if (!client) {
                console.log(`Ошибка: клиент с id ${id} не найден`);
                return;
            }
            if (!Number.isInteger(amount) || amount <= 0) {
                console.log(`Ошибка: некорректная сумма для снятия`);
                return;
            }
            if (client.balance < amount) {
                console.log(`Ошибка: недостаточно средств. Баланс ${client.balance} руб., попытка снять ${amount} руб.`);
                return;
            }
            client.balance -= amount;
            console.log(`Снятие ${amount} руб. выполнено для ${client.name}. Новый баланс: ${client.balance} руб.`);
            
        },

        // Добавление нового клиента
    addClient({ id, name, balance }) {
     if (findClientById(id)) {
      console.log(`Ошибка: клиент с id ${id} уже существует`);
      return;
    }

    const normalizedBalance = parseInt(balance, 10) || 0;

    if (normalizedBalance < 0) {
      console.log(`Ошибка: начальный баланс не может быть отрицательным`);
      return;
    }

    clients.push({
      id,
      name,
      balance: normalizedBalance,
    });

    console.log(
      `Клиент ${name} успешно добавлен в банк "${bankName}". Баланс: ${normalizedBalance} руб.`
    );
  },
            
    
  // удаление клинета из банка 

  removeClient(id) {
    const clientIndex = clients.findIndex((client) => client.id === id);
    if (clientIndex === -1) {
      console.log(`Ошибка: клиент с id ${id} не найден`);
      return;
    }
    if (clients[clientIndex].balance !== 0) {
      console.log(`Ошибка: баланс клиента не равен нулю. Баланс: ${clients[clientIndex].balance} руб.`);
      return;
    }
    const removedClient = clients.splice(clientIndex, 1)[0];
    console.log(`Клиент ${removedClient.name} успешно удалён из банка "${bankName}".`);
 },

  // Перевод средств между клиентами
  
  transfer(fromId, toId, amount) {
  const fromClient = findClientById(fromId);
  const toClient = findClientById(toId);

  if (!fromClient) {
    console.log(`Ошибка: отправитель с id ${fromId} не найден`);
    return;
  }

  if (!toClient) {
    console.log(`Ошибка: получатель с id ${toId} не найден`);
    return;
  }

  if (fromId === toId) {
    console.log(`Ошибка: нельзя перевести деньги самому себе`);
    return;
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    console.log(`Ошибка: сумма перевода должна быть целым числом больше 0`);
    return;
  }

  if (fromClient.balance < amount) {
    console.log(
      `Ошибка: недостаточно средств у клиента ${fromClient.name}. Текущий баланс: ${fromClient.balance} руб.`
    );
    return;
  }

  fromClient.balance -= amount;
  toClient.balance += amount;

  console.log(
    `Перевод выполнен: ${fromClient.name} -> ${toClient.name}, сумма ${amount} руб.`
  );
  console.log(
    `Новый баланс ${fromClient.name}: ${fromClient.balance} руб. | Новый баланс ${toClient.name}: ${toClient.balance} руб.`
  );
},







}
}



// Проверка работы банка
const bank = createBank('Result University Bank', [
  { id: 1, name: 'Максим', balance: 1000 },
  { id: 2, name: 'Анна', balance: 500 },
]);

// Получение информации о клиентах
bank.getInfo(1);
bank.getInfo(2);
bank.getInfo(3);
//пополнение баланса
bank.deposit(1, 1000);
bank.deposit(2, 500);
bank.deposit(3, 1000);

// Снятие средств
bank.withdraw(1, 500);
bank.withdraw(2, 1200); 
bank.withdraw(3, 100);

// Добавление нового клиента
bank.addClient({ id: 3, name: 'Иван', balance: 2000 });
bank.addClient({ id: 1, name: 'Петр', balance: 1500 }); 
bank.addClient({ id: 4, name: 'Светлана', balance: -500 });

// // Удаление клиента
// bank.removeClient(2); // Ошибка: баланс клиента не равен нулю
// bank.withdraw(2, 1000); // Снятие средств для обнуления баланса
// bank.removeClient(2); // Успешное удаление клиента
// bank.removeClient(2); // Ошибка: клиент с id 2 не найден (после удаления)

    // Перевод средств между клиентами
bank.transfer(1, 2, 300);   // успешный перевод
bank.transfer(1, 3, 200);   // если id 3 есть — тоже успех
bank.transfer(2, 2, 100);   // ошибка: самому себе
bank.transfer(2, 4, 100);   // ошибка: получатель не найден
bank.transfer(4, 1, 100);   // ошибка: отправитель не найден
bank.transfer(1, 2, 10000); // ошибка: недостаточно средств
bank.transfer(1, 2, -50);   // ошибка: некорректная сумма