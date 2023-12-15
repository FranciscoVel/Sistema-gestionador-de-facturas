document.addEventListener("DOMContentLoaded", function () {
    preventUpdate();

    // Btn de acción de login
    var btnLogin = document.getElementById("btn-login");
    btnLogin.addEventListener("click", login);

    // Btn de accion para redirigir a persona
    var btnPer = document.getElementById("btn-persona");
    btnPer.addEventListener("click", redirectPersona);
});

// Prevenir actualización automática de la página al enviar un formulario
function preventUpdate() {
    var formularios = document.querySelectorAll('form');
    formularios.forEach(function (formulario) {
        formulario.addEventListener('submit', function (event) {
            event.preventDefault();
        });
    });
}


async function login() {
    var user = document.getElementById("id-user").value;

    // Verificar si el campo de usuario no está vacío
    if (user.trim() === "") {
        alert("Ingrese un usuario válido");
        return;
    } else {
        // Realizar la solicitud POST a routes.js
        var listaUsuarios = await buscarUsuario(user);
        if (verificarLista(listaUsuarios)) {
            //Subir el usuario a la variable en sesion
            setActiveUser(listaUsuarios[0]);
            
           window.location.href = '/crear_factura  '; 
        }else{
            alert("Usuario no encontrado");
        }
    }
}

async function buscarUsuario(codUsuario) {
    try {
        let codEmp = codUsuario;
        const response = await fetch('/getEmpleadoCod', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codEmp })
        });
        const data = await response.json();
        return data.listaEmpleados;
    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        return null;
    }
}

//Redireccionar a la pagina de personas
function redirectPersona(){
    window.location.href = '/crear_persona'; 
}

//Coloca en localStorage al usuario que inicia sesion
function setActiveUser(user) {
    localStorage.setItem('usuario', JSON.stringify(user));
}

//Recuperar usuario activo
function getActiveUser(){
    var u = JSON.parse(localStorage.getItem('usuario'));
    return u;
}

//Elimina el elemento en sesion
function cerrarSesion(){
    localStorage.removeItem('usuario');
}

//Toma una lista y verifica si está vacia o es null
function verificarLista(lista) {
    if (lista != null && lista.length > 0) {
        return true;
    } else {
        return false;
    }
}

