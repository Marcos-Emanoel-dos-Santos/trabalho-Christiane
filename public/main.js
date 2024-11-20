// Conectando ao servidor WebSocket
const socket = io('http://192.168.100.34:3000'); // Substitua pelo domínio do servidor em produção

// Função para atualizar a quantidade de um produto
function updateQuantity(productId, change) {
    const input = document.getElementById(productId);
    let currentValue = parseInt(input.value) || 0;
    currentValue += change;
    if (currentValue < 0) currentValue = 0;
    input.value = currentValue;
}

// Função para coletar o pedido e enviá-lo
function sendOrder() {
    const products = ["lanche", "refrigerante", "chinelo", "sorvete"];
    const order = products.map(product => {
        const quantity = parseInt(document.getElementById(product).value) || 0;
        return { product, quantity };
    }).filter(item => item.quantity > 0); // Filtra apenas os itens com quantidade > 0

    if (order.length === 0) {
        alert("Por favor, selecione pelo menos um item antes de enviar o pedido!");
        return;
    }

    // Envia o pedido via WebSocket
    socket.emit('sendOrder', order);
    alert("Pedido enviado com sucesso!");
}

// Recebe atualizações de pedidos no painel da empresa
socket.on('newOrder', (order) => {
    console.log('Novo pedido recebido:', order);
});
