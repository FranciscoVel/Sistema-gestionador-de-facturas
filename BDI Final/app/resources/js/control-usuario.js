//Mostrar y ocultar cosas dependiendo del cargo
export function modificarInterfazCargo() {
    var user = getActiveUser();
    var cargo = "";

    //Consulta para traer todos los tipos de usuario
    var tipUser = [
        { id: "1", tipo: "vendedor" },
        { id: "2", tipo: "auxiliar de compras" },
        { id: "3", tipo: "director de compras" },
        { id: "4", tipo: "representante de ventas" }
    ]

    //Revisa el id del usuario y lo compara con los traidos con la consulta
    for (var i = 0; i < tipUser.length; i++) {
        if (user.cargo == tipUser[i].id) {
            cargo = tipUser[i].tipo;
        }
    }

    //Se ocultan los elementos que no sean del cargo 
    for (var i = 0; i < tipUser.length; i++) {

        if (user.cargo != tipUser[i].id) {
            //Si no es del cargo se modifica la clase ej. .vista-representante-de-ventas
            let clase = ".vista-"+tipUser[i].tipo.replace(/\s+/g, '-');
            
            let elementosOcultar = document.querySelectorAll(clase);

            //Se le asigna la clase css para ocultar
            elementosOcultar.forEach(elemento =>{
                elemento.classList.add("ocultar");
            });
        }
    }

    //Si es vendedor mostrar solo lo de venta

    //Si es auxiliar de compras solo lo de compras

    //Si es director devolucion compra

    //Si es representante devolucion compra
}


