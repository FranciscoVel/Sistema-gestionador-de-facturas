
const SQLController = require("./SQLController");

module.exports = class TipoContacto {



    async selectAll() {

        var sqlCon = new SQLController();
        var sql = "select idTipoContacto, descTipoContacto from TipoContacto";
        var tipos = [];
        var result = await sqlCon.executeSQL(sql, [], true);


        result.rows.map(tipo => {

            let tipoSchema = {
                "idTipoContacto": tipo[0],
                "descTipoContacto": tipo[1]
            }

            tipos.push(tipoSchema);
        });

        console.log(tipos);
        return tipos;
    }


}