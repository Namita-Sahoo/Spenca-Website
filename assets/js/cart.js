document.addEventListener('DOMContentLoaded', () => {
    const userId = 1;  // Assuming user ID is 1 for this example, ideally fetched from user session

    // Function to load cart items from the server
    const loadCart = () => {
        fetch(`/cart/${userId}`)
            .then(response => response.json())
            .then(cartItems => {
                const cartItemsContainer = document.getElementById('cart-items');
                cartItemsContainer.innerHTML = ''; // Clear existing items

                let totalPrice = 0; // To calculate total price

                cartItems.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td colspan="4" class="prod-column">
                            <div class="column-box">
                                <div class="remove-btn" data-product-id="${item.product_id}">
                                    <i class="fal fa-times"></i>  <!-- Delete icon -->
                                </div>
                                <div class="prod-thumb">
                                    <img src="${item.image}" alt="${item.product_name}">
                                </div>
                                <div class="prod-title">${item.product_name}</div>    
                            </div>
                        </td>
                        <td class="price">$${item.price}</td>
                        <td class="qty">
                            <div class="item-quantity">
                                <input class="quantity-spinner" type="number" value="${item.quantity}" name="quantity" min="1" data-product-id="${item.product_id}">
                            </div>
                        </td>
                        <td class="sub-total" data-product-id="${item.product_id}">$${(item.price * item.quantity).toFixed(2)}</td>
                    `;
                    cartItemsContainer.appendChild(row);

                    // Add subtotal to total price
                    totalPrice += item.price * item.quantity;
                });

                // Update the total price in the UI
                document.getElementById('total-price').innerText = `$${totalPrice.toFixed(2)}`;

                addEventListeners();  // Attach event listeners for quantity change and remove buttons
            })
            .catch(err => console.error('Error fetching cart:', err));
    };

    // Add event listeners for quantity changes and item removal
    const addEventListeners = () => {
        // Handle quantity change
        document.querySelectorAll('.quantity-spinner').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                const newQuantity = parseInt(e.target.value);
                updateQuantity(productId, newQuantity);
            });
        });

        // Handle item removal
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.remove-btn').getAttribute('data-product-id');
                removeFromCart(productId);
            });
        });
    };

    // Update quantity of a cart item
    const updateQuantity = (productId, newQuantity) => {
        fetch('/cart/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, product_id: productId, quantity: newQuantity })
        })
        .then(response => response.json())
        .then(data => loadCart())  // Reload cart after update
        .catch(err => console.error('Error updating quantity:', err));
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        fetch('/cart/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, product_id: productId })
        })
        .then(response => response.json())
        .then(data => loadCart())  // Reload cart after removal
        .catch(err => console.error('Error removing item:', err));
    };

    // Handle checkout
    document.getElementById('checkout-btn').addEventListener('click', () => {
        fetch('/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, total_price: parseFloat(document.getElementById('total-price').innerText.replace('$', '')) })
        })
        .then(response => response.json())
        .then(data => alert('Checkout successful!'))  // Show success message
        .catch(err => console.error('Error during checkout:', err));
    });

    // Initial load of the cart
    loadCart();
});
