import express from 'express';
import bodyParser from 'body-parser';
import socketIo from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import liveRouter from './routes/live';

const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Now you can handle socket.io events
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 8000;
app.use('/live', liveRouter(io));

server.listen(PORT, function () {
  console.log('Example app listening on port:' + PORT);
});