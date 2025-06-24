// saludo del sistema

console.log("Gestion de datos y objetos, Sets y Maps")


// productos, objetos 

const productos={
    1: {id: 1, nombre: "Laptop", precio: 1500} ,
    2: {id: 2, nombre: "Mouse", precio: 500} ,
    3: {id: 3, nombre: "Teclado", precio: 700}
};

console.log("Objeto productos:" , productos);

// Set con nombre de productos

const setProductos = new Set(Object.values(productos).map(producto => producto.nombre));
console.log("Set de productos unicos:" , setProductos);


//Map para agregar categorias de productos

const mapProductos = new Map([
    ["Electronica" , "Laptop"],
    ["Accesorios", "Mouse"],
    ["Accesorios","Teclado"]
]);

console.log("Map de productos y categorias:", mapProductos);

//Recorrido de Datos Objeto productos

for (const id in productos){
    console.log(`pradocto ID: ${id}, Detalles:`, productos[id]);
}

// Recorrer Set de productos

for (const producto of setProductos) {
    console.log("producto unico:" , producto);
}

//recorrer el Map

mapProductos.forEach((producto, categoria) => {
    console.log(`categoria: ${categoria}, Producto: ${producto}`);
});


//validaciones
console.log("Pruebas completas de gestion de datos:");
console.log("Lista de productos(Objeto):", productos);
console.log("Lista de productos unicos (set):", setProductos);
console.log("categorias y productos (Map):", mapProductos);