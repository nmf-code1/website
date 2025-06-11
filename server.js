const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }
    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
