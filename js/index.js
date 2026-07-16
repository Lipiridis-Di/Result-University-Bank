
// Банковский модуль через замыкание : приватное состояние clients и публичные методы для работы с ним.
function createBank(bankName, initialClients = []) {
    // Нормализуем начальные данные клиентов.
    let clients = initialClients.map((client) => ({
        id: client.id,
        name: client.name,
        balance: parseInt(client.balance,10) || 0,
    }));
    let nextId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;  // Счётчик для генерации уникальных id клиентов.
  
  

    
    const findClientById = (id) => clients.find((client) => client.id === id); 
    
    return {
        // Получение информации о клиенте
        getInfo(id) {
            const client = findClientById(id);
            if (!client) {
                return { success: false, message: `Ошибка: клиент с id ${id} не найден` };
            }
            const info = `Банк: ${bankName} | Клиент: ${client.name} | ID: ${client.id} | Баланс: ${client.balance} руб.`;
            return {
                success: true,
                message: info,
                bankName,
                id: client.id,
                name: client.name,
                balance: client.balance,
            }; 
        },
        // Получение списка всех клиентов
        getAllClients() {
              return clients.map(client => ({...client}));
            },
           
            // Пополнение баланса
        deposit(id, amount) {
            const client = findClientById(id);
            if (!client) { 
                   return { success: false, message: `Ошибка: клиент с id ${id} не найден`}
              
            }
            if (!Number.isInteger(amount) || amount <= 0) {
            
                return {
                    success: false, message: `Ошибка: некорректная сумма для пополнения`
                };
            }
            client.balance += amount;
                return {
                 success: true, message: `Баланс клиента ${client.name} пополнен на ${amount} руб. Новый баланс: ${client.balance} руб.`
            };
        },
        // Снятие средств
        withdraw(id, amount) {
            const client = findClientById(id);
            if (!client) {
                return { success: false, message: `Ошибка: клиент с id ${id} не найден` };
            }
            if (!Number.isInteger(amount) || amount <= 0) {
                return { success: false, message: `Ошибка: некорректная сумма для снятия` };
            }
             if (client.balance < amount) {
                return { success: false, message: `Ошибка: недостаточно средств` };
            }
            client.balance -= amount;
            return { success: true, message: `Снятие выполнено успешно. Новый баланс: ${client.balance} руб.` };
        },

        // Добавление нового клиента
    addClient({ name, balance }) {
     const normalizedBalance = parseInt(balance, 10) || 0;

    if (normalizedBalance < 0) {
      return { success: false, message: `Ошибка: начальный баланс не может быть отрицательным` };
    }

    const newCient = {
      id: nextId,
      name,
      balance: normalizedBalance,
    };

    clients.push(newCient);
     nextId++;
     return { success: true, message: `Клиент ${name} успешно добавлен в банк ${bankName}. Баланс: ${normalizedBalance} руб.`, client: newCient};
    
  },
            
    
  // удаление клинета из банка 

  removeClient(id) {
    const clientIndex = clients.findIndex((client) => client.id === id);
    if (clientIndex === -1) {
      
      return { success: false, message: `Ошибка: клиент с id ${id} не найден` };
    }
    if (clients[clientIndex].balance !== 0) {
     return { success: false, message: `Ошибка: баланс клиента не равен нулю` };
    }
    const removedClient = clients.splice(clientIndex, 1)[0];
    return { success: true, message: `Клиент ${removedClient.name} успешно удален из банка ${bankName}` };
 },

  // Перевод средств между клиентами
  
  transfer(fromId, toId, amount) {
  const fromClient = findClientById(fromId);
  const toClient = findClientById(toId);

  if (!fromClient) {
    return { success: false, message: `Ошибка: отправитель с id ${fromId} не найден` };
  }

  if (!toClient) {
    return { success: false, message: `Ошибка: получатель с id ${toId} не найден` };
  }

  if (fromId === toId) {
    return { success: false, message: `Ошибка: нельзя перевести деньги самому себе` };
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    return { success: false, message: `Ошибка: сумма перевода должна быть целым числом больше 0` };
  }

  if (fromClient.balance < amount) {
    return { success: false, message: `Ошибка: недостаточно средств у клиента ${fromClient.name}. Текущий баланс: ${fromClient.balance} руб.` };
  }

  fromClient.balance -= amount;
  toClient.balance += amount;

  return { success: true, message: `Перевод выполнен: ${fromClient.name} -> ${toClient.name}, сумма ${amount} руб.` };
  
},

}}



