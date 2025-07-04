# **Ferretería Mac-Todo (Proyecto Full-Stack)**

Este es un proyecto de comercio electrónico completo que simula una tienda online para una ferretería. La aplicación cuenta con un frontend interactivo construido con HTML, CSS y JavaScript, y un backend robusto desarrollado con Java y Spring Boot que gestiona los productos, clientes y pedidos a través de una API RESTful.

Nota sobre el Origen del Proyecto: La base del frontend fue desarrollada como parte de un curso anterior de desarrollo web. Para este proyecto de backend, dicha base fue adaptada y modificada significativamente para consumir la API REST, reemplazando la lógica original de localStorage por una comunicación directa con el servidor.

## **✨ Características Principales**

* Catálogo de Productos Dinámico: Los productos se cargan desde la base de datos y se muestran en la página principal.  
* Carrito de Compras: Funcionalidad completa para agregar productos a un carrito de compras que se gestiona en memoria.  
* Sistema de Clientes: Antes de finalizar una compra, el sistema solicita un email para identificar al cliente. Si el cliente no existe, se crea uno nuevo automáticamente.  
* Creación de Pedidos: El sistema valida el stock disponible en tiempo real y, si la compra es exitosa, descuenta los productos del inventario y registra el pedido en la base de datos.  
* Arquitectura desacoplada: El frontend y el backend son dos aplicaciones independientes que se comunican a través de una API REST.

## **💻 Tecnologías Utilizadas**

### **Backend**

* Java 17+  
* Spring Boot 3+: Framework principal para la creación de la API.  
* Spring Data JPA: Para la comunicación con la base de datos y el mapeo objeto-relacional.  
* MySQL: Como sistema de gestión de base de datos.  
* Maven: Para la gestión de dependencias y la construcción del proyecto.

### **Frontend**

* HTML5: Para la estructura de la página.  
* CSS3: Para el diseño y los estilos, incluyendo animaciones y un diseño responsivo.  
* JavaScript (ES6+): Para toda la lógica del lado del cliente, la interactividad y la comunicación con la API. La lógica original que usaba localStorage fue reemplazada por peticiones fetch a la API del backend.  
* Bootstrap 4: Utilizado para componentes de la interfaz y el sistema de rejilla (grid).

### **Herramientas**

* Postman: Para probar los endpoints de la API del backend.  
* IDE: Visual Studio Code o Eclipse con las extensiones de Spring Tools.  
* XAMPP: Para gestionar el servidor de base de datos MySQL de forma sencilla.

## **🚀 Puesta en Marcha del Proyecto**

Para ejecutar este proyecto en tu entorno local, necesitas configurar y ejecutar el backend y el frontend por separado.

### **Requisitos Previos**

* Tener instalado un JDK 17 o superior.  
* Tener instalado Maven.  
* Tener instalado XAMPP o un servidor MySQL.  
* Tener instalado Postman (recomendado para pruebas).  
* Un editor de código como VS Code (con la extensión Live Server) o Eclipse.

### **1\. Configuración del Backend (**ferreteria-api**)**

1. Clonar/Abrir el Proyecto: Abre el proyecto Java/Maven en tu IDE preferido.  
2. Configurar la Base de Datos:  
   * Inicia los servicios de Apache y MySQL en XAMPP.  
   * Ve a phpMyAdmin y crea una nueva base de datos llamada ferreteria\_db.  
   * Asegúrate de que tu archivo src/main/resources/application.properties tenga la configuración correcta:  
     spring.datasource.url=jdbc:mysql://localhost:3306/ferreteria\_db  
     spring.datasource.username=root  
     spring.datasource.password=  
     spring.jpa.hibernate.ddl-auto=update

3. Ejecutar el Backend: Inicia la aplicación Spring Boot desde tu IDE. La consola debería indicar que el servidor se ha iniciado en el puerto 8080.  
4. Poblar la Base de Datos (Opcional pero recomendado): Usa Postman para enviar peticiones POST a http://localhost:8080/api/productos y agregar algunos productos al catálogo.

### **2\. Configuración del Frontend**

1. Abrir la Carpeta: Abre la carpeta que contiene los archivos index.html, styles.css y cart.js en tu editor de código (ej. VS Code).  
2. Iniciar el Servidor: Haz clic derecho sobre el archivo index.html y selecciona "Open with Live Server" (o simplemente abre el archivo en tu navegador).  
3. ¡Listo\! La página web se abrirá en tu navegador y debería cargar los productos que hayas agregado al backend.

## **📝 Endpoints de la API**

La API del backend expone los siguientes endpoints principales:

| Método | URL | Descripción |
| :---- | :---- | :---- |
| GET | /api/productos | Obtiene la lista de todos los productos. |
| GET | /api/productos/{id} | Obtiene un producto por su ID. |
| POST | /api/productos | Crea un nuevo producto. |
| PUT | /api/productos/{id} | Actualiza un producto existente. |
| DELETE | /api/productos/{id} | Elimina un producto. |
| POST | /api/clientes/login | Identifica a un cliente por su email o lo registra si no existe. |
| POST | /api/pedidos | Crea un nuevo pedido para un cliente. |

