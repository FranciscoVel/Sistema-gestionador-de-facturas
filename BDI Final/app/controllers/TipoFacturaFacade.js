
const SQLController = require("./SQLController");

module.exports = class TipoFacturaFacade {



    async selectAll() {

        var sqlCon = new SQLController();
        var sql = "select * from tipoFactura";
        var tipos = [];
        var result = await sqlCon.executeSQL(sql);


        result.rows.map(tipo => {

            let tipoSchema = {
                "idTipoFact": tipo[0],
                "descTipoFact": tipo[1],
            }

            console.log(tipoSchema);
            tipos.push(tipoSchema);
        });

        console.log(tipos);
        return tipos;
    }
    
}
