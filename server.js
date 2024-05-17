import express from 'express';
import { createServer } from 'http'
import { Server } from 'socket.io'
import ejs from 'ejs'
import path from 'path'
import cors from 'cors'
import os from 'os';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(path.dirname('.'), 'public')));
app.use(cors());
app.set('views', path.join(path.dirname('.'), 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
  console.log(`Socket connected: ${socket.id}`);

  socket.emit('previousMessages', messages)

  socket.on('sendMessage', data => {
    console.log('Received message:', data); 
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data);
  });
});


function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
      const iface = interfaces[name].find(net => net.family === 'IPv4' && !net.internal);
      if (iface) {
          return iface.address;
      }
  }

  return 'IP não encontrado';
}
let host = getLocalIP()

app.get('/api/ipv4', async (req, res) => {
  try {
    if (host) {
      res.json({ ipv4: host });
    } else {
      res.status(404).json({ error: 'IPv4 address not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve IPv4 address' });
  }
});

httpServer.listen(3000, host, () => {
  console.log(`Server is running on http://${host}:3000`);
});

//adicionar o IP da maquina no script do chat HTML