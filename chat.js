document.addEventListener('DOMContentLoaded', () => {

    const apiKeyInput = document.getElementById('apiKey');
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

        const key = apiKeyInput.value.trim();
        if (!key) {
            appendMessage('System', 'Please enter your OpenAI API key.');
            return;
        }
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: "You are an expert historian of No Man's Fort. Answer questions about its past." },
                        { role: 'user', content: message }
                    ]
                })
            });
            if (!response.ok) {
                appendMessage('System', 'Error: ' + response.statusText);
                return;
            }
            const data = await response.json();
            const reply = data.choices[0].message.content.trim();
            appendMessage('Fort Historian', reply);
        } catch (err) {
            appendMessage('System', 'Request failed');
        }
    });
});
