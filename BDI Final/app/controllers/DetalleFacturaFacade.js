
const SQLController = require("./SQLController");

module.exports = class DetalleFacturaFacade {



    //Obtener todos los detalle factura dado una factura
    async selectItems(facId) {

        try {

            var sqlCon = new SQLController();
            var sql = `SELECT D.IDCATPRODUCTO, D.REFPRODUCTO, D.CANTIDAD, I.CONSECINVEN, P.NOMPRODUCTO FROM DETALLEFACTURA D, INVENTARIO I, PRODUCTO P  
                       WHERE D.NFACTURA = :1 AND D.NFACTURA = I.NFACTURA AND D.IDTIPOFAC = I.IDTIPOFAC AND D.ITEM = I.ITEM
                       AND D.IDCATPRODUCTO = I.IDCATPRODUCTO AND D.REFPRODUCTO = I.REFPRODUCTO AND P.REFPRODUCTO = D.REFPRODUCTO`;
            var binds = [facId];
            var itemsCon = [];
            var result = await sqlCon.executeSQL(sql, binds, true);

            result.rows.map(tipo => {

                let tipoSchema = {
                    "idCatProducto": tipo[0],
                    "refProducto": tipo[1],
                    "cantidad": tipo[2],
                    "consecInven": tipo[3],
                    "nomProducto": tipo[4]
                }

                console.log(tipoSchema);
                itemsCon.push(tipoSchema);
            });



            return itemsCon;

        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }

    //Obtener items junto al codigo de inventario y productos respectivos dado un numero de factura
    async selectItemsByFac(facId) {

        try {

            var sqlCon = new SQLController();
            var sql = `SELECT D.IDCATPRODUCTO, D.REFPRODUCTO, D.CANTIDAD, D.PRECIO, I.CONSECINVEN, P.NOMPRODUCTO FROM DETALLEFACTURA D, INVENTARIO I, PRODUCTO P  
                       WHERE D.NFACTURA = :1 AND D.NFACTURA = I.NFACTURA AND D.IDTIPOFAC = I.IDTIPOFAC AND D.ITEM = I.ITEM
                       AND D.IDCATPRODUCTO = I.IDCATPRODUCTO AND D.REFPRODUCTO = I.REFPRODUCTO AND P.REFPRODUCTO = D.REFPRODUCTO`;
            var binds = [facId];
            var itemsCon = [];
            var result = await sqlCon.executeSQL(sql, binds, true);

            result.rows.map(tipo => {

                let tipoSchema = {
                    "idCatProducto": tipo[0],
                    "refProducto": tipo[1],
                    "cantidad": tipo[2],
                    "precio": tipo[3],
                    "consecInven": tipo[4],
                    "nomProducto": tipo[5]
                }
                itemsCon.push(tipoSchema);
            });

            return itemsCon;

        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }

    //insertar cada detalle factura
    async insertAll({ detalleFactura }) {

        try {

            var sqlCon = new SQLController();

            const sql = `INSERT INTO DETALLEFACTURA (IDTIPOFAC, NFACTURA, ITEM, IDCATPRODUCTO, REFPRODUCTO, CANTIDAD, PRECIO)
                VALUES (:1, :2, :3, :4, :5, :6, :7)`;

            const binds = [detalleFactura.tipoFactura, detalleFactura.nFactura, detalleFactura.item, detalleFactura.idCatProducto,
            detalleFactura.refProducto, detalleFactura.cantidad, detalleFactura.precioU];

            await sqlCon.executeSQL(sql, binds, true);


            return { success: true, message: 'Inserción exitosa' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }


}