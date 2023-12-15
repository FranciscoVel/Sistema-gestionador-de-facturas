
const SQLController = require("./SQLController");

module.exports = class DireccionFacade{

    
    async insertDireccion({  posicion, id_direccion, id_tipo_persona, id_tipo_doc, documento, nomen, valor_direc  }) {
        
        
        try {

            //id direccion falta insertarto buscando el valor mas grande de la base de datos 

            var sqlCon = new SQLController();
            
            const sql = `
                INSERT INTO DIRECCION (POSICION, IDDIRECCION, IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO, IDNOMEN, VALORDIREC)
                VALUES (:1, :2, :3, :4, :5, :6, :7)`;
            const binds = [ posicion, id_direccion, id_tipo_persona, id_tipo_doc, documento, nomen, valor_direc  ];

            await sqlCon.executeSQL(sql, binds, true);

            return { success: true, message: 'Inserción exitosa' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }
   
}