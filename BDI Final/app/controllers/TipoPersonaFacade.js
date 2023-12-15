
const SQLController = require("./SQLController");

module.exports = class TipoPersonaFacade {



    async selectAll() {
        var sqlCon = new SQLController();
        var sql = "select idTipoPersona, descTipoPersona from TipoPersona";
        var tiposPersona = [];
        var result = await sqlCon.executeSQL(sql, [], true);


        result.rows.map(tipo => {

            let tipoSchema = {
                "idTipoPersona": tipo[0],
                "descTipoPersona": tipo[1]
            }

            tiposPersona.push(tipoSchema);
        });

        return tiposPersona;
    }

    async insertTipoPersona(idTipoPersona, descTipoPersona) {

        const binds = [idTipoPersona, descTipoPersona];
        try {
            var sqlCon = new SQLController();

            const sql = `
                INSERT INTO tIPOPERSONA (IDTIPOPERSONA, DESCTIPOPERSONA)
                VALUES (:1, :2)`;


            await sqlCon.executeSQL(sql, binds, true);

            return { success: true, message: 'Inserción exitosa' };
        } catch (error) {
            console.error(error);
            console.log(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }

}