var contactosTemp = [];
var direccionesTemp = [];
var direcciones2Temp = [];
var id_tipo_doc;
var id_tipo_persona;
var documento;
var numDirec = 0;
document.addEventListener("DOMContentLoaded", function () {


    preventUpdate();

    llenarListas();

    var agDirBtn = document.getElementById("agregar-dir");
    agDirBtn.addEventListener("click", agregarDireccion);

    var agregarBtn = document.getElementById("agregar-cont");
    agregarBtn.addEventListener("click", agregarContacto);

    var btnReg = document.getElementById("btn-reg");
    btnReg.addEventListener("click", registrarPersona);

    //Verifica si en el div de lista de direcciones se clickea un boton
    var divListaDirec = document.getElementById("form-lista-direcciones");
    divListaDirec.addEventListener("click", function (event) {
        if (event.target && event.target.matches("button.btn-primary")) {
            eliminarDireccionEvt(event.target)
        }
    });

    //Verifica si en el div de lista de contactos se clickea un boton
    var divListaCont = document.getElementById("form-lista-contactos");
    divListaCont.addEventListener("click", function (event) {
        if (event.target && event.target.matches("button.btn-primary")) {
            eliminarContactoEvt(event.target)
        }
    });

});

//Prevenir actualizacion automatica de la pagina al enviar un formulario
function preventUpdate() {
    var formularios = document.querySelectorAll('form');
    formularios.forEach(function (formulario) {
        formulario.addEventListener('submit', function (event) {
            event.preventDefault();
        });
    });
}

//Aqui se implementan los metodos para llenar las listas
function llenarListas() {

    llenarTipoDoc();
    llenarTipoPersona();
    llenarTipoContacto();
    llenarNomenclaturas();
}

function llenarTipoDoc() {
    fetch('/getAllTipoDoc')
        .then(response => response.json())
        .then(data => {
            let tipDocumento = data.tipos;
            tipDocumento.forEach(tipo => {
                let opt = document.createElement("option");
                opt.value = tipo.idTipoDoc;
                opt.text = tipo.descTipoDoc;
                document.getElementById("tipoDoc").appendChild(opt);
            });
        }).catch(error => {
            // Manejo de errores en caso de que la solicitud falle
            console.error('Ha ocurrido un error:', error);
        });
}

function llenarTipoPersona() {
    fetch('/getAllTipoPersona')
        .then(response => response.json())
        .then(data => {
            let tipoPersona = data.tipos;
            tipoPersona.forEach(tipo => {
                let opt = document.createElement("option");
                opt.value = tipo.idTipoPersona;
                opt.text = tipo.descTipoPersona;
                document.getElementById("tipoPersona").appendChild(opt);
            });
        }).catch(error => {
            // Manejo de errores en caso de que la solicitud falle
            console.error('Ha ocurrido un error:', error);
        });
}

function llenarTipoContacto() {
    fetch('/getAllTipoCont')
        .then(response => response.json())
        .then(data => {
            let tipDocumento = data.tipos;
            tipDocumento.forEach(tipo => {
                let opt = document.createElement("option");
                opt.value = tipo.idTipoContacto;
                opt.text = tipo.descTipoContacto;
                document.getElementById("tipo-con").appendChild(opt);
            });
        }).catch(error => {
            // Manejo de errores en caso de que la solicitud falle
            console.error('Ha ocurrido un error:', error);
        });

}


function llenarNomenclaturas() {
    fetch('/getAllNomenclaturas')
        .then(response => response.json())
        .then(data => {
            let tipoVia = data.tipos;
            tipoVia.forEach(tipo => {
                let opt = document.createElement("option");
                opt.value = tipo.idNomen;
                opt.text = tipo.descNomen;
                if(tipo.posicion =='1'){
                    document.getElementById("tipo-via").appendChild(opt);
                }else if(tipo.posicion =='6'){
                    document.getElementById("cuadrante").appendChild(opt);
                }else if(tipo.posicion =='12'){
                    document.getElementById("cuadrante-via-gen").appendChild(opt);
                }else if(tipo.posicion =='13'){
                    document.getElementById("barrio").appendChild(opt);
                }else if(tipo.posicion =='15'){
                    document.getElementById("manzana").appendChild(opt);
                }else if(tipo.posicion =='17'){
                    document.getElementById("urbanizacion").appendChild(opt);
                }else if(tipo.posicion =='19'){
                    document.getElementById("tipo-predio").appendChild(opt);
                }else{
                    document.getElementById("complemento").appendChild(opt);
                }
                
            });
        }).catch(error => {
            // Manejo de errores en caso de que la solicitud falle
            console.error('Ha ocurrido un error:', error);
        });
}


function agregarContacto() {

    var tipoContactoSelect = document.getElementById("tipo-con");
    var tipoContacto = tipoContactoSelect.options[tipoContactoSelect.selectedIndex].text;
    var idTipoContacto = document.getElementById("tipo-con").value;
    var contacto = document.getElementById("desc-con").value;

    if (tipoContacto && contacto) {
        var tabla = document.getElementById("form-lista-contactos").getElementsByTagName('tbody')[0];

        var nuevoContacto = {
            tipoContacto: tipoContacto,
            idTipoContacto: idTipoContacto ,
            descContacto: contacto
        };
        contactosTemp.push(nuevoContacto);

        var fila = tabla.insertRow();
        var celdaTipo = fila.insertCell(0);
        var celdaContacto = fila.insertCell(1);
        var celdaBtn = fila.insertCell(2);

        fila.classList.add("text-center");
        celdaTipo.innerHTML = tipoContacto;
        celdaContacto.innerHTML = contacto;
        celdaBtn.innerHTML = '<button class ="btn btn-primary mb-2"> Quitar </button>';


        document.getElementById("tipo-con").value = "";
        document.getElementById("desc-con").value = "";


        alert('Contacto agregado');
    }

}

function agregarDireccion() {

    numDirec++;

    var formularioDir = document.getElementById("form-direcciones");
    var data = new FormData(formularioDir);
    var flag = true;


    // Iterar sobre los checkboxes y agregar los no marcados al data
    var checkboxes = formularioDir.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (!checkbox.checked) {
            data.append(checkbox.name, "");
        }
    });

    //Consultas que deben hacerse para guardar los componentes

    /*Para listas desplegables tomar el valor seleccionado y luego de la lista traida por la BD buscar la
   nomenclatura para mostrar en la interfaz*/

    //Verificacion campos obligatorios vacios (ver los name del formulario)
    if ((buscarCampo(data, 'tipo-via') == null) || (buscarCampo(data, 'num-via') == '') || (buscarCampo(data, 'num-via-gen') == '') || (buscarCampo(data, 'num-placa') == '')) {
        console.log("hola");

        flag = false;
    }
    if (flag) {
        //Se construye la direccion 
        var direccion = {}
        

        // Obtener el elemento select del tipo-via
        var tipoViaSelect = formularioDir.querySelector('select[name="tipo-via"]');
        // Obtener el valor seleccionado del tipo-via
        direccion.tipoVia = buscarCampo(data, 'tipo-via');
        // Obtener el texto (nomenclatura) del tipo-via seleccionado
        direccion.nomTipoVia = tipoViaSelect.options[tipoViaSelect.selectedIndex].text;
        //ingresamos cada campo como una direccion unica para facilitar el insert
        var nuevaDireccion = {
            posicion: 1,
            idNomen: direccion.tipoVia,
            valor_direc: '',
            numDirec: numDirec
        };

        direcciones2Temp.push(nuevaDireccion);

        direccion.numVia = buscarCampo(data, 'num-via');
        var nuevaDireccion = {
            posicion: 2,
            idNomen: '',
            valor_direc: direccion.numVia,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.letraAso = buscarCampo(data, 'letra-aso');
        var nuevaDireccion = {
            posicion: 3,
            idNomen: '',
            valor_direc: direccion.letraAso,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.bis = buscarCampo(data, 'bis');
        var nuevaDireccion = {
            posicion: 4,
            idNomen: '',
            valor_direc: direccion.bis,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.letraBis = buscarCampo(data, 'letra-bis');
        var nuevaDireccion = {
            posicion: 5,
            idNomen: '',
            valor_direc: direccion.letraBis,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);
        

        //se hace lo mismo que en tipoVia
        var cuadranteSelect = formularioDir.querySelector('select[name="cuadrante"]');
        direccion.cuadVia = buscarCampo(data, 'cuadrante');
        direccion.nomCuadrante = cuadranteSelect.options[cuadranteSelect.selectedIndex].text;
        if(direccion.nomCuadrante == "seleccionar"){
            direccion.nomCuadrante = "";
        }
        var nuevaDireccion = {
            posicion: 6,
            idNomen: direccion.cuadVia,
            valor_direc: '',
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.numViaGen = buscarCampo(data, 'num-via-gen');
        var nuevaDireccion = {
            posicion: 7,
            idNomen: '',
            valor_direc: direccion.numViaGen,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.letraAsoViaGen = buscarCampo(data, 'letra-aso-via-gen');
        var nuevaDireccion = {
            posicion: 8,
            idNomen: '',
            valor_direc: direccion.letraAsoViaGen,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.bisViaGen = buscarCampo(data, 'bis-via-gen');
        var nuevaDireccion = {
            posicion: 9,
            idNomen: '',
            valor_direc: direccion.bisViaGen,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.letraViaGen = buscarCampo(data, 'letra-bis-via-gen');
        var nuevaDireccion = {
            posicion: 10,
            idNomen: '',
            valor_direc: direccion.letraViaGen,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.numPlaca = buscarCampo(data, 'num-placa');
        var nuevaDireccion = {
            posicion: 11,
            idNomen: '',
            valor_direc: direccion.numPlaca,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);
        
        //Cuadrante via generadora
        direccion.cuadViaGen = buscarCampo(data, 'cuadrante-via-gen');
        var cuadranteViaGenSelect = formularioDir.querySelector('select[name="cuadrante-via-gen"]');
        direccion.nomCuadranteViaGen = cuadranteViaGenSelect.options[cuadranteViaGenSelect.selectedIndex].text;
        if(direccion.nomCuadranteViaGen == "seleccionar"){
            direccion.nomCuadranteViaGen = "";
        }
        var nuevaDireccion = {
            posicion: 12,
            idNomen: direccion.cuadViaGen,
            valor_direc: '',
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.barrio = buscarCampo(data, 'barrio');
        var barrioSelect = formularioDir.querySelector('select[name="barrio"]');
        direccion.nomenclaturaBarrio = barrioSelect.options[barrioSelect.selectedIndex].text;
        if(direccion.nomenclaturaBarrio == "seleccionar"){
            direccion.nomenclaturaBarrio = "";
        }
        var nuevaDireccion = {
            posicion: 13,
            idNomen: direccion.barrio,
            valor_direc: '',
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.nomBarrio = buscarCampo(data, 'nom-barrio');
        var nuevaDireccion = {
            posicion: 14,
            idNomen: '',
            valor_direc: direccion.nomBarrio,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.manzana = buscarCampo(data, 'manzana');
        var manzanaSelect = formularioDir.querySelector('select[name="manzana"]');
        direccion.nomenclaturaManzana = manzanaSelect.options[manzanaSelect.selectedIndex].text;
        if(direccion.nomenclaturaManzana == "seleccionar"){
            direccion.nomenclaturaManzana = "";
        }
        var nuevaDireccion = {
            posicion: 15,
            idNomen: direccion.manzana,
            valor_direc: '',
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.idManzana = buscarCampo(data, 'id-manzana');
        var nuevaDireccion = {
            posicion: 16,
            idNomen: '',
            valor_direc: direccion.idManzana,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.tipoUrbanizacion = buscarCampo(data, 'tipo-urbanizacion');
        var urbaSelect = formularioDir.querySelector('select[name="tipo-urbanizacion"]');
        direccion.nomenclaturaTipoUrb = urbaSelect.options[urbaSelect.selectedIndex].text;
        if(direccion.nomenclaturaTipoUrb == "seleccionar"){
            direccion.nomenclaturaTipoUrb = "";
        }
        var nuevaDireccion = {
            posicion: 17,
            idNomen: direccion.tipoUrbanizacion,
            valor_direc: '',
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.nombreUrb = buscarCampo(data, 'nom-urb');
        var nuevaDireccion = {
            posicion: 18,
            idNomen: '',
            valor_direc: direccion.nombreUrb,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.tipoPredio = buscarCampo(data, 'tipo-predio');
        var predioSelect = formularioDir.querySelector('select[name="tipo-predio"]');
        direccion.nomenclaturaTipoPredio = predioSelect.options[predioSelect.selectedIndex].text;
        if(direccion.nomenclaturaTipoPredio == "seleccionar"){
            direccion.nomenclaturaTipoPredio = "";
        }
        var nuevaDireccion = {
            posicion: 19,
            idNomen: direccion.tipoPredio,
            valor_direc: '',
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);

        direccion.idPredio = buscarCampo(data, 'id-predio');
        var nuevaDireccion = {
            posicion: 20,
            idNomen: '',
            valor_direc: direccion.idPredio,
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);


        direccion.complemento = buscarCampo(data, 'complemento');
        var compleSelect = formularioDir.querySelector('select[name="complemento"]');
        direccion.nomenclaturaComplemento = compleSelect.options[compleSelect.selectedIndex].text;
        if(direccion.nomenclaturaComplemento == "seleccionar"){
            direccion.nomenclaturaComplemento = "";
        }
        var nuevaDireccion = {
            posicion: 21,
            idNomen: direccion.complemento,
            valor_direc: '',
            numDirec: numDirec
        };
        direcciones2Temp.push(nuevaDireccion);


        direccionesTemp.push(direccion);
        //Escribir los datos en la tabla de la vista


        var nuevoDiv = document.createElement("div");
        nuevoDiv.classList.add("row", "align-items-center");

        var dirLabel = document.createElement("div");
        dirLabel.classList.add("col-md-10");

        console.log(direccion.numViaGen + " "+ direccion.letraAsoViaGen + " " + direccion.bisViaGen + " " + direccion.letraViaGen + " - " + direccion.numPlaca);
        var contenido = direccion.nomTipoVia + " " + direccion.numVia + " " + direccion.letraAso + " ";
        contenido = contenido + " " + direccion.bis + " " + direccion.letraBis + " " + direccion.nomCuadrante;
        contenido = contenido + " #" + direccion.numViaGen + " "+ direccion.letraAsoViaGen;
        contenido = contenido + " " + direccion.bisViaGen + " " + direccion.letraViaGen + " - " + direccion.numPlaca;
        contenido = contenido + " " + direccion.nomCuadranteViaGen + " " + direccion.nomenclaturaBarrio + " " + direccion.nomBarrio;
        contenido = contenido + " " + direccion.nomenclaturaManzana + " " + direccion.idManzana + " " + direccion.nomenclaturaTipoUrb;
        contenido = contenido + " " + direccion.nombreUrb + " " + direccion.nomenclaturaTipoPredio + " " + direccion.idPredio + " " + direccion.nomenclaturaComplemento;

        dirLabel.innerHTML = "<label>" + contenido + "</label>";

        var btnQuitar = document.createElement("div");
        btnQuitar.classList.add("col-md-2");
        btnQuitar.innerHTML = '<button class ="btn btn-primary mb-2"> Quitar </button>';

        var contenedorDir = document.getElementById("form-lista-direcciones");
        nuevoDiv.appendChild(dirLabel);
        nuevoDiv.appendChild(btnQuitar);

        contenedorDir.appendChild(nuevoDiv);


        alert('direccion agregada');


        resetFormDirecciones(); 
    } else {
        alert("Hay campos sin llenar");
    }

}

//Funcion para buscar el valor de un campo solicitado
function buscarCampo(data, campo) {
    var valorEncontrado = null;
    for (var pair of data.entries()) {
        if (pair[0] === campo) {
            valorEncontrado = pair[1];
            break;
        }
    }
    return valorEncontrado;
}

function eliminarDireccionEvt(btnQuitar) {

    //Encuentra el div padre mas cercano con la clase row
    var direccionDiv = btnQuitar.closest(".row");


    //Indice del div de dirección dentro del contenedor
    var indice = Array.from(direccionDiv.parentNode.children).indexOf(direccionDiv);

    // Elimina el div de dirección del array de direcciones
    direccionesTemp.splice(indice - 1, 1);

    console.log(direccionesTemp);

    // Elimina el div de dirección del contenedor
    direccionDiv.remove();

}

//Eliminar contacto 
function eliminarContactoEvt(btnQuitar) {
    //Encuentra el div padre mas cercano con la clase row
    var direccionDiv = btnQuitar.closest("tbody > tr");


    //Indice del div de dirección dentro del contenedor
    var indice = Array.from(direccionDiv.parentNode.children).indexOf(direccionDiv);

    // Elimina el div de dirección del array de direcciones
    contactosTemp.splice(indice, 1);

    // Elimina el div de dirección del contenedor
    direccionDiv.remove();
}

async function registrarPersona() {
    
    id_tipo_doc= document.getElementById("tipoDoc").value;
    id_tipo_persona = document.getElementById("tipoPersona").value;
    documento = document.getElementById("documento").value;
    var nombre = document.getElementById("nombre").value;
    var apellido = document.getElementById("apellido").value;
   
    console.log(tipoDoc,tipoPersona, documento,nombre,apellido);
    
    const responseInsert = await fetch('/insertarPersona', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_tipo_persona,
                    id_tipo_doc,
                    documento,
                    nombre,
                    apellido
                }),
            });
     
    await registrarContactos();
    await registrarDirecciones();

    direcciones2Temp = [];
    contactosTemp = [];
    direccionesTemp = [];
    numDirec = 0;

    alert("Persona registrada");
    actualizarPagina();
            

}

async function registrarContactos() {
    

    for(let i=0;i<contactosTemp.length;i++){

        var contactoTemporal = contactosTemp[i];

        

        let id_tipo_contacto = contactoTemporal.idTipoContacto;
        let desc_tipo_contacto = contactoTemporal.tipoContacto;
        let desc_contacto = contactoTemporal.descContacto;

        const responseInsert = await fetch('/insertarContacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_tipo_contacto,
                desc_tipo_contacto,
                id_tipo_persona,
                id_tipo_doc,
                documento,
                desc_contacto
            }),
        });

    }
 

}

async function registrarDirecciones() {
    
    // Crear un nuevo arreglo filtrando las direcciones que deseas conservar
    direcciones2Temp = direcciones2Temp.filter(direccion => direccion.idNomen !== '' || direccion.valor_direc !== '');


    console.log(direcciones2Temp.length);

    for(var i=0;i<direcciones2Temp.length;i++){

        var direccionTemporal = direcciones2Temp[i];

        console.log(i);
        let posicion = direccionTemporal.posicion;
        let nomen = direccionTemporal.idNomen;
        let valor_direc = direccionTemporal.valor_direc;
        let id_direccion = direccionTemporal.numDirec;
        let responseInsert = await fetch('/insertarDireccion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                posicion,
                id_direccion,
                id_tipo_persona,
                id_tipo_doc,
                documento,
                nomen,
                valor_direc
            }),
        });
        console.log("hola");
    }
    
}

//Reiniciar formulario de direcciones
function resetFormDirecciones(){
    var formularioDir = document.getElementById("form-direcciones");
    formularioDir.reset();
}

//Actualizar la pagina
function actualizarPagina(){
    window.location.reload();
}




