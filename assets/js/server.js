const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();
app.use(bodyParser.json());
app.use('/assets', express.static('assets'));


// MySQL Connection Setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spenca'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

// Get All Products
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});

// Get Single Product by ID
app.get('/products/:id', (req, res) => {
    const query = 'SELECT * FROM products WHERE product_id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Product not found');
        res.status(200).json(results[0]);
    });
});

// Add Product to Cart
// app.post('/cart', (req, res) => {
//     const { user_id, product_id, quantity } = req.body;
//     const query = 'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ((SELECT carts_id FROM carts WHERE user_id = ?), ?, ?)';
//     db.query(query, [user_id, product_id, quantity], (err) => {
//         if (err) return res.status(500).send(err);
//         res.status(201).send('Product added to cart');
//     });
// });

// Get Cart Items for User
app.get('/cart/:userId', (req, res) => {
    const query = `
        SELECT p.product_id, p.product_name, p.price, ci.quantity, p.image 
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.cart_id = (SELECT carts_id FROM carts WHERE user_id = ?)
    `;
    db.query(query, [req.params.userId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});
// Update Cart Item Quantity
app.post('/cart/update', (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    const query = `
        UPDATE cart_items 
        SET quantity = ? 
        WHERE cart_id = (SELECT carts_id FROM carts WHERE user_id = ?) 
        AND product_id = ?
    `;
    db.query(query, [quantity, user_id, product_id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Quantity updated');
    });
});

// Remove Item from Cart
app.post('/cart/remove', (req, res) => {
    const { user_id, product_id } = req.body;
    const query = `
        DELETE FROM cart_items 
        WHERE cart_id = (SELECT carts_id FROM carts WHERE user_id = ?) 
        AND product_id = ?
    `;
    db.query(query, [user_id, product_id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send('Item removed');
    });
});

// Complete Checkout
app.post('/checkout', (req, res) => {
    const { user_id, total_price } = req.body;

    // Create Order
    const orderQuery = 'INSERT INTO orders (user_id, total_price) VALUES (?, ?)';
    db.query(orderQuery, [user_id, total_price], (err, result) => {
        if (err) return res.status(500).send(err);

        const orderId = result.insertId;

        // Move Cart Items to Order Items
        const itemQuery = `INSERT INTO order_items (order_id, product_id, quantity, price) 
                           SELECT ?, product_id, quantity, price FROM cart_items 
                           WHERE cart_id = (SELECT carts_id FROM carts WHERE user_id = ?)`;

        db.query(itemQuery, [orderId, user_id], (err) => {
            if (err) return res.status(500).send(err);

            // Clear Cart
            const clearCartQuery = 'DELETE FROM cart_items WHERE cart_id = (SELECT carts_id FROM carts WHERE user_id = ?)';
            db.query(clearCartQuery, [user_id], (err) => {
                if (err) return res.status(500).send(err);

                res.status(200).send('Checkout completed successfully');
            });
        });
    });
});


// Get Products with Optional Category Filter (UPDATED)
app.get('/products', (req, res) => {
    const { category } = req.query;
    let query = 'SELECT * FROM products';
    let params = [];

    if (category) {
        query += ' WHERE category = ?';
        params.push(category);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
