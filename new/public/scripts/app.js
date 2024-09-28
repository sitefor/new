let cart = [];

// Функция добавления товара в корзину
function addToCart() {
    const product = { name: 'Вышитая рубашка', price: 1000 };
    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    })
    .then(() => alert('Товар добавлен в корзину'))
    .catch((error) => console.error('Ошибка:', error));
}

// Функция отправки заказа
function submitOrder() {
    const order = {
        name: document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        preferredContact: document.getElementById('preferredContact').value,
    };

    fetch('/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Ошибка при оформлении заказа:', error));
}
