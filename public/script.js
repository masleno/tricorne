const socket = io();

socket.on('connect', () => {
    setTimeout(() => {
        document.getElementById('intro-animation').classList.add('hidden');
        document.getElementById('waiting-animation').classList.remove('hidden');
    }, 2000);
});

socket.on('chat-ready', (users) => {
    document.getElementById('waiting-animation').classList.add('hidden');
    document.getElementById('chat').classList.remove('hidden');
    document.getElementById('status').textContent = `Подключено: ${users}/3`;
});

document.getElementById('send-btn').addEventListener('click', () => {
    const msg = document.getElementById('message-input').value;
    socket.emit('message', msg);
    document.getElementById('message-input').value = '';
});

socket.on('message', (msg) => {
    const messages = document.getElementById('messages');
    messages.innerHTML += `<p>${msg}</p>`;
    messages.scrollTop = messages.scrollHeight;
});
