const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir arquivos estáticos da pasta "public"
app.use(express.static('public'));

// Inicializa o servidor na porta 3000
server.listen(3000, () => {
    console.log('Servidor rodando em http://192.168.240.10:3000');
});

// Gerenciar conexões via WebSocket
io.on('connection', (socket) => {
    console.log('Cliente conectado', socket.id);

    // Quando o cliente envia um pedido
    socket.on('sendOrder', (order) => {
        console.log('Pedido recebido:', order);
        // Anexa o ID do socket ao pedido
        const fullOrder = { ...order, clientId: socket.id };
        io.emit('newOrder', fullOrder); // Emite o pedido para o painel
    });

    // Quando o operador marca o pedido como pronto
    socket.on('orderReady', (message) => {
        io.to(message.clientId).emit('orderStatus', { status: 'Seu pedido está pronto!' });
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});
