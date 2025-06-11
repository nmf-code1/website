document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('message');
    const chatLog = document.getElementById('chatLog');

    function appendMessage(sender, text) {
        const div = document.createElement('div');
        div.className = 'chat-message';
        div.textContent = `${sender}: ${text}`;
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (!message) return;
        appendMessage('You', message);
        messageInput.value = '';
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            if (!response.ok) {
                const errData = await response.json();
                appendMessage('System', 'Error: ' + (errData.error || response.statusText));
                return;
            }
            const data = await response.json();
            appendMessage('Fort Historian', data.reply);
        } catch (err) {
            appendMessage('System', 'Request failed');
        }
    });
});
