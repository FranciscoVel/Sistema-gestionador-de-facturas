
const SQLController = require("./SQLController");

module.exports = class ContactoFacade{

    
    //insercion en la base de datos de las personas
    async insertContacto({  id_tipo_contacto, desc_tipo_contacto, id_tipo_persona, id_tipo_doc, documento, desc_contacto }) {
        
        
        try {

            

            var sqlCon = new SQLController();
            
            const sql = `
                INSERT INTO CONTACTO (CONSECCONTACTO, IDTIPOCONTACTO, DESCTIPOCONTACTO, IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO, DESCCONTACTO)
                VALUES (COALESCE(TO_CHAR((SELECT MAX(TO_NUMBER(CONSECCONTACTO)) + 1 FROM CONTACTO), 'FM999999999'), '0'),
                :2, :3, :4, :5, :6, :7)`;
            const binds = [ id_tipo_contacto, desc_tipo_contacto, id_tipo_persona, id_tipo_doc, documento, desc_contacto ];

            await sqlCon.executeSQL(sql, binds, true);

            return { success: true, message: 'Inserción exitosa' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }
   
}