const form = document.getElementById('form_registro');

form.addEventListener('submit', async (event) => {
    var dato_1 = '21';
    var dato_2 = 'test_3';
 

    event.preventDefault(); // Prevenir el envío del formulario por defecto



    const responseInsert = await fetch('http://localhost:2020/insertarTipoP', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dato_1,
            dato_2
        }),
    });


    if (responseInsert.status === 200) {
        // La inserción se realizó con éxito, puedes realizar acciones adicionales si es necesario.
        console.log('Inserción exitosa');
    } else {
        // Ocurrió un error durante la inserción, maneja el error de acuerdo a tus necesidades.
        console.error('Error durante la inserción');
    }

});