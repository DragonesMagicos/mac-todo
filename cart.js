document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM ---
    const productListContainer = document.getElementById('product-list');
    const cartCountSpan = document.getElementById('cart-count');
    const cartIcon = document.getElementById('cart-icon');

    // Carrito Modal
    const ticketModal = document.getElementById('ticket-modal');
    const ticketDetails = document.getElementById('ticket-details');
    const closeModal = document.querySelector('.close');
    const purchaseButton = document.getElementById('purchase-button');

    // Login Modal y Formulario
    const loginModal = document.getElementById('login-modal');
    const customerForm = document.getElementById('customer-form');
    const customerEmailInput = document.getElementById('customer-email');
    const customerNombreInput = document.getElementById('customer-nombre');
    const customerApellidoInput = document.getElementById('customer-apellido');
    const customerDniInput = document.getElementById('customer-dni');
    const closeLoginBtn = document.querySelector('.close-login');

    // --- Variables Globales ---
    const API_BASE_URL = 'http://localhost:8080/api';
    let cart = [];
    let currentUser = null;

    // --- 1. L�gica de Productos ---
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/productos`);
            if (!response.ok) throw new Error('No se pudieron cargar los productos.');
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            productListContainer.innerHTML = '<p class="col-12 text-center">Error al cargar productos. Asegurate de que el servidor backend está corriendo.</p>';
        }
    };

    const renderProducts = (products) => {
        productListContainer.innerHTML = '';
        if (products.length === 0) {
            productListContainer.innerHTML = '<p class="col-12 text-center">No hay productos disponibles. Agrega algunos desde el backend.</p>';
            return;
        }
        products.forEach(product => {
            const productCol = document.createElement('div');
            productCol.className = 'col-md-4 d-flex justify-content-center';
            const card = document.createElement('div');
            card.className = 'card';
            card.style.width = '18rem';
            card.innerHTML = `
                <div class="img-container">
                    <img src="${product.imagenUrl || 'https://placehold.co/400x300/cccccc/ffffff?text=Producto'}" class="card-img-top" alt="${product.nombre}">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.nombre}</h5>
                    <p class="card-text">$${product.precio.toFixed(2)}</p>
                    <p class="card-text"><small>Stock: ${product.stock}</small></p>
                    <button class="btn btn-primary mt-auto add-to-cart" 
                            data-id="${product.id}" 
                            data-nombre="${product.nombre}" 
                            data-precio="${product.precio}">
                        Agregar al carrito
                    </button>
                </div>
            `;
            productCol.appendChild(card);
            productListContainer.appendChild(productCol);
        });
    };

    // --- 2. L�gica del Carrito ---
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
    };

    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    };
    
    const renderCart = () => {
        let content = "<h3>Carrito de Compras</h3>";
        if (cart.length === 0) {
            content += "<p>El carrito está vacío.</p>";
        } else {
            content += `<table class='cart-table'>
                            <thead>
                                <tr><th>Producto</th><th>Precio</th><th>Cantidad</th></tr>
                            </thead>
                            <tbody>`;
            cart.forEach(item => {
                content += `<tr><td>${item.nombre}</td><td>$${item.precio.toFixed(2)}</td><td>${item.quantity}</td></tr>`;
            });
            content += `</tbody></table><p class='total'>Total: $${cart.reduce((total, item) => total + item.precio * item.quantity, 0).toFixed(2)}</p>`;
        }
        ticketDetails.innerHTML = content;
    };

    // --- 3. L�gica de Compra y Login/Registro ---
    const handlePurchase = async () => {
        if (cart.length === 0) {
            alert("El carrito esá vacío.");
            return;
        }

        if (!currentUser) {
            ticketModal.style.display = 'none';
            // Resetea el formulario a su estado inicial antes de mostrarlo
            customerForm.reset();
            customerNombreInput.readOnly = false;
            customerApellidoInput.readOnly = false;
            customerDniInput.readOnly = false;
            loginModal.style.display = 'block';
            return;
        }

        const pedido = {
            cliente: { id: currentUser.id },
            items: cart.map(item => ({
                producto: { id: item.id },
                cantidad: item.quantity
            }))
        };

        try {
            const response = await fetch(`${API_BASE_URL}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en el servidor.');
            }
            const createdOrder = await response.json();
            alert(`¡Compra realizada con éxito por ${currentUser.email}! ID del pedido: ${createdOrder.id}`);
            
            cart = [];
            currentUser = null;
            updateCartCount();
            ticketModal.style.display = 'none';
            fetchProducts();
        } catch (error) {
            console.error('Error al realizar la compra:', error);
            alert(`Error al procesar el pedido: ${error.message}`);
        }
    };

    const checkAndFillCustomerData = async () => {
        const email = customerEmailInput.value;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            customerNombreInput.value = '';
            customerApellidoInput.value = '';
            customerDniInput.value = '';
            customerNombreInput.readOnly = false;
            customerApellidoInput.readOnly = false;
            customerDniInput.readOnly = false;
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/clientes/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });

            if (response.ok) {
                const existingCustomer = await response.json();
                if (existingCustomer.nombre) {
                    customerNombreInput.value = existingCustomer.nombre;
                    customerApellidoInput.value = existingCustomer.apellido;
                    customerDniInput.value = existingCustomer.dni;
                    customerNombreInput.readOnly = true;
                    customerApellidoInput.readOnly = true;
                    customerDniInput.readOnly = true;
                }
            } else {
                customerNombreInput.value = '';
                customerApellidoInput.value = '';
                customerDniInput.value = '';
                customerNombreInput.readOnly = false;
                customerApellidoInput.readOnly = false;
                customerDniInput.readOnly = false;
            }
        } catch (error) {
            console.error('Error al verificar el email del cliente:', error);
            customerNombreInput.readOnly = false;
            customerApellidoInput.readOnly = false;
            customerDniInput.readOnly = false;
        }
    };

    const handleLoginOrRegister = async (event) => {
        event.preventDefault();

        const clienteData = {
            email: customerEmailInput.value,
            nombre: customerNombreInput.value,
            apellido: customerApellidoInput.value,
            dni: customerDniInput.value
        };

        if (!clienteData.email || !clienteData.nombre || !clienteData.apellido || !clienteData.dni) {
            alert('Por favor, completa todos los campos requeridos (*).');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/clientes/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clienteData)
            });

            if (!response.ok) throw new Error('No se pudo procesar el registro/login.');
            
            currentUser = await response.json();
            loginModal.style.display = 'none';
            customerForm.reset();
            handlePurchase();
        } catch (error) {
            console.error('Error en el login/registro:', error);
            alert('Hubo un problema al identificarte. Int�ntalo de nuevo.');
        }
    };

    // --- 4. Manejadores de Eventos ---
    productListContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            event.preventDefault();
            const productData = event.target.dataset;
            const product = {
                id: parseInt(productData.id),
                nombre: productData.nombre,
                precio: parseFloat(productData.precio)
            };
            addToCart(product);
        }
    });

    cartIcon.addEventListener("click", () => {
        renderCart();
        ticketModal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        ticketModal.style.display = "none";
    });
    
    closeLoginBtn.addEventListener("click", () => {
        loginModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === ticketModal) ticketModal.style.display = "none";
        if (event.target === loginModal) loginModal.style.display = "none";
    });

    purchaseButton.addEventListener("click", handlePurchase);
    customerForm.addEventListener("submit", handleLoginOrRegister);
    customerEmailInput.addEventListener('blur', checkAndFillCustomerData);

    // --- Carga Inicial ---
    fetchProducts();
});