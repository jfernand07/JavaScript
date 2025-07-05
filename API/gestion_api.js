const API_URL = "http://localhost:3000/productos";

// Elementos del DOM
const nombreInput = document.getElementById("nomb");
const precioInput = document.getElementById("price");
const imagenInput = document.getElementById("img");
const agregarBtn = document.getElementById("add");
const eliminarBtn = document.getElementById("deleted");
const actualizarBtn = document.getElementById("update");
const contenedorProductos = document.getElementById("products");
const totalProductos = document.getElementById("number");
const cartasContainer = document.getElementById("cartas");

let productoSeleccionadoId = null;

// Función para generar ID string único
function generarId() {
  return Math.random().toString(36).substring(2, 8); // ej: 'f485d1'
}

// Leer productos
function obtenerProductos() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      contenedorProductos.innerHTML = "";
      cartasContainer.innerHTML = "";
      totalProductos.textContent = data.length;

      data.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto-item");
        div.innerHTML = `
          <p><strong>${producto.nombre}</strong> - $${producto.precio}</p>
          <button onclick="seleccionarProducto('${producto.id}', '${producto.nombre}', '${producto.precio}', '${producto.imagen}')">Seleccionar</button>
        `;
        contenedorProductos.appendChild(div);

        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" />
          <h3>${producto.nombre}</h3>
          <p>Precio: $${producto.precio}</p>
          <button class="edit" onclick="editarDesdeCarta('${producto.id}', '${producto.nombre}', '${producto.precio}', '${producto.imagen}')">Actualizar</button>
          <button class="delete" onclick="eliminarDesdeCarta('${producto.id}')">Eliminar</button>
        `;
        cartasContainer.appendChild(card);
      });
    })
    .catch(() => alert("Error al obtener productos"));
}

// Agregar producto
agregarBtn.addEventListener("click", () => {
  const nombre = nombreInput.value.trim();
  const precio = precioInput.value.trim();
  const imagen = imagenInput.value.trim();

  if (!nombre || isNaN(precio) || parseFloat(precio) <= 0 || !imagen) {
    alert("Por favor completa todos los campos correctamente.");
    return;
  }

  const nuevoProducto = {
    id: generarId(), // ID como string
    nombre,
    precio,
    imagen
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoProducto)
  })
    .then(() => {
      limpiarFormulario();
      obtenerProductos();
    })
    .catch(() => alert("Error al agregar producto"));
});

// Actualizar producto
actualizarBtn.addEventListener("click", () => {
  if (!productoSeleccionadoId) {
    alert("Selecciona un producto para actualizar");
    return;
  }

  const nombre = nombreInput.value.trim();
  const precio = precioInput.value.trim();
  const imagen = imagenInput.value.trim();

  if (!nombre || isNaN(precio) || parseFloat(precio) <= 0 || !imagen) {
    alert("Todos los campos son obligatorios para actualizar");
    return;
  }

  const productoActualizado = {
    id: productoSeleccionadoId, // se mantiene el ID existente
    nombre,
    precio,
    imagen
  };

  fetch(`${API_URL}/${productoSeleccionadoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productoActualizado)
  })
    .then(() => {
      productoSeleccionadoId = null;
      limpiarFormulario();
      obtenerProductos();
    })
    .catch(() => alert("Error al actualizar producto"));
});

// Eliminar producto
eliminarBtn.addEventListener("click", () => {
  if (!productoSeleccionadoId) {
    alert("Selecciona un producto para eliminar");
    return;
  }

  fetch(`${API_URL}/${productoSeleccionadoId}`, {
    method: "DELETE"
  })
    .then(() => {
      productoSeleccionadoId = null;
      limpiarFormulario();
      obtenerProductos();
    })
    .catch(() => alert("Error al eliminar producto"));
});

// Seleccionar producto
function seleccionarProducto(id, nombre, precio, imagen) {
  nombreInput.value = nombre;
  precioInput.value = precio;
  imagenInput.value = imagen;
  productoSeleccionadoId = id;
}

function editarDesdeCarta(id, nombre, precio, imagen) {
  seleccionarProducto(id, nombre, precio, imagen);
  alert("Producto cargado en el formulario. Haz clic en 'Actualizar'");
}

function eliminarDesdeCarta(id) {
  if (confirm("¿Estás seguro de eliminar este producto?")) {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    })
      .then(() => obtenerProductos())
      .catch(() => alert("Error al eliminar producto"));
  }
}

function limpiarFormulario() {
  nombreInput.value = "";
  precioInput.value = "";
  imagenInput.value = "";
  productoSeleccionadoId = null;
}

// Inicializar
obtenerProductos();
