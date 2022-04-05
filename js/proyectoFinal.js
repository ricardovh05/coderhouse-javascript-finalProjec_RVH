
// Clase constructor para productos de vino
class vinos {
    constructor (id,nombre,viñedo,tipoDeUva,precio){
        this.id = id;
        this.nombre = nombre;
        this.viñedo = viñedo;
        this.tipoDeUva = tipoDeUva;
        this.precio = precio;
    }

}
//Declarando productos
const Obxi = new vinos (1,"Obxi","Bodega de Bothe","Uva Salvador",250)
const Acacholli = new vinos (2,"Acacholli","Bodega de Bothe","Uva Salvador",200)
const Nosotros = new vinos (3,"Nosotros","La Redonda","Uva Ruby",165)
const Pretexto = new vinos (4,"Pretexto","Viñedos Azteca","Uva Merlot",450)
const Misiones = new vinos (5,"Misiones","Los Rosales","Uva Nebbiolo",220)
const Padre = new vinos (6,"Padre e hijo","San Patricio","Uva Cavernet",880)
//Array para el catalogo y carrito vacío
const catalogo = [Obxi,Acacholli,Nosotros,Pretexto,Misiones,Padre]
let carrito = []
const divisa = '$'
const DOMseccionCatalogo = document.getElementById("seccionCatalogo");
const DOMvinosCarrito = document.getElementById("vinosCarrito");
const DOMtotal = document.getElementById("total");
const DOMproductosEnCarrito = document.getElementById("productosEnCarrito")
const DOMbotonVaciar = document.getElementById('boton-vaciar')
const DOMbotonPagar = document.getElementById('pagar')
const DOMbotonPagar2 = document.getElementById('pagar2')

async function obtener() {
    const response = await fetch('./json/productosWine.json')
    return await response.json()
}

obtener().then(productos => {
    productos.forEach((wine) => {
        //Estructura
        const miNodo = document.createElement('div');
        miNodo.classList.add('cajaProducto');
        // Body
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('bodyProducto');
        // Imagen
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('imagen');
        miNodoImagen.setAttribute('src', wine.img);
        // Titulo
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('linkLetter');
        miNodoTitle.textContent = wine.nombre;
         // Viñedo
         const miNodoViñedo = document.createElement('p');
         miNodoViñedo.classList.add('linkLetter');
         miNodoViñedo.textContent = wine.viñedo;
          // Tipo de Uva
        const miNodoTipoDeUva = document.createElement('p');
        miNodoTipoDeUva.classList.add('linkLetter');
        miNodoTipoDeUva.textContent = wine.tipoDeUva;
        // Precio
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('linkLetter');
        miNodoPrecio.textContent = `${divisa}${wine.precio}`;
        // Boton 
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('comprar');
        miNodoBoton.textContent = 'Comprar';
        miNodoBoton.setAttribute('marcador', wine.id);
        miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
        // Insertamos
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoViñedo);
        miNodoCardBody.appendChild(miNodoTipoDeUva);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMseccionCatalogo.appendChild(miNodo);
    })
})


function anyadirProductoAlCarrito(evento) {
    // Añadimos el Nodo a nuestro carrito
    carrito.push(evento.target.getAttribute('marcador'))
    // Actualizamos el carrito 
    llevarProducto();
    guardarCarritoEnLocalStorage();
}


//Busqueda de Existencia para calcular cantidad y comparación de producto de carrito contra catalogo
const llevarProducto = () => {
    obtener().then(productos =>{
    // Vaciamos todo el html
    DOMvinosCarrito.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
        
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = productos.filter((itemBaseDatos) => {
            // ¿Coincide las id? Solo puede existir un caso
            return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
            return itemId === item ? total += 1 : total;
        }, 0);
        // Boton de borrar      
        const miBoton = document.createElement('button');
        miBoton.classList.add('borrar');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('div');
        miNodo.classList.add('cajaProductoCarrito');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio}`;
        DOMvinosCarrito.appendChild(miNodo)

        // Mezclamos nodos
        miNodo.appendChild(miBoton);
        DOMvinosCarrito.appendChild(miNodo);
        // Renderizamos el precio total en el HTML
        DOMtotal.textContent = calcularTotal();
        DOMproductosEnCarrito.textContent = carrito.length            
});
})
}

function borrarItemCarrito(borrar) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = borrar.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    if(carrito.length == 0){
        DOMtotal.textContent = "0.00";
        DOMproductosEnCarrito.textContent = "0";
    }
    // volvemos a renderizar
    llevarProducto();
    guardarCarritoEnLocalStorage();
}
  
  function calcularTotal(){
   // Recorremos el array del carrito
       return carrito.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = catalogo.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        // Los sumamos al total
        return total + miItem[0].precio;
    }, 0).toFixed(2);

}

function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    DOMtotal.textContent = calcularTotal();
    DOMproductosEnCarrito.textContent = carrito.length 
    // Renderizamos los cambios
    llevarProducto();
    // Borra LocalStorage
    localStorage.clear();

}

function guardarCarritoEnLocalStorage () {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const cargarCarritoDeLocalStorage = () => {
    // ¿Existe un carrito previo guardado en LocalStorage?
    carrito = localStorage.getItem('carrito') !== null
    carrito = JSON.parse(localStorage.getItem('carrito')) || [] 
}

function pagarCarrito() {
    
    swal({
        title: "¿Seguro que deseas terminar con tu compra?",
        icon: "warning",
        buttons: ["Seguir Comprando", "Terminar compra"],
        dangerMode: true,
      })
      .then((seguirCompra) => {
                
        if (seguirCompra) {
          swal("¡Gracias por tu compra!", {
            icon: "success",
          });
          vaciarCarrito();
        } else {
          swal("Gracias por seguir comprando");
        }
      });
}

// Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito)
    
DOMbotonPagar.addEventListener('click', () => {

    if( DOMproductosEnCarrito.textContent == 0){

        swal("Favor de seleccionar algún producto",{
            icon: "warning",
        });
    }
    else{pagarCarrito()}

});

DOMbotonPagar2.addEventListener('click', ()=>{
    if( DOMproductosEnCarrito.textContent == 0){

        swal("Favor de seleccionar algún producto",{
            icon: "warning",
        });
    }
    else{
    swal("CLABE: 2466553424236", "Favor de enviar comprobante de pago a: deBarrica@mail.com");
    } vaciarCarrito();
})
// Inicio
cargarCarritoDeLocalStorage();
llevarProducto();