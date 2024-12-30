document.addEventListener('DOMContentLoaded', () => {
    // Masaları oluştur
    createTables();
    
    // Siparişleri yükle ve düzenli olarak güncelle
    loadOrders();
    setInterval(loadOrders, 5000);
});

function createTables() {
    const tablesGrid = document.getElementById('tables-grid');
    const tableCount = 20; // Toplam masa sayısı

    for (let i = 1; i <= tableCount; i++) {
        const tableCard = document.createElement('div');
        tableCard.className = 'table-card';
        tableCard.id = `table-${i}`;
        tableCard.innerHTML = `
            <h3>Masa ${i}</h3>
            <p class="status">Boş</p>
        `;
        tablesGrid.appendChild(tableCard);
    }
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';

    // Masa durumlarını sıfırla
    document.querySelectorAll('.table-card').forEach(table => {
        table.className = 'table-card';
        table.querySelector('.status').textContent = 'Boş';
    });

    // Aktif siparişleri göster
    orders.forEach(order => {
        // Sipariş kartını oluştur
        const orderCard = createOrderCard(order);
        ordersList.appendChild(orderCard);

        // Masa durumunu güncelle
        const tableCard = document.getElementById(`table-${order.tableNumber}`);
        if (tableCard) {
            tableCard.className = 'table-card active';
            tableCard.querySelector('.status').textContent = 'Sipariş Var';
        }
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const items = order.items.map(item => 
        `<li>${item.name} - ${item.price.toFixed(2)} TL</li>`
    ).join('');

    card.innerHTML = `
        <h3>Masa ${order.tableNumber}</h3>
        <p>Sipariş Zamanı: ${new Date(order.timestamp).toLocaleTimeString()}</p>
        <ul>${items}</ul>
        <p><strong>Toplam: ${order.total.toFixed(2)} TL</strong></p>
        <button onclick="completeOrder('${order.timestamp}')">Siparişi Tamamla</button>
    `;

    return card;
}

// Siparişi tamamlama
window.completeOrder = (timestamp) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = orders.filter(order => order.timestamp !== timestamp);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    loadOrders();
};