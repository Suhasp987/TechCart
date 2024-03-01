const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Use CORS middleware
app.use(cors());

// Use body-parser middleware to parse JSON
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/addItemsToCart', async (req, res) => {
    try {
        const { cart_no, product_id } = req.body;
        console.log(cart_no, product_id);
        res.json(`${cart_no} ${product_id} Successfully inserted the Item`);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(5000, () => {
    console.log('app is running');
});
