const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const keys = require('./credentials.json'); // Файл с ключами сервисного аккаунта

const app = express();
app.use(cors());
app.use(bodyParser.json());

const auth = new google.auth.GoogleAuth({
    keyFile: './credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = '15Ulc43CcQ7p86DPlywaoyDNvJuCMem_9SCC-scixy8I'; // Вставьте ID Google Sheets сюда

async function addOrderToSheet(orderDetails) {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    const orderData = [
        orderDetails.customer.name,
        orderDetails.customer.surname,
        orderDetails.customer.phone,
        orderDetails.customer.email,
        orderDetails.customer.preferredContact,
        JSON.stringify(orderDetails.cart),
        new Date().toLocaleString(),
    ];

    await googleSheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Orders!A:G',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [orderData],
        },
    });
}

let cart = [];

app.post('/add-to-cart', (req, res) => {
    cart.push(req.body);
    res.status(200).send('Товар добавлен в корзину');
});

app.post('/order', async (req, res) => {
    const orderDetails = {
        cart,
        customer: req.body,
    };

    if (!cart.length) {
        return res.status(400).send('Корзина пуста.');
    }

    try {
        await addOrderToSheet(orderDetails);
        cart = []; 
        res.status(200).send('Заказ успешно оформлен');
    } catch (error) {
        console.error('Ошибка при сохранении заказа:', error);
        res.status(500).send('Ошибка при оформлении заказа');
    }
});

app.use(express.static('public')); // Обеспечивает доступ к статическим файлам

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
