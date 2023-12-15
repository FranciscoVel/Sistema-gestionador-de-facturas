const { Router } = require('express');
const express = require('express');
const path = require('path');
const router = Router();

const DB = require('../config/config.js');


const TipoPersonaFacade = require("../app/controllers/TipoPersonaFacade.js");
const TipoDocFacade = require("../app/controllers/TipoDocFacade.js");
const TipoContactoFacade = require("../app/controllers/TipoContactoFacade.js");
const DireccionFacade = require("../app/controllers/DireccionFacade.js");
const FacturaFacade = require("../app/controllers/FacturaFacade.js");
const InventarioFacade = require("../app/controllers/InventarioFacade.js");
const DetalleFacturaFacade = require("../app/controllers/DetalleFacturaFacade.js");
const PersonaFacade = require('../app/controllers/PersonaFacade.js');

const ProductoFacade = require("../app/controllers/ProductoFacade.js");
const TipoFacturaFacade = require('../app/controllers/TipoFacturaFacade.js');

const CargoFacade = require("../app/controllers/CargoFacade.js");
const NomenclaturaFacade = require('../app/controllers/NomenclaturaFacade.js');
const ContactoFacade = require('../app/controllers/ContactoFacade.js');

const EmpleadoFacade = require('../app/controllers/EmpleadoFacade.js');

//Se usa para mantener una ruta fija a los archivos estaticos (img, css, js)
const staticPath = path.join(__dirname, '../', 'app', 'resources');
router.use(express.static(staticPath));



//Redirección a la pagina principal
router.get('/', (req, res) => {

    const filePath = path.join(__dirname, '../', 'app', 'views', 'index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            // Si hay un error al enviar el archivo
            console.error(err);
            res.status(500).send('Error interno del servidor');
        }
    });
});



//Redirección a la pagina de crear factura
router.get('/crear_factura', (req, res) => {

    const filePath = path.join(__dirname, '../', 'app', 'views', 'funcion', 'formfactura.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            // Si hay un error al enviar el archivo
            console.error(err);
            res.status(500).send('Error interno del servidor');
        }
    });
});


//Redirección a la pagina de crear personas
router.get('/crear_persona', (req, res) => {

    const filePath = path.join(__dirname, '../', 'app', 'views', 'funcion', 'formCreacionPer.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            // Si hay un error al enviar el archivo
            console.error(err);
            res.status(500).send('Error interno del servidor');
        }
    });
});


//Redirección a la pagina de ver personas
router.get('/ver_personas', (req, res) => {
    const filePath = path.join(__dirname, '../', 'app', 'views', 'funcion', 'formVerPer.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            // Si hay un error al enviar el archivo
            console.error(err);
            res.status(500).send('Error interno del servidor');
        }
    });
});

//Ruta para tener todos los tipos de persona
router.get('/getAllTipoPersona', async (req, res) => {
    tipoPersonaFacade = new TipoPersonaFacade();
    let tipos = await tipoPersonaFacade.selectAll();

    res.json({ tipos });
});


//Ruta para obtener todos los tipos de cargo
router.get('/getAllCargo', async (req, res) => {
        
    cargoFacade = new CargoFacade();

   let listaCargos = await cargoFacade.
   ctAllCargo();

   res.json({ listaCargos });
});

//Ruta para obtener una persona segun un codigo
router.post('/getEmpleadoCod', async (req, res) => {
        
    const{codEmp} = req.body;

    empleadoFacade = new EmpleadoFacade();
    
    //Estabamos agregando el codigo del facade

    let listaEmpleados = await empleadoFacade.selectByCod(codEmp);

    res.json({ listaEmpleados });
});

//post que genera el pdf
router.post('/generar-pdf-factura', async (req, res) => {
        
    const{idFact} = req.body;
    facturaFacade = new FacturaFacade();

    let msg = await facturaFacade.generarPDF(idFact);

    res.json({ msg});
});


//Ruta para tener todos los tipos de documento
router.get('/getAllTipoDoc', async (req, res) => {

    tipoDocFacade = new TipoDocFacade();
    let tipos = await tipoDocFacade.selectAll();
    
    res.json({ tipos });
});

//Ruta para tener todas las nomenclaturas
router.get('/getAllNomenclaturas', async (req, res) => {

    nomenclaturaFacade = new NomenclaturaFacade();
    let tipos = await nomenclaturaFacade.selectAll();
    
    res.json({ tipos });
});


//Ruta para tener todos los tipos de contacto
router.get('/getAllTipoCont', async (req, res) => {
    tipoContactoFacade = new TipoContactoFacade();
    let tipos = await tipoContactoFacade.selectAll();

    res.json({ tipos });
});

//Ruta para obtener el cargo del empleado registrado
router.post('/getCargoLogin', async (req, res) => {
    try {
        const { id_empleado } = req.body;
        cargoFacade = new CargoFacade();
        let Cargo = await cargoFacade.selectCargo({ id_empleado });
        res.json({ Cargo });
    } catch (error) {
        console.error('Error en la consulta a la base de datos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Ruta para obtener una factura con codigo especifico
router.post('/getCodFact', async (req, res) => {
        
    const{codFactura, tipoFactura} = req.body;

    facturaFacade = new FacturaFacade();
    let factura = await facturaFacade.selectCodFactura(codFactura, tipoFactura);
    res.json({ factura });
});



//Ruta para obtener personas con un nombre y tipo de persona
router.post('/getPerNomTyp', async (req, res) => {
        
    const{nombre, tipoP} = req.body;

    personaFacade = new PersonaFacade();


    let listaPersonas = await personaFacade.selNameTypePersona(nombre,tipoP);
    res.json({ listaPersonas });
});

//Ruta para obtener items con un numero de factura
router.post('/getItemFacMod', async (req, res) => {
        
    const{facId} = req.body;

    let detalleFacturaFacade = new DetalleFacturaFacade();

    let listaItems = await detalleFacturaFacade.selectItems(facId);
    res.json({ listaItems });
});

//Ruta para obtener productos con un numero de referencia
router.post('/getProdRef', async (req, res) => {
        
    const{ref} = req.body;

    productoFacade = new ProductoFacade();

    let listaProductos = await productoFacade.selProductoRef(ref);

    res.json({ listaProductos });
});

//Ruta para obtener la cantidad en stock de un producto
router.post('/getExisInvenProd', async (req, res) => {
        
    const{refProd} = req.body;

    inventarioFacade = new InventarioFacade();
    let producto = await inventarioFacade.selExisInvenProd(refProd);

    res.json({ producto });
});

//Ruta para obtener todos los tipos de factura
router.get('/getAllTipoFac', async (req, res) => {
        

    tipoFacturaFacade = new TipoFacturaFacade();

    let listaTipos = await tipoFacturaFacade.selectAll();

    res.json({ listaTipos });
});

//obtiene el consecutivo de la ultima factura creada
router.get('/getFactura', async (req, res) => {
       
    facturaFacade = new FacturaFacade();
    let consec = await facturaFacade.selectFactura();
    res.json({ consec});
});

//inserta la factura en la tabla factura solamente
router.post('/insertarFactura', async (req, res) => {
        
    const{factura} = req.body;

    facturaFacade = new FacturaFacade();

    console.log({factura});
    let msg = await facturaFacade.insertFactura({factura});

    res.json({ msg});
});

//inserta cada Detalle factura 
router.post('/insertarDetalleFactura', async (req, res) => {
        
    const{detalleFactura} = req.body;


    detalleFacturaFacade = new DetalleFacturaFacade();

    let msg = await detalleFacturaFacade.insertAll({detalleFactura});

    res.json({ msg});
});

//inserta cada Detalle factura 
router.post('/insertarInventario', async (req, res) => {
        
    const{inventario} = req.body;

    inventarioFacade = new InventarioFacade();

    let msg = await inventarioFacade.insertAll({inventario});

    res.json({ msg});
});
//post para insertar personas
router.post('/insertarPersona', async (req, res) => {
        
    const{id_tipo_persona, id_tipo_doc, documento, nombre, apellido} = req.body;
    personaFacade = new PersonaFacade();

    let msg = await personaFacade.insertPersona({id_tipo_persona, id_tipo_doc, documento, nombre, apellido});

    res.json({ msg});
});

//post para insertar contacto
router.post('/insertarContacto', async (req, res) => {
        
    const{ id_tipo_contacto, desc_tipo_contacto, id_tipo_persona, id_tipo_doc, documento, desc_contacto } = req.body;
    contactoFacade = new ContactoFacade();
    console.log({ id_tipo_contacto, desc_tipo_contacto, id_tipo_persona, id_tipo_doc, documento, desc_contacto });
    
    let msg = await contactoFacade.insertContacto({ id_tipo_contacto, desc_tipo_contacto, id_tipo_persona, id_tipo_doc, documento, desc_contacto });

    res.json({ msg});
});
//post para insertar Direccion
router.post('/insertarDireccion', async (req, res) => {
        
    const{  posicion, id_direccion, id_tipo_persona, id_tipo_doc, documento, nomen, valor_direc } = req.body;
    direccionFacade = new DireccionFacade();
    console.log({ posicion, id_direccion, id_tipo_persona, id_tipo_doc, documento, nomen, valor_direc });
    
    let msg = await direccionFacade.insertDireccion({  posicion, id_direccion, id_tipo_persona, id_tipo_doc, documento, nomen, valor_direc});

    res.json({ msg});
});

router.post('/insertarTipoP', async (req, res) => {

    const { dato_1, dato_2 } = req.body;

    tipoPersonaFacade = new TipoPersonaFacade();

    msg = tipoPersonaFacade.insertTipoPersona(dato_1, dato_2);


});



module.exports = router