
const SQLController = require("./SQLController");

module.exports = class CargoFacade {

    async selectCargo({id_empleado}) {

        try{
            
            var sqlCon = new SQLController();
            var sql = `select lower(c.nomCargo), lower(c.estadoCargo) from cargo c, empleado e, empleados_cargos ep where ep.codempleado = e.codempleado and ep.codcargo = c.codcargo and e.codempleado = :1`;
            var tipos = [];
            const binds = [id_empleado];
            var result = await sqlCon.executeSQL(sql, binds, true);
    
            let tipoSchema;
            
            result.rows.map(tipo => {
    
                let tipoSchema = {
                    "nomCargo": tipo[0],
                    "estadoCargo": tipo[1]
                }
    
                tipos.push(tipoSchema);
            });
            tipoSchema ={
                "nomCargo": tipos[0].nomCargo,
                "estadoCargo": tipos[0].estadoCargo
            }
            return tipos;
        }
        catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }
}