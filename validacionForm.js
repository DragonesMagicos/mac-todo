document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    form.addEventListener("submit", function (event) {
        let isValid = true;
        let errorMessage = "";

        // Validar campo Nombre
        if (nameInput.value.trim() === "") {
            isValid = false;
            errorMessage += "El campo 'Nombre' es obligatorio.\n";
        }

        // Validar campo Email
        if (emailInput.value.trim() === "") {
            isValid = false;
            errorMessage += "El campo 'Correo Electrónico' es obligatorio.\n";
        } else if (!validateEmail(emailInput.value.trim())) {
            isValid = false;
            errorMessage += "El correo electrónico no tiene un formato válido.\n";
        }

        // Validar campo Mensaje
        if (messageInput.value.trim() === "") {
            isValid = false;
            errorMessage += "El campo 'Mensaje' es obligatorio.\n";
        }

        // Mostrar errores o enviar formulario
        if (!isValid) {
            alert(errorMessage);
            event.preventDefault(); // Evitar que se envíe el formulario
        }
    });
});
