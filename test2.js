document.addEventListener("DOMContentLoaded", () => {
    const cartSummary = document.querySelector("#cartSummary")
    const loadDisplay = document.querySelector('.loadDisplay');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartDetails = document.getElementById('cartDetails');
    const cartCountSpan = document.getElementById('cartCount');
    const cartItemsDiv = document.getElementById('cartItems');
    const confirmOrderButton = document.getElementById('confirmOrder');
    const overlay = document.getElementById('overlay');
    const orderConfirmation = document.getElementById('orderConfirmation');
    const orderDetails = document.getElementById('orderDetails');
    const totalPriceSpan = document.getElementById('totalPrice');
    const newOrderButton = document.getElementById('newOrder');
    const cart = {};
    let totalItems = 0;

    cartDetails.style.display ='none';

    document.querySelectorAll('.grid-item').forEach((item) => {
        const cartButton = item.querySelector('.cartButton');
        const counterContainer = item.querySelector('.counterContainer');
        const counterDisplay = item.querySelector('.counterDisplay');
        const plusButton = item.querySelector('.plusButton');
        const minusButton = item.querySelector('.minusButton');

        const itemName = item.getAttribute('data-name');
        const itemPrice = parseFloat(item.getAttribute('data-price'));
        let count = 0;

        // Add to cart button logic
        cartButton.addEventListener('click', () => {
            count = 1;
            cart[itemName] = { name: itemName, price: itemPrice, quantity: count };

            cartButton.style.display = 'none';
            counterContainer.style.display = 'flex';
            counterDisplay.textContent = count;
            loadDisplay.style.display ='none'

                // Add the brown border to the product image
    const productImage = cartButton.closest('article').querySelector('.product');
    productImage.classList.add('brown-border');

            updateCartSummary();

        });

        // Increment item count logic
        plusButton.addEventListener('click', () => {
            count++;
            cart[itemName].quantity = count;
            totalItems++;
            counterDisplay.textContent = count;
            updateCartSummary();
        });

        // Decrement item count logic
        minusButton.addEventListener('click', () => {
            if (count > 1) {
                count--;
                cart[itemName].quantity = count;
                totalItems--;
                counterDisplay.textContent = count;

            } else {
                delete cart[itemName];
                count = 0;
                totalItems--;

                // Reset UI state
                counterContainer.style.display = 'none';
                cartButton.style.display = 'inline';
                const productImage = minusButton.closest('article').querySelector('.product');
                productImage.classList.remove('brown-border')

                if (Object.keys(cart).length === 0) {
                    loadDisplay.style.display = 'block';
                    cartDetails.style.display = 'none';

                }

            }
            updateCartSummary();
        });
    });

    // Confirm order button logic
    confirmOrderButton.addEventListener('click', () => {
        let totalPrice = 0;
        orderDetails.innerHTML = '';
        for (const item of Object.values(cart)) {
            orderDetails.innerHTML += `<p class="detail-space"> <p><span id= "ploy">${item.name}</span>  <span id= "diary">$${(item.quantity * item.price).toFixed(2)}</span></p>  <p id="tale"> <span id= "selection">${item.quantity}x</span>  <span id= "retail">@ $${item.price.toFixed(2)}</span></p></p>`;
            totalPrice += item.quantity * item.price;
        }
        totalPriceSpan.textContent =`$${totalPrice.toFixed(2)}`;

        overlay.style.display = 'block';
        orderConfirmation.style.display = 'block';
    });

    // Start a new order
    newOrderButton.addEventListener('click', () => {
        location.reload();
    });

    // Update cart summary
    function updateCartSummary() {
        totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0); // Calculate total items in cart

        // Calculate the order total (sum of quantity * price for all items)
        const orderTotalValue = Object.values(cart).reduce(
            (total, item) => total + item.quantity * item.price,
            0
        );

        // Display cart details if there are items in the cart
        if (totalItems > 0) {
            emptyCartMessage.style.display = 'none';
            cartDetails.style.display = 'block';
            cartCountSpan.textContent = totalItems;

            // Add a class to indicate the cart has items
            cartSummary.classList.add('has-items');

            // Update the total price in the summary
            const orderTotal = document.querySelector('#orderTotal');
            orderTotal.textContent = `$${orderTotalValue.toFixed(2)}`;

            // Clear the existing cart items div and populate with current cart items
            cartItemsDiv.innerHTML = '';
            for (const item of Object.values(cart)) {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');

                const itemInfo = document.createElement('span');

                const itemName = document.createElement('span');
                const itemDetails = document.createElement('span');

                // Item name and details (quantity, price, total price for the item)
                itemName.textContent = item.name;
                itemDetails.textContent = `${item.quantity}x    @$${item.price.toFixed(2)} : $${(item.quantity * item.price).toFixed(2)}`;

                itemName.classList.add('item-name');
                itemDetails.classList.add('item-details');

                itemInfo.appendChild(itemName);
                itemInfo.appendChild(itemDetails);

                // Remove button with event listener
                const removeButton = document.createElement('button');
                const removeImage = document.createElement('img');
                removeImage.src = '/icon-remove-item.svg';
                removeImage.alt = 'Remove Item';
                removeButton.appendChild(removeImage);

                removeButton.addEventListener('click', () => {
                    removeCartItem(item.name);

                     // Remove item from cart
                    updateCartSummary(); // Update the cart summary
                });


                // Append elements to cart item div
                cartItemDiv.appendChild(itemInfo);
                cartItemDiv.appendChild(removeButton);
                cartItemsDiv.appendChild(cartItemDiv);
            }
        } else {
            // If cart is empty, show the empty cart message
            emptyCartMessage.style.display = 'block';
            cartDetails.style.display = 'none';

            // Remove the class indicating the cart has items
            cartSummary.classList.remove('has-items');
        }
    }

    // Remove an item from the cart
    function removeCartItem(itemName) {
        if (cart[itemName]) {
            totalItems -= cart[itemName].quantity;
            delete cart[itemName];
            updateCartSummary();
    
            // Reset "Add to Cart" button and counter for the removed item
            document.querySelectorAll('.grid-item').forEach((item) => {
                if (item.getAttribute('data-name') === itemName) {
                    const cartButton = item.querySelector('.cartButton');
                    const counterContainer = item.querySelector('.counterContainer');
                    const counterDisplay = item.querySelector('.counterDisplay');
                    const productImage = item.querySelector('.product'); // Find the product image
    
                    cartButton.style.display = 'inline';
                    counterContainer.style.display = 'none';
                    counterDisplay.textContent = '1'; // Reset counter display
    
                    // Remove the border from the product image
                    if (productImage) {
                        productImage.classList.remove('brown-border');
                    }
                }
            });
        }
    
        // If the cart is empty, show the default message
        if (Object.keys(cart).length === 0) {
            loadDisplay.style.display = 'block';
            cartDetails.style.display = 'none';
            cartSummary.classList.remove('has-items');
        }
    }
});
