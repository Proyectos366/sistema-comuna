

export function procesarIdsParaRegistro(inputIds) {
    const resultados = [];

    // Definimos los IDs que esperamos y sus nombres legibles
    const idsEsperados = [
        { key: 'id_comuna', nombreDisplay: 'Comuna' },
        { key: 'id_circuito', nombreDisplay: 'Circuito' },
        { key: 'id_consejo', nombreDisplay: 'Consejo' },
        { key: 'id_usuario', nombreDisplay: 'Usuario' },
    ];

    for (const idInfo of idsEsperados) {
        const { key, nombreDisplay } = idInfo;
        const idValor = inputIds[key]; // Obtenemos el valor del ID del objeto de entrada
        let idProcesado = null;
        let estado = 'ok';
        let mensaje = '';

        // 1. Verificar si el ID está vacío, es nulo o indefinido
        if (idValor === null || typeof idValor === 'undefined' || idValor === '') {
            estado = 'vacio';
            mensaje = `${nombreDisplay} ID está vacío.`;
        } else {
            const numId = Number(idValor); // Intenta convertir a número

            // 2. Verificar si la conversión resultó en NaN
            if (isNaN(numId)) {
                estado = 'error';
                mensaje = `Error de conversión para ${nombreDisplay}: '${idValor}' no es un número válido.`;
            }
            // 3. Verificar si no es un número entero
            else if (!Number.isInteger(numId)) {
                estado = 'error';
                mensaje = `Error de formato para ${nombreDisplay}: El ID '${idValor}' debe ser un número entero.`;
            }
            // 4. Verificar si el número es cero o negativo (asumiendo que los IDs deben ser positivos)
            else if (numId <= 0) {
                estado = 'error';
                mensaje = `Error de valor para ${nombreDisplay}: El ID '${idValor}' debe ser un número entero positivo.`;
            }
            // Si todo es válido
            else {
                idProcesado = numId;
                mensaje = `${nombreDisplay} ID validado correctamente.`;
            }
        }

        // Agregamos el resultado a la lista con la estructura solicitada
        resultados.push({
            nombre: nombreDisplay, // Nombre legible del ID
            id: idProcesado,       // El ID convertido a número o null si no es válido/vacío
            estado: estado,        // 'ok', 'vacio', 'error'
            mensaje: mensaje       // Mensaje descriptivo
        });
    }

    return resultados;
}