
const SQLController = require("./SQLController");

module.exports = class InventarioFacade{

    

    async insertAll({ inventario }) {
        
        
        try {
            

            var sqlCon = new SQLController();

            const sql = `
                INSERT INTO INVENTARIO (CONSECINVEN, IDCATPRODUCTO, REFPRODUCTO, IDTIPOFAC, NFACTURA, ITEM, INVENTARIOMODIFICADO, FECHAINVE, SALEN,  ENTRAN, EXISTENCIA)
                VALUES (COALESCE(TO_CHAR((SELECT MAX(TO_NUMBER(CONSECINVEN)) + 1 FROM INVENTARIO), 'FM999999999'), '0'), :2,
                :3, :4, :5, :6, :7, SYSDATE, :9, :10, :11)`;

            const binds = [inventario.idCatProducto, inventario.refProducto, inventario.idTipoFac, inventario.nFactura, inventario.item,
                           inventario.invenMod, inventario.salen, inventario.entran, inventario.existencia];

            await sqlCon.executeSQL(sql, binds, true);


            return { success: true, message: 'Inserción exitosa' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }

    /*Buscar inventarios con la referencia de un producto especifico, es importante usar el order by y
    obtener de primer lugar el inventario mas reciente para averiguar la existencia
    */
    async selExisInvenProd(refProd){

        try{
            var sqlCon = new SQLController();

                
            var binds = [refProd];

            
            var sql = `SELECT EXISTENCIA FROM INVENTARIO WHERE REFPRODUCTO = :1 ORDER BY FECHAINVE DESC FETCH FIRST 1 ROW ONLY`;
            
            var existencia = [0];
            var r = [existencia];
            var result = await sqlCon.executeSQL(sql, binds, true);

        
            if (result.rows.length === 0) {
                
                return r;
            }else{
                existencia = result.rows;
            }
                return existencia;
            
            
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la busqueda' };
        }
    }
   
}