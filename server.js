const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let clients = [];

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

app.post('/webhook', (req, res) => {
  const data = req.body;
  const msg = `data: ${JSON.stringify(data)}\n\n`;

  clients.forEach(client => client.write(msg));

  res.status(200).json({ status: 'received' });
});

app.get('/', (req, res) => {
  res.send('Webhook backend running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
