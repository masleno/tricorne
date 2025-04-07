const socket = io();

let userIndex = null; // Для хранения индекса текущего пользователя

socket.on('connect', () => {
    setTimeout(() => {
        document.getElementById('intro-animation').classList.add('hidden');
        document.getElementById('waiting-animation').classList.remove('hidden');
    }, 2000);
});

socket.on('chat-ready', (data) => {
    const { users, userIndex: index } = data;
    userIndex = index; // Сохраняем индекс текущего пользователя

    document.getElementById('waiting-animation').classList.add('hidden');
    const chatContainer = document.getElementById('chat-container');
    chatContainer.classList.remove('hidden');
    chatContainer.classList.add('active');

    // Показываем чаты в зависимости от количества пользователей
    for (let i = 1; i <= 3; i++) {
        const chatBox = document.getElementById(`chat${i}`);
        const chatHeader = chatBox.querySelector('.chat-header');
        if (i <= users) {
            chatBox.style.display = 'flex';
            chatHeader.textContent = `Участник ${i}` + (i === userIndex ? ' (Вы)' : '');
        } else {
            chatBox.style.display = 'none';
        }
    }
});

// Привязка событий отправки сообщений для каждого чата
for (let i = 1; i <= 3; i++) {
    const sendBtn = document.getElementById(`send-btn${i}`);
    const input = document.getElementById(`message-input${i}`);

    sendBtn.addEventListener('click', () => {
        const msg = input.value.trim();
        if (msg) {
            socket.emit('message', msg);
            input.value = '';
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
}

// Получение сообщений и отображение во всех чатах
socket.on('message', (data) => {
    const { text, sender } = data;
    for (let i = 1; i <= 3; i++) {
        const messages = document.getElementById(`messages${i}`);
        if (messages.parentElement.style.display !== 'none') {
            const messageElement = document.createElement('p');
            messageElement.classList.add('message');
            messageElement.classList.add(`sender-${sender}`);
            if (sender === userIndex) {
                messageElement.classList.add('self');
            }
            messageElement.textContent = text;
            messages.appendChild(messageElement);
            messages.scrollTop = messages.scrollHeight;
        }
    }
});
