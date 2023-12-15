const { jsPDF } = require("jspdf");
const SQLController = require("./SQLController");

const DetalleFacturaFacade = require("./DetalleFacturaFacade.js");
const PersonaFacade = require("./PersonaFacade.js");
const EmpleadoFacade = require("./EmpleadoFacade.js");

module.exports = class FacturaFacade {



    async insertFactura({ factura }) {

        try {

            var sqlCon = new SQLController();

            const sql = `
                INSERT INTO FACTURA (IDTIPOFAC, NFACTURA, IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO, FAC_IDTIPOFAC,  FAC_NFACTURA, CODEMPLEADO, FECHAFACTURA, TOTALFACTURA)
                VALUES (:1, COALESCE(TO_CHAR((SELECT MAX(TO_NUMBER(NFACTURA)) + 1 FROM FACTURA), 'FM999999999'), '0'),
                :3, :4, :5, :6, :7, :8, SYSDATE, :10)`;

            const binds = [factura.tipo, factura.cliente.idTipoPersona, factura.cliente.idTipoDoc, factura.cliente.nDocumento, factura.facturaMod.tipo,
            factura.facturaMod.id, factura.empleado, factura.total];

            await sqlCon.executeSQL(sql, binds, true);


            return { success: true, message: 'Inserción exitosa' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }


    async selectFactura() {

        try {
            var sqlCon = new SQLController();
            var sql = "SELECT NFACTURA FROM Factura ORDER BY FECHAFACTURA DESC FETCH FIRST 1 ROW ONLY";
            let consec = 0;
            var result = await sqlCon.executeSQL(sql, [], true);

            if (result.rows.length === 0) {
                return consec;
            } else {
                consec = result.rows;
            }


            return consec;
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la seleccion' };
        }
    }

    //Obtener una factura con un id/codigo especifico
    async selectCodFactura(codFactura, tipoFactura) {

        try {


            var sqlCon = new SQLController();
            var sql = `select f.idTipoFac, f.nFactura, p.nombre || p.apellido, p.idTipoPersona, p.idTipoDoc, p.nDocumento
                        from Factura f, persona p  
                        where f.nFactura = :1 and f.idTipoFac = :2 and p.nDocumento = f.nDocumento and 
                        p.idTipoPersona = f.idTipoPersona and p.idTipoDoc = f.idTipoDoc`;
            var binds = [codFactura, tipoFactura];
            var result = await sqlCon.executeSQL(sql, binds, true);


            if (result.rows.length === 0) {
                var factura = {
                    id_tipo_fac: '',
                    id_fac: '',
                    persona: ''
                }
                return factura;
            } else {
                let y = result.rows[0];
                var factura = {
                    id_tipo_fac: y[0],
                    id_fac: y[1],
                    persona: y[2],
                    idTipoPersona: y[3],
                    idTipoDoc: y[4],
                    nDocumento: y[5]
                }
            }


            return factura;

        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }

    async insertFacInven(inventarios) {


        return JSON.stringify(inventarios);
    }

    //Trae todo lo de una factura con un numero de factura especifico
    async selectFacturaByCode(nFactura) {
        try {
            var sqlCon = new SQLController();
            var binds = [nFactura];
            var facturaRes = [];
            var sql = "SELECT F.idTipoFac, F.nFactura, F.idTipoPersona, F.idTipoDoc, F.nDocumento, F.fac_idtipoFac, F.fac_nfactura, F.codEmpleado, F.fechaFactura, F.totalFactura " +
                "FROM factura F WHERE F.nFactura = :1";
            var result = await sqlCon.executeSQL(sql, binds, true);

            if (result.rows.length === 0) {
                let tipoSchema = {
                    "idTipoFac": '',
                    "nFactura": '',
                    "idTipoPersona": '',
                    "idTipoDoc": '',
                    "nDocumento": '',
                    "fac_idTipoFac": '',
                    "fac_nFactura": '',
                    "codEmpleado": '',
                    "fechaFactura": '',
                    "totalFactura": ''
                }
                facturaRes.push(tipoSchema);
            } else {
                result.rows.map(factura => {

                    let tipoSchema = {
                        "idTipoFac": factura[0],
                        "nFactura": factura[1],
                        "idTipoPersona": factura[2],
                        "idTipoDoc": factura[3],
                        "nDocumento": factura[4],
                        "fac_idTipoFac": factura[5],
                        "fac_nFactura": factura[6],
                        "codEmpleado": factura[7],
                        "fechaFactura": factura[8],
                        "totalFactura": factura[9]
                    }
                    facturaRes.push(tipoSchema);
                });
            }
            return facturaRes;
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la seleccion' };
        }

    }

    async generarPDF(factura, listaDetalles2, listaInventario) {
        const doc = new jsPDF();
        let detalleFacturaFacade = new DetalleFacturaFacade();
        let personaFacade = new PersonaFacade();
        let empleadoFacade = new EmpleadoFacade();

        let listaFac = await this.selectFacturaByCode(factura);
        var facturaTemp = listaFac[0];

        let listaCl = await personaFacade.getInfoPersona(facturaTemp.nDocumento);
        var clienteTemp = listaCl[0];

        let listaDetalles = await detalleFacturaFacade.selectItemsByFac(factura);

        let listaEmp = await empleadoFacade.selectByCod(facturaTemp.codEmpleado);
        var empleadoTemp = listaEmp[0];

        doc.setFontSize(18);
        doc.text('Factura', 105, 15, null, null, 'center');

        doc.setFontSize(11);


        doc.text(`Número de factura: ${facturaTemp.nFactura}`, 15, 30);      
        doc.text(`Tipo de factura: ${facturaTemp.idTipoFac}`, 90, 30);
        doc.text(`Fecha: ${this.darFormatoFechaFactura(facturaTemp.fechaFactura)}`, 15, 50);

        let posY=60;

        doc.text(`Cliente: `, 15, posY);

        doc.text(`${clienteTemp.descTipoDoc}. ${facturaTemp.nDocumento}`, 30, posY);
        doc.text(`${clienteTemp.nombre} ${clienteTemp.apellido}`, 30, posY+10);

        if(facturaTemp.idTipoFac=="DV"||facturaTemp.idTipoFac=="DC"){
            doc.text(`tipo de factura a modificar: ${facturaTemp.fac_idTipoFac}`, 30, posY+20);
            doc.text(`número de factura a modificar: ${facturaTemp.fac_nFactura}`, 30, posY+30);
            posY=90;
        }

        for(var i=0; i< listaDetalles.length; i++){
            doc.text(`${i+1}.Ref. ${listaDetalles[i].refProducto}`, 15, posY+30);
            doc.text(`Producto: ${listaDetalles[i].nomProducto}`, 35, posY+30);
            doc.text(`Cantidad: ${listaDetalles[i].cantidad}`, 110, posY+30);
            doc.text(`Precio: ${listaDetalles[i].precio}`, 140, posY+30);
            posY += 10;
        }

        doc.text(`Empleado:${empleadoTemp.nomCargo} ${empleadoTemp.nomEmpleado} ${empleadoTemp.apellEmpleado}`, 15, posY+40);

        // console.log(factura);
        //console.log(listaDetalles);
        //console.log(listaInventario);

        doc.save(facturaTemp.nFactura + '.pdf');
    }

    darFormatoFechaFactura(fechaOriginal) {
        var fecha = new Date(fechaOriginal);

        // Obtener los componentes de la fecha
        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por eso se suma 1
        var año = fecha.getFullYear();

        // Formatear la fecha en un formato más simple (por ejemplo: DD/MM/YYYY)
        var fechaFormateada = `${dia < 10 ? '0' : ''}${dia}/${mes < 10 ? '0' : ''}${mes}/${año}`;

        console.log(fechaFormateada);
        return fechaFormateada;
    }


}