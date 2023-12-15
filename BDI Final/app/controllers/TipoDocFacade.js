const SQLController = require("./SQLController");

module.exports = class TipoDocFacade {



    async selectAll() {

        
        
        var sqlCon = new SQLController();
        var sql = "select idTipoDoc, descTipoDoc from TipoDoc";
        var tipos = [];
        var result = await sqlCon.executeSQL(sql, [], true);


        result.rows.map(tipo => {

            let tipoSchema = {
                "idTipoDoc": tipo[0],
                "descTipoDoc": tipo[1]
            }

            tipos.push(tipoSchema);
        });
        
        return tipos;
        
    }

 

}