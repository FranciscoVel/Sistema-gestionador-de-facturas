
const SQLController = require("./SQLController");

module.exports = class NomenclaturaFacade{

    

async selectAll(){

    var sqlCon = new SQLController();
        var sql = "select posicion, idnomen, descnomen from Nomenclatura order by posicion";
        var tipos = [];
        var result = await sqlCon.executeSQL(sql, [], true);


        result.rows.map(tipo=>{

            let tipoSchema ={
                "posicion": tipo[0],
                "idNomen": tipo[1],
                "descNomen": tipo[2]
            }
    
            
            tipos.push(tipoSchema);
        });

        console.log(tipos);
        return tipos;
    }

  
    
   
}