const carrito = $('#carrito');
const precios = $('#precios');
const contenedorCarrito = $('#lista-carrito tbody');
const vaciarCarritoBtn = $('#vaciar-carrito');
let articulosCarrito = [];
let totalCarrito = 0;



function mostrarProductos(datos) {
    const productos = datos;

    productos.forEach(produ => {
        const card = $('<div class="card"></div>');
        card.html(`
        <img src="${produ.imagen}" class="card-img-top" alt="${produ.nombre}">
        <div class="card-body">
            <h5 class="card-title">${produ.nombre}</h5>
            <p class="card-text">${produ.descripcion}</p>
            <p class="card-text precio">$${produ.precio} <span></span></p>
            <a href="#" class="btn btn-primary agregar-carrito" data-id="${produ.id}">Agregar al carrito</a>
        </div>
    `);
        $('#productos').append(card);
    });
}

cargarEventListeners();

function cargarEventListeners() {
    precios.on('click', agregarProdu);
    carrito.on('click', eliminarProdu);
    vaciarCarritoBtn.on('click', vaciarCarrito);

}

function agregarProdu(e) {
    e.preventDefault();
    if ($(e.target).hasClass('agregar-carrito')) {
        const Produ = e.target.parentElement.parentElement;
        leerDatosProdu(Produ);
    }
}

function leerDatosProdu(Produ) {
    const infoProdu = {
        titulo: $(Produ).find('h4').text(),
        precio: $(Produ).find('.precio span').text(),
        id: $(Produ).find('a').attr('data-id'),
        cantidad: 1
    }


    if (articulosCarrito.some(Produ => Produ.id === infoProdu.id)) {
        const Productos = articulosCarrito.map(Produ => {
            if (Produ.id === infoProdu.id) {
                Produ.cantidad++;
                return Produ;
            } else {
                return Produ;
            }
        })
        articulosCarrito = [...Productos];
    } else {
        articulosCarrito = [...articulosCarrito, infoProdu];
    }

    carritoHTML();
}

function eliminarProdu(e) {
    e.preventDefault();
    if ($(e.target).hasClass('borrar-Produ')) {
        const ProduId = $(e.target).attr('data-id')

        articulosCarrito = articulosCarrito.filter(Produ => Produ.id !== ProduId);

        carritoHTML();
    }
}

function carritoHTML() {
    vaciarCarrito();
    articulosCarrito.forEach((producto) => {
        const row = $('<tr></tr>');
        row.html(`
        <td>${producto.titulo}</td>
        <td>${producto.precio}</td>
        <td>${producto.cantidad}</td>
        <td>
        <a href="#" class="borrar-Produ" data-id="${producto.id}">X</a>
        </td>
    `);
        contenedorCarrito.append(row);
    });
    $('#total-carrito').html(`Total: $${calcularTotal()}`);
}

function vaciarCarrito() {
    contenedorCarrito.empty();
}

function cargarProductos() {
    fetch('Productos.json')
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos);
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

function calcularTotal() {
    let total = 0;
    articulosCarrito.forEach((producto) => {
      total += parseFloat(producto.precio) * producto.cantidad;
    });
    return total.toFixed(2);
}

function agregarProducto(e) {
    e.preventDefault();
    if ($(e.target).hasClass('agregar-producto')) {
        const producto = e.target.parentElement.parentElement;
        leerDatosProducto(producto);
        carritoHTML();
    }
}


vaciarCarritoBtn.on('click', () => {
    articulosCarrito = [];
    carritoHTML();
});