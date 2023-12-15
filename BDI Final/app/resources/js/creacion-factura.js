var itemTemp = [];
var itemsFac = [];
var clienteSel = {};
var clientesTemp = [];
var inventariosTemp = [];
var facturaMod = {};
facturaMod.id_tipo_fac = '';
facturaMod.id_fac = '';
var nombre_cargo;
var estado_cargo; 
var tipoFactura;
var codEmpleado;
var cantidadResultado;
var invenAux = '';
var activeUser;

//Variables de factura para luego pasarla a PDF
var listaDetalles=[];
var listaInventario=[];


document.addEventListener("DOMContentLoaded", function () {

    redireccionarUsuario();

    //Toma el id del empleado activo y lo asigna
    codEmpleado = activeUser.codEmpleado; 


    ModificarInterfazCargo();
    complementarInterfaz();
    preventUpdate();

    var agItem = document.getElementById("agregar-item");
    agItem.addEventListener("click", agregarItem);

    //Btn para cerrar sesion
    
    var btnCerrar = document.getElementById("btn-cerrar-sesion");
    btnCerrar.addEventListener("click", cerrarSesion);


    //Btn de accion de factura a modificar 
    var factModVen = document.getElementById("consultar-fact");
    factModVen.addEventListener("click", aceptarFactEvt);

    var factModVen = document.getElementById("consultar-fact2");
    factModVen.addEventListener("click", aceptarFactEvt);

    var buscarCli = document.getElementById("buscar-cliente");
    buscarCli.addEventListener("click", buscarPersonas);

    var totalBtn = document.getElementById("totalBtn");
    totalBtn.addEventListener("click", totalizar);

    var enviarBtn = document.getElementById("enviarBtn");
    enviarBtn.addEventListener("click", enviarFactura);

    //Verifica si en el div de lista de clientes se presiona un boton
    var divListaDirec = document.getElementById("form-lista-cl");
    divListaDirec.addEventListener("click", function (event) {
        if (event.target && event.target.matches("button.btn-primary")) {
            seleccionarPersonEvt(event.target)
        }
    });

    //Verifica si en el div de lista de item se presiona un boton
    var divListaDirec = document.getElementById("form-resumen-factura");
    divListaDirec.addEventListener("click", function (event) {
        if (event.target && event.target.matches("button.btn-danger")) {
            eliminarItemEvt(event.target)
        }
    });
});


//Verificar si hay un usuario activo, de no haber hacer una redirección
function redireccionarUsuario(){
    var u = JSON.parse(localStorage.getItem('usuario'));
    console.log(u);
    if(u==null||u==""){
        alert("Inicie sesión para acceder al sitio");
        window.location.href = '/'; 
    }else{
        if(activeUser==null||activeUser==""){
            activeUser = u;
        }      
    }
}


//Agrega cosas como el nombre y cargo a la interfaz
function complementarInterfaz(){
    activeUser

    let nomUser = document.getElementById("nom-usuario");
    let nomCargo = document.getElementById("cargo-usuario");

    nomUser.innerHTML= darFormato(activeUser.nomEmpleado)+ " "+darFormato(activeUser.apellEmpleado);
    nomCargo.innerHTML= darFormato(activeUser.nomCargo);
}

//Transforma una cadena a la primera en mayuscula y el resto en minuscula, es mas para la vista
function darFormato(cadena){
 return cadena.charAt(0).toUpperCase()+cadena.slice(1).toLowerCase();
}
// Trae el tipo de cargo segun el id
async function getCargo(codEmpleado) {
    
    
        try {
            const response = await fetch('/getCargoLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ id_empleado: codEmpleado }),
            });
    
            const data = await response.json();
            //guarda el nombre y el estado del cargo del que inicio sesion
            nombre_cargo = data.Cargo[0].nomCargo;
            estado_cargo = data.Cargo[0].estadoCargo;
        } catch (error) {
            console.error('Ha ocurrido un error:', error);
            return []; // Devolver un array vacío en caso de error
        }
    
}

//Mostrar y ocultar cosas dependiendo del cargo
async function ModificarInterfazCargo() {


    // recupera el nombre del cargo y el estado del cargo 
    await getCargo(codEmpleado);
    //despues de esto revisar si el estado cargo es 0 para que no lo deje seguir

    //Se asigna el tipo de factura
    await obtenerTipoFacturaAsociada();

    //Si es vendedor mostrar solo lo de venta

    //Si es auxiliar de compras solo lo de compras

    //Si es director devolucion compra

    //Si es representante devolucion compra

    var clases =[];
    if(tipoFactura == "VE"){
        clases = [".vista-auxiliar-de-compras", ".vista-director-comercial", ".vista-representante-de-ventas ", ".devolucion"];
        
    }else if(tipoFactura == "CO"){
        clases = [".vista-vendedor", ".vista-director-comercial", ".vista-representante-de-ventas",".devolucion"];
        
    }else if(tipoFactura == "DV"){
        clases = [".vista-vendedor", ".vista-director-comercial", ".vista-auxiliar-de-compras", ".normal"];
        
    }else if(tipoFactura == "DC"){
        clases = [".vista-vendedor", ".vista-representante-de-ventas", ".vista-auxiliar-de-compras", ".normal"];

    }
    clases.forEach(clase => {
        let elementosOcultar = document.querySelectorAll(clase);
    
        elementosOcultar.forEach(elemento => {
            elemento.classList.add("ocultar");
        });
    });
    //console.log(tipoFactura);
    
}

//Prevenir actualizacion automatica de la pagina al enviar un formulario
function preventUpdate() {
    var formularios = document.querySelectorAll('form');
    formularios.forEach(function (formulario) {
        formulario.addEventListener('submit', function (event) {
            event.preventDefault();
        });
    });
}

async function obtenerTipoFacturaAsociada() {
    var tipo = "";

    switch (nombre_cargo.toLowerCase()) {

        case "vendedor": tipo = "VE"; break;
        case "auxiliar de compras": tipo = "CO"; break;

        case "director comercial": tipo = "DC"; break;
        case "representante de ventas": tipo = "DV"; break;

        case "gerente de ventas": tipo = "DV"; break;
        case "gerente de compras": tipo = "DC"; break;
    }

    tipoFactura = tipo;
}

//funcion cuando de hace una devolucion
async function aceptarFactEvt(btnSel) {

    redireccionarUsuario();
    let tipoFac = tipoFactura;
  
    
    //Campo de la factura a verificar que no esté vacia
    var campo = "";
    var tipoFacAux = '';
    if (tipoFac == "DV") {
        campo = document.getElementById("cod-factura-venta").value;
        tipoFacAux = 'VE';
    } else if (tipoFac == "DC") {
        campo = document.getElementById("cod-factura-compra").value;
        tipoFacAux = 'CO';
    }

    if (campo) {
        //Verificar que la factura existe

        let resultado = await traerFacturaCod(campo, tipoFacAux);
        //Verifica que el resultado de la consulta sea diferente de vacio
        if (resultado.id_tipo_fac != '') {
            //Traer el unico elemento de la lista de resultados
            facturaMod.id = resultado.id_fac;
            facturaMod.tipo = resultado.id_tipo_fac;

            //se escribe en la pagina el nombre del cliente al que pertenece la factura a modificar y se guardan sus datos como persona seleccionada
            var lblCl = document.getElementById("lblCl");
            lblCl.innerHTML = resultado.persona;

            clienteSel.idTipoPersona = resultado.idTipoPersona;
            clienteSel.idTipoDoc = resultado.idTipoDoc;
            clienteSel.nDocumento = resultado.nDocumento;

            //traer todos los detalle factura que corresponden a esa factura
            itemsFac = await traerItemFacMod(facturaMod.id);
            //llenar la pagina con los item de la factura
            actListaItems();

            alert("Factura con codigo: " + facturaMod.id + " seleccionada");
        } else {
            alert("El numero de factura proporcionado no corresponde a ninguna existente");
        }

    } else {
        alert("Campo factura vacio");
    }

}

async function traerFacturaCod(codFactura, tipoFactura) {
    try {
        const response = await fetch('/getCodFact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codFactura, tipoFactura })
        });

        const data = await response.json();
        return data.factura;
    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return null;
    }
}

async function traerFactura(){

    try {
        const response = await fetch('/getFactura');
        const data = await response.json();
        let  f = data.consec[0];

        return f[0];

    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return 0; 
    }
}


async function buscarPersonas() {
    let nomInput = document.getElementById("nomCl").value;
    let tipoP = "";

    //Dependiendo del tipo de factura se traerán proveedores o clientes
    if (tipoFactura == "VE" || tipoFactura == "DV") {
        tipoP = "1";
    }

    if (tipoFactura == "CO" || tipoFactura == "DC") {
        tipoP = "2";
    }
    /*Si es venta o devolución venta traerá solo clientes (1)

    Si es compra o devolución compra traerá solo proveedores (2)*/


    /*Se debe hacer una consulta para traer los clientes que coincidan con nomInput y
    dependiendo del tipo de factura, traiga solo a clientes con el tipo requerido
    
    El tipo requerido en este caso 
    */
    
    if (nomInput.length >= 3) {
        redireccionarUsuario();
        var listaCl = await traerPersonas(nomInput, tipoP);
        

        if (listaCl != null && listaCl.length > 0) {
            //Actualizar la lista con los clientes encontrados
            clientesTemp = listaCl;
            actListaPer(listaCl);
        } else {
            alert("No hay personas encontradas");
        }

    }

    
}

async function traerPersonas(nombre, tipoP) {
    try {
        const response = await fetch('/getPerNomTyp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, tipoP })
        });


        const data = await response.json();
        return data.listaPersonas;

    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return null;
    }
}

function actListaPer(personasResultado) {
    var tabla = document.getElementById("form-lista-cl").getElementsByTagName('tbody')[0];
    limpiarTabla("form-lista-cl");
    
    for (var i = 0; i < personasResultado.length; i++) {

        var fila = tabla.insertRow();
        var celdaNom = fila.insertCell(0);
        var celdaTipo = fila.insertCell(1);
        var celdaBtn = fila.insertCell(2);

        fila.classList.add("text-center");

        celdaNom.innerHTML = personasResultado[i].nombre + " " + personasResultado[i].apellido;
        celdaNom.classList.add("text-center");

        celdaTipo.innerHTML = personasResultado[i].idTipoPersona === '1' ? 'cliente' : personasResultado[i].idTipoPersona === '2' ? 'proveedor' : 'Otro';
        celdaTipo.classList.add("text-center");

        celdaBtn.classList.add("text-center");
        celdaBtn.innerHTML = '<button class ="btn btn-primary mb-2" btn-cl=' + personasResultado[i].nDocumento
            + '> Seleccionar cliente </button>';

    }

}
function actListaItems() {
    var tabla = document.getElementById("form-lista-items").getElementsByTagName('tbody')[0];
    limpiarTabla("form-lista-items");
    for (var i = 0; i < itemsFac.length; i++) {

        var fila = tabla.insertRow();
        var celdaRef = fila.insertCell(0);
        var celdaCan = fila.insertCell(1);
        var celdaNom = fila.insertCell(2);
        

        fila.classList.add("text-center");

        celdaRef.innerHTML = itemsFac[i].refProducto;
        celdaRef.classList.add("text-center");

        celdaCan.innerHTML = itemsFac[i].cantidad;
        celdaCan.classList.add("text-center");

        celdaNom.innerHTML = itemsFac[i].nomProducto;
        celdaNom.classList.add("text-center");


    }

}


//funcion para seleccionar clientes
function seleccionarPersonEvt(btnSel) {
    

    //Encuentra el id del boton, este está asociado con el id del cliente
    var clienteID = btnSel.getAttribute("btn-cl");

    //Se busca el id en el array que ya se mostraba en la pagina
    
    for (var i = 0; i < clientesTemp.length; i++) {
        
        if (clienteID == clientesTemp[i].nDocumento) {
            //Se modifica clienteSel
            clienteSel = clientesTemp[i];

            //De paso se escribe el nombre del cliente en la interfaz
            var lblCl = document.getElementById("lblCl");
            lblCl.innerHTML = clienteSel.nombre + " " + clienteSel.apellido;

            alert("Seleccionado cliente " + clienteSel.nombre);

        }
    }
}


async function agregarItem() {

    redireccionarUsuario();

    var codProd = document.getElementById("cod-producto").value;
    var cantidad = document.getElementById("cant-producto").value;
    var flag = true;

    if (codProd && cantidad && (!isNaN(cantidad)) && cantidad > 0) {

        //Se debe hacer una consulta para traer el precio, categoria y codigo del producto y el nombre(solo es para mostrar) 
        let productoResultado = await traerItems(codProd);
        
        if(productoResultado[0].refProducto != ''){
            
            
            if(tipoFactura == 'DC'||tipoFactura == 'DV'){
                //verificar si el item a agregar esta y la cantidad es menor a la de la lista de item de la factura original
                var flag = verificarListaItemFacMod(productoResultado[0].refProducto, cantidad);
                
            }
            if(flag){

                    //trae la existencia en stock del producto enviado 
                cantidadResultado = await obtenerInventarioProd(productoResultado[0].refProducto);

                /*Si la referencia es igual a la de un producto que ya estaba en la lista se modifica 
                si no se crea otro item*/
                
                if((tipoFactura == 'CO') || (cantidadResultado >= cantidad) ){
                    if (verificarLista(productoResultado)) {
                        if (!verificarItemDuplicado(productoResultado[0].refProducto, cantidad)) {
                            var nuevoItem = {
                                codProd: productoResultado[0].refProducto,
                                catProd: productoResultado[0].idCatProducto, 
                                nomProd: productoResultado[0].nomProducto,
                                cantidad: cantidad,
                                precioUn: productoResultado[0].precio,
                                existencia : cantidadResultado,
                                consecInven : invenAux

                            };
            
                            itemTemp.push(nuevoItem);
                            agregarProdVista(nuevoItem);
                            totalizar();
                            alert('Item agregado. Actualizando total');
                        } else {
                            //Volver a pintar la tabla con las cantidades modificadas
                            limpiarTabla("form-resumen-factura");
                            for (var i = 0; i < itemTemp.length; i++) {
                                agregarProdVista(itemTemp[i]);
                            }
            
                            //alert('Item agregado. Actualizando total');
            
                            totalizar();
                        }
                    } else {
                        alert("Producto no encontrado ingresar");
            
                    }
                }else{
                    alert("Producto insuficiente");
                }
            }else{
                alert("Error el producto que intenta ingresar no se encuentra en la factura a modificar");

            }
        }else{
            alert("Codigo de producto no encontrado en la BD");
        }

        
    }else{
        alert("Error al ingresar los datos");
    }
}

function verificarListaItemFacMod(referencia, cantidad){

    var flag = false;
    for(var i = 0; i<itemsFac.length; i++){
        
        if(referencia == itemsFac[i].refProducto){
            if(cantidad <= itemsFac[i].cantidad){
                invenAux = itemsFac[i].consecInven;
                flag = true;
            }else{
                alert("Error la cantidad supera a la del producto en la factura a modificar");
            }
        }
        
    }
    return flag;


}

//Verifica duplicados en la tabla de items, para solo modificar la cantidad
function verificarItemDuplicado(codProd, cantidad) {
    for (var i = 0; i < itemTemp.length; i++) {
        if (itemTemp[i].codProd == codProd) {
            if (!isNaN(itemTemp[i].cantidad) && !isNaN(cantidad)) {
                if(itemTemp[i].cantidad + cantidad <= cantidadResultado||(tipoFactura == 'CO')){

                    let suma = parseInt(itemTemp[i].cantidad) + parseInt(cantidad);
                    itemTemp[i].cantidad = suma.toString();

                    alert('Item agregado. Actualizando total');
                }else {
                    alert("cantidad insuficiente");
                }
                
            } else {
                alert("Error durante el calculo");
            }

            return true;
        }
    }
    return false;
}

//Actualiza la lista de los productos en la lista visual
function agregarProdVista(nuevoItem) {
    var tabla = document.getElementById("form-resumen-factura").getElementsByTagName('tbody')[0];

    var fila = tabla.insertRow();
    var celdaNom = fila.insertCell(0);
    var celdaCant = fila.insertCell(1);
    var celdaPrecio = fila.insertCell(2);
    var celdaBtn = fila.insertCell(3);


    fila.classList.add("text-center");

    celdaNom.innerHTML = nuevoItem.nomProd;
    celdaNom.classList.add("text-center");

    celdaCant.innerHTML = nuevoItem.cantidad;
    celdaCant.classList.add("text-center");

    celdaPrecio.innerHTML = nuevoItem.precioUn;
    celdaPrecio.classList.add("text-center");

    celdaBtn.classList.add("text-center");
    celdaBtn.innerHTML = '<button class ="btn btn-danger mb-2"> Quitar </button>';


    document.getElementById("cod-producto").value = "";
    document.getElementById("cant-producto").value = "";
}
//trae un item segun su referencia
async function traerItems(ref) {

    try {
        const response = await fetch('/getProdRef', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ref })
        });

        const data = await response.json();
        return data.listaProductos;

    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return null;
    }
}

async function traerItemFacMod(facId){

    try {
        const response = await fetch('/getItemFacMod', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ facId })
        });

        const data = await response.json();
        return data.listaItems;

    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return null;
    }
}

//elimina un item ya ingresado
function eliminarItemEvt(btnQuitar) {
    //Encuentra el div padre mas cercano con la clase row
    var divItem = btnQuitar.closest("tbody > tr");;

    for (var i = 0; i < itemTemp.length; i++) {
        console.log(itemTemp[i]);
    }
    //Indice del div de dirección dentro del contenedor
    var indice = Array.from(divItem.parentNode.children).indexOf(divItem);

    // Elimina el div de dirección del array de direcciones
    itemTemp.splice(indice, 1);


    for (var i = 0; i < itemTemp.length; i++) {
        console.log(itemTemp[i]);
    }
    // Elimina el div de dirección del contenedor
    divItem.remove();
    totalizar();

}

//totaliza la factura
function totalizar() {
    var total = 0;
    for (var i = 0; i < itemTemp.length; i++) {
        total = total + (parseFloat(itemTemp[i].precioUn) * itemTemp[i].cantidad);
    }

    var lblTotal = document.getElementById("lblTotal");
    lblTotal.innerHTML = "Total: " + total;
    return total;
}

//Obtener inventarios con un producto asociado
async function obtenerInventarioProd(refProd) {
    try {
        const response = await fetch('/getExisInvenProd', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refProd })
        });


        const data = await response.json();
        let p = data.producto[0];
        return p[0];

        
    
    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return null;
    }
}


//Limpiar una tabla por nombre
function limpiarTabla(nomTabla) {
    var tabla = document.getElementById(nomTabla).getElementsByTagName('tbody')[0];

    // Eliminar todas las filas de la tabla
    while (tabla.rows.length > 0) {
        tabla.deleteRow(0);
    }
}


//Toma una lista y verifica si está vacia o es null
function verificarLista(lista) {
    if (lista != null && lista.length > 0) {
        return true;
    } else {
        return false;
    }
}


//asiganan todos los elementos de una factura
async function enviarFactura() {
    redireccionarUsuario();
    var factura = {};


    var flag = true;

    factura.tipo = tipoFactura;
    factura.cliente = clienteSel;
    factura.total = totalizar();
    factura.empleado = codEmpleado;


    //Campo de la factura a modificar
    factura.facturaMod = facturaMod;

    //isertar factura y devolver consecutivo del idfactura
    await insertarFactura(factura);
    
    var consec = await traerFactura(); 

    /*Se envian a las rutas como json, hay que colocarle un id de factura provisional pues esta dependerá
     que la insercion de factura sea exitosa en el facade*/

    for (var i = 0; i < itemTemp.length; i++) {
        let detalleFactura = {};
        detalleFactura.tipoFactura = tipoFactura;
        detalleFactura.refProducto = itemTemp[i].codProd;
        detalleFactura.cantidad = itemTemp[i].cantidad;
        detalleFactura.precioU = itemTemp[i].precioUn;
        detalleFactura.nFactura = consec;
        detalleFactura.item = i;
        detalleFactura.existencia = itemTemp[i].existencia;
        detalleFactura.idCatProducto = itemTemp[i].catProd;
        detalleFactura.consecInven = itemTemp[i].consecInven;

        //se insertan los detalle factura
        await insertarDetalleFactura(detalleFactura);
        listaDetalles.push(detalleFactura);

        //Se crea un inventario por detalle factura
        var inventario = crearInventarios(detalleFactura);
        await insertarInventario(inventario);
        listaInventario.push(inventario);
        
    }
    

    alert("Factura creada. Codigo: "+consec);
    crearPDF(consec);
   actualizarPagina();
}
    
async function insertarFactura(factura) {
    try {
        const response = await fetch('/insertarFactura', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ factura })
        });


    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return null;
    }

}
async function insertarDetalleFactura(detalleFactura) {
    try {
        const response = await fetch('/insertarDetalleFactura', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ detalleFactura })
        });


    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return null;
    }

}
async function insertarInventario(inventario) {
    try {
        const response = await fetch('/insertarInventario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inventario })
        });


    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return null;
    }

}

//Se crean inventarios con el detalle factura asociado
function crearInventarios(detalleFactura) {

    let entran = "";
    let salen = "";
    let existencia = "";
    console.log(detalleFactura.tipoFactura);

    switch (detalleFactura.tipoFactura) {
        //Si es tipo 1 es una venta, del inventario saldran items
        case "VE":
            entran = "0";
            salen = detalleFactura.cantidad;
            existencia = parseInt(detalleFactura.existencia) - parseInt(salen);
            break;
        //Si es tipo 2 es una compra, entraran items al inventario
        case "CO":
            entran = detalleFactura.cantidad;
            salen = "0";
            existencia =parseInt(detalleFactura.existencia) + parseInt(entran);
            break;
        //Si es tipo 3 es una devolucion de compra, salen items del inventario,
        // ademas se necesita la referencia al inventario que se modifica
        case "DC":
            entran = "0";

            salen = detalleFactura.cantidad;
            existencia = parseInt(detalleFactura.existencia) - parseInt(salen);

            break;
        //Si es tipo 4 es una devolucion de venta, entran items al inventario, tambien se ocupa la ref del inventario que se modificaria
        case "DV":
            entran = detalleFactura.cantidad;
            salen = "0";
            existencia = parseInt(detalleFactura.existencia) + parseInt(entran);

            break;
    }
    var inventario = {
        entran: entran,
        salen: salen,
        existencia: existencia,
        invenMod: detalleFactura.consecInven,
        idTipoFac : detalleFactura.tipoFactura,
        idCatProducto: detalleFactura.idCatProducto,
        refProducto : detalleFactura.refProducto,
        nFactura : detalleFactura.nFactura,
        item : detalleFactura.item
    };

    return inventario;
}

async function crearPDF(idFact) {
    try {
        const response = await fetch('/generar-pdf-factura', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idFact })
        });

        const data = await response.json();
        return data.msg;

    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return null;
    }
}


//Elimina el elemento en sesion
function cerrarSesion(){
    localStorage.removeItem('usuario');
    console.log("Cerrando sesion");
    window.location.href = '/'; 
}

//Actualizar la pagina
function actualizarPagina(){
    window.location.reload();
}
