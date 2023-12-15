
const SQLController = require("./SQLController");

module.exports = class ProductoFacade {

    //Trae productos segun una referencia junto al precio mas reciente
    async selProductoRef(ref) {


        var sqlCon = new SQLController();

        
        var binds = [ref];

        
        var sql = `select P.idCatProducto, P.refProducto, P.nomProducto, H.valor from Producto P, historicoPrecio H 
          WHERE P.REFPRODUCTO = H.REFPRODUCTO AND P.refProducto = :1 AND H.FECHAFIN is null`;
          
        var prodResultado = [];
        var result = await sqlCon.executeSQL(sql, binds, true);


        if(result.rows.length === 0){
            let tipoSchema = {
                "idCatProducto": '',
                "refProducto": '',
                "nomProducto": '',
                "precio": ''
            }
            prodResultado.push(tipoSchema);
        }else{
            result.rows.map(producto => {

                let tipoSchema = {
                    "idCatProducto": producto[0],
                    "refProducto": producto[1],
                    "nomProducto": producto[2],
                    "precio": producto[3]
                }
                prodResultado.push(tipoSchema);
            });
        }
    
        return prodResultado;
    }




}