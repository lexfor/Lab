import { WebSocketServer } from 'ws';

const server = new WebSocketServer({
  port: 8080,
});

export function createServer() {
  let sockets = [];

  server.on('connection', (socket) => {
    sockets.push(socket);

    // When you receive a message, send that message to every socket.
    socket.on('message', (msg) => {
      sockets.forEach((s) => s.send(msg));
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', () => {
      sockets = sockets.filter((s) => s !== socket);
    });
  });
}
