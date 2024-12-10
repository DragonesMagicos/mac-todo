document.addEventListener("DOMContentLoaded", function () {
    const cartCount = document.getElementById("cart-count");
    const cartIcon = document.getElementById("cart-icon");

    // Referencias al modal
    const ticketModal = document.getElementById("ticket-modal");
    const ticketDetails = document.getElementById("ticket-details");
    const closeModal = document.querySelector(".close");
    const purchaseButton = document.getElementById("purchase-button");

    // Inicializar carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        saveCart();
        updateCartCount();
    }

    function showCart() {
        let ticket = "=== Carrito de Compras ===\n\n";
        cart.forEach((item, index) => {
            ticket += `${index + 1}. ${item.name} - $${item.price} x ${item.quantity}\n`;
        });
        ticket += "\nTotal: $" + cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
        ticketDetails.textContent = ticket;

        ticketModal.style.display = "block";
    }

    function modifyItem(index, action) {
        if (action === "increment") cart[index].quantity++;
        else if (action === "decrement") cart[index].quantity--;
        
        if (cart[index].quantity <= 0) cart.splice(index, 1); // Eliminar si la cantidad es 0
        saveCart();
        updateCartCount();
        showCart();
    }

    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        showCart();
    }

    // Inicializar productos y botones
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            addToCart(name, price);
        });
    });

    cartIcon.addEventListener("click", showCart);

    closeModal.addEventListener("click", function () {
        ticketModal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === ticketModal) {
            ticketModal.style.display = "none";
        }
    });

    purchaseButton.addEventListener("click", function () {
        alert("Gracias por tu compra!");
        cart = [];
        saveCart();
        updateCartCount();
        ticketModal.style.display = "none";
    });

    // Inicialización de la interfaz
    updateCartCount();
});
