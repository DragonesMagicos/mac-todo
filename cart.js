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

    function renderCart() {
        let content = "<h3>Carrito de Compras</h3>";
        if (cart.length === 0) {
            content += "<p>El carrito está vacío.</p>";
        } else {
            content += `<table class='cart-table'>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>`;
            cart.forEach((item, index) => {
                content += `
                    <tr>
                        <td>${item.name}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>${item.quantity}</td>
                        <td>
                            <button class='increment btn-sm btn-success' data-index='${index}'>+</button>
                            <button class='decrement btn-sm btn-warning' data-index='${index}'>-</button>
                            <button class='remove btn-sm btn-danger' data-index='${index}'>Eliminar</button>
                        </td>
                    </tr>`;
            });
            content += `</tbody>
                        </table>
                        <p class='total'>Total: $${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>`;
        }
        ticketDetails.innerHTML = content;

        // Asociar eventos a los botones dinámicos
        document.querySelectorAll(".increment").forEach(btn => {
            btn.addEventListener("click", function () {
                modifyItem(this.dataset.index, "increment");
            });
        });

        document.querySelectorAll(".decrement").forEach(btn => {
            btn.addEventListener("click", function () {
                modifyItem(this.dataset.index, "decrement");
            });
        });

        document.querySelectorAll(".remove").forEach(btn => {
            btn.addEventListener("click", function () {
                removeItem(this.dataset.index);
            });
        });
    }

    function modifyItem(index, action) {
        if (action === "increment") cart[index].quantity++;
        else if (action === "decrement") cart[index].quantity--;

        if (cart[index].quantity <= 0) cart.splice(index, 1); // Eliminar si la cantidad es 0
        saveCart();
        updateCartCount();
        renderCart();
    }

    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        renderCart();
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

    cartIcon.addEventListener("click", function () {
        renderCart();
        ticketModal.style.display = "block";
    });

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
