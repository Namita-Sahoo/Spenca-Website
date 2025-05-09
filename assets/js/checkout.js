 // Replace with the logged-in user ID
 const userId = 1;

 // Function to fetch cart items and display them in the checkout
 function loadCartItems() {
     fetch(`/cart/${userId}`)
         .then(response => response.json())
         .then(data => {
             const orderList = document.getElementById('orderList');
             let totalAmount = 0;
             
             data.forEach(item => {
                 const { product_name, price, quantity, image } = item;
                 const total = price * quantity;
                 totalAmount += total;
                 
                 const listItem = document.createElement('li');
                 listItem.innerHTML = `
                     <div class="single-box clearfix">
                         <img src="${image}" alt="${product_name}" style="width: 50px; height: 50px; object-fit: cover;">
                         <h6>${product_name} x ${quantity}</h6>
                         <span>$${total.toFixed(2)}</span>
                     </div>
                 `;
                 orderList.appendChild(listItem);
             });

             // Add Subtotal and Order Total
             const subTotalItem = document.createElement('li');
             subTotalItem.classList.add('sub-total', 'clearfix');
             subTotalItem.innerHTML = `
                 <h6>Sub Total</h6>
                 <span>$${totalAmount.toFixed(2)}</span>
             `;
             orderList.appendChild(subTotalItem);

             const orderTotalItem = document.createElement('li');
             orderTotalItem.classList.add('order-total', 'clearfix');
             orderTotalItem.innerHTML = `
                 <h6>Order Total</h6>
                 <span>$${totalAmount.toFixed(2)}</span>
             `;
             orderList.appendChild(orderTotalItem);
         })
         .catch(error => console.error('Error fetching cart items:', error));
 }

 // Call the function when the page loads
 window.onload = loadCartItems;