
const SQLController = require("./SQLController");

module.exports = class PersonaFacade {



    async selectAll() {

        var sqlCon = new SQLController();
        var sql = "select idTipoDoc, NDocumento, IDTipoPersona, Nombre, Apellido from Persona";
        var tipos = [];
        var result = await sqlCon.executeSQL(sql);


        result.rows.map(tipo => {

            let tipoSchema = {
                "idTipoDoc": tipo[0],
                "NDocumento": tipo[1],
                "IDTipoPersona": tipo[2],
                "Nombre": tipo[3],
                "Apellido": tipo[4]
            }

            console.log(tipoSchema);
            tipos.push(tipoSchema);
        });

        console.log(tipos);
        return tipos;
    }

    //Traer una lista de personas que tengan en el nombre algo en comun y sean de un tipo de persona en especifico
    async selNameTypePersona(nombre, tipoP) {

        try {
            var sqlCon = new SQLController();

            var sql = `select idTipoDoc, NDocumento, IDTipoPersona, Nombre, Apellido from Persona
                WHERE idtipopersona = :1 AND lower(nombre) like '%' || :2 || '%' `;
            let binds = [tipoP, nombre];
            var clientesResultado = [];
            var result = await sqlCon.executeSQL(sql, binds, true);


            result.rows.map(tipo => {

                let tipoSchema = {
                    "idTipoDoc": tipo[0],
                    "nDocumento": tipo[1],
                    "idTipoPersona": tipo[2],
                    "nombre": tipo[3],
                    "apellido": tipo[4]
                }


                clientesResultado.push(tipoSchema);
            });

            return clientesResultado;
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }




    //insercion en la base de datos de las personas
    async insertPersona({ id_tipo_persona, id_tipo_doc, documento, nombre, apellido }) {

        try {

            var sqlCon = new SQLController();

            const sql = `
                INSERT INTO Persona (IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO, NOMBRE, APELLIDO)
                VALUES (:1, :2, :3, :4, :5)`;

            const binds = [id_tipo_persona, id_tipo_doc, documento, nombre, apellido];

            await sqlCon.executeSQL(sql, binds, true);

            return { success: true, message: 'Inserción exitosa' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la inserción' };
        }
    }

    //Trae información de una persona junto a el tipo de persona y tipo de documento usando el numero de doc
    async getInfoPersona(numDoc) {
        try {
            var sqlCon = new SQLController();
            var binds = [numDoc];
            var personaRes = [];

            var sql ="select P.idTipoPersona, P.idTipoDoc, P.nDocumento, P.nombre, P.apellido, TD.descTipoDoc, TP.descTipoPersona "+
            "FROM persona P, tipoPersona TP, tipoDoc TD "+
            "WHERE TP.idTipoPersona = P.idTipoPersona AND TD.idTipoDoc = P.idTipoDoc "+
            "AND P.nDocumento= :1";
           
            var result = await sqlCon.executeSQL(sql, binds, true);

            if (result.rows.length === 0) {
                let tipoSchema = {
                    "idTipoPersona": '',
                    "idTipoDoc": '',
                    "nDocumento": '',
                    "nombre": '',
                    "apellido": '',
                    "descTipoDoc": '',
                    "descTipoPersona": ''
                }
                personaRes.push(tipoSchema);
            } else {
                result.rows.map(persona => {

                    let tipoSchema = {
                    "idTipoPersona": persona[0],
                    "idTipoDoc": persona[1],
                    "nDocumento": persona[2],
                    "nombre": persona[3],
                    "apellido": persona[4],
                    "descTipoDoc": persona[5],
                    "descTipoPersona": persona[6]
                    }
                    personaRes.push(tipoSchema);
                });
            }
            return personaRes;
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error durante la seleccion' };
        }

    }

}