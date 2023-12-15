const SQLController = require("./SQLController");

module.exports = class EmpleadoFacade {

    //Trae empleados con un codigo en especifico, trae tambien su cargo respectivo si tiene uno activo
    async selectByCod(cod) {
        var sqlCon = new SQLController();
        var binds = [cod];

        //solo los cargos que estan activos

        var sql = "select E.codEmpleado,E.nomEmpleado, E.apellEmpleado, E.correo, EC.codCargo, C.nomCargo " +
            "FROM empleado E, empleados_cargos EC, Cargo C " +
            "WHERE E.codEmpleado = :1 AND E.codEmpleado = EC.CodEmpleado AND C.codCargo = EC.CodCargo "+
            "AND C.estadoCargo = 1"


        var listaRes = [];
        var result = await sqlCon.executeSQL(sql, binds, true);

        result.rows.map(empleado => {

            let tipoSchema = {
                "codEmpleado": empleado[0],
                "nomEmpleado": empleado[1],
                "apellEmpleado": empleado[2],
                "correo": empleado[3],
                "codCargo": empleado[4],
                "nomCargo": empleado[5]
            }
            listaRes.push(tipoSchema);
        });


        return listaRes;
    }
}