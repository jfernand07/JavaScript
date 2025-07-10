const appView = document.getElementById('appView');
const notification = document.getElementById('notification');
const toggleDarkMode = document.getElementById('darkModeToggle');
const navButtons = document.querySelectorAll('.nav-btn');

// SPA: cargar vistas
function cargarVista(vista) {
appView.innerHTML = '';
navButtons.forEach(btn => btn.classList.remove('active'));
document.querySelector(`[data-view="${vista}"]`).classList.add('active');

if (vista === 'formulario') {
    renderFormulario();
} else if (vista === 'historial') {
    fetch('./navegacion/historial.html')
    .then(res => res.text())
    .then(html => {
        appView.innerHTML = html;
        cargarHistorial();
    });
}
}

// Renderiza el formulario directamente
function renderFormulario() {
appView.innerHTML = `
    <form id="userForm" class="form-card">
    <label for="name"><i class="fas fa-user"></i> Nombre</label>
    <input type="text" id="name" placeholder="Ingresa tu nombre" required />
    <label for="age"><i class="fas fa-calendar-alt"></i> Edad</label>
    <input type="number" id="age" placeholder="Ingresa tu edad" required min="1" />
    <div class="button-group">
        <button type="submit" id="saveBtn"><i class="fas fa-save"></i> Guardar</button>
        <button type="button" id="clearBtn" class="danger"><i class="fas fa-trash-alt"></i> Limpiar</button>
    </div>
    </form>
    <div id="output" class="card"></div>
    <div id="counter" class="card counter-card"></div>
`;

const form = document.getElementById('userForm');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const outputDiv = document.getElementById('output');
const counterDiv = document.getElementById('counter');
const clearBtn = document.getElementById('clearBtn');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = nameInput.value.trim();
    const edad = ageInput.value.trim();

    if (nombre === '' || edad === '' || isNaN(edad) || parseInt(edad) <= 0) {
    alert("Por favor ingresa un nombre válido y una edad mayor a 0.");
    return;
    }

    localStorage.setItem('nombre', nombre);
    localStorage.setItem('edad', edad);
    await guardarEnDB(nombre, edad);
    mostrarDatos(outputDiv);
    mostrarNotificacion();
    form.reset();
});

clearBtn.addEventListener('click', () => {
    localStorage.clear();
    mostrarDatos(outputDiv);
});

mostrarDatos(outputDiv);
actualizarContador(counterDiv);
}

function mostrarDatos(outputDiv) {
const nombre = localStorage.getItem('nombre');
const edad = localStorage.getItem('edad');
outputDiv.innerHTML = nombre && edad
    ? `<h3><i class="fas fa-id-card"></i> Último dato guardado:</h3>
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Edad:</strong> ${edad}</p>`
    : `<p><i class="fas fa-info-circle"></i> No hay información almacenada.</p>`;
}

function actualizarContador(counterDiv) {
let contador = sessionStorage.getItem('interacciones');
contador = contador ? parseInt(contador) + 1 : 1;
sessionStorage.setItem('interacciones', contador);
counterDiv.innerHTML = `<i class="fas fa-mouse-pointer"></i> Interacciones esta sesión: ${contador}`;
}

// Guardar usuario en json-server
async function guardarEnDB(nombre, edad) {
try {
    await fetch('http://localhost:3000/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, edad: parseInt(edad) })
    });
} catch (error) {
    alert("Error al guardar en db.json. Asegúrate de que json-server esté activo.");
}
}

// Cargar historial con CRUD
function cargarHistorial() {
fetch('http://localhost:3000/usuarios')
    .then(res => res.json())
    .then(usuarios => {
    const lista = document.getElementById('userList');
    if (!usuarios.length) {
        lista.innerHTML = "<li>No hay usuarios registrados.</li>";
        return;
    }

    lista.innerHTML = usuarios.map(usuario => `
        <li>
        <span><strong>${usuario.nombre}</strong> - Edad: ${usuario.edad}</span>
        <div class="crud-actions">
            <button class="edit-btn" data-id="${usuario.id}">Editar</button>
            <button class="delete-btn" data-id="${usuario.id}">Eliminar</button>
        </div>
        </li>
    `).join('');

      // Eventos de editar y eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => eliminarUsuario(btn.dataset.id));
    });
usuarios
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editarUsuario(btn.dataset.id));
    });
    });
}

// Editar usuario
function editarUsuario(id) {
const nuevoNombre = prompt("Nuevo nombre:");
const nuevaEdad = prompt("Nueva edad:");

if (!nuevoNombre || isNaN(nuevaEdad) || parseInt(nuevaEdad) <= 0) {
    alert("Datos inválidos.");
    return;
}

fetch(`http://localhost:3000/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: nuevoNombre.trim(), edad: parseInt(nuevaEdad) })
})
    .then(res => {
    if (!res.ok) throw new Error("Error al editar usuario.");
    cargarHistorial();
    })
    .catch(err => alert("Hubo un error al actualizar."));
}

// Eliminar usuario
function eliminarUsuario(id) {
if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

fetch(`http://localhost:3000/usuarios/${id}`, {
    method: 'DELETE'
})
    .then(res => {
    if (!res.ok) throw new Error("Error al eliminar.");
    cargarHistorial();
    })
    .catch(err => alert("No se pudo eliminar el usuario."));
}

// Notificación visual
function mostrarNotificacion() {
notification.style.display = "block";
setTimeout(() => {
    notification.style.display = "none";
}, 3000);
}

// Modo oscuro
toggleDarkMode.addEventListener('change', () => {
document.body.classList.toggle('dark');
});

// Navegación SPA
navButtons.forEach(btn => {
btn.addEventListener('click', () => {
    const vista = btn.dataset.view;
    cargarVista(vista);
});
});

// Iniciar
document.addEventListener('DOMContentLoaded', () => {
cargarVista('formulario');
});


