const { Console } = require('console');
let fs = require('fs');
/**
 * Nombres de los archivos de lectura y escritura, modifique como considere.
 */
let ARCHIVO_LECTURA = 'inA';
let ARCHIVO_ESCRITURA = 'outA'

/**
 * Método para realizar la lectura del problema, no modificar.
 */
async function input() {
    let line = 0;
    let readData = "";
    const readLine = () => {
        let inputLine = readData[line];
        line++;
        return inputLine;
    }
    return new Promise((resolve, reject) => {
        fs.readFile((ARCHIVO_LECTURA + '.txt'), 'utf-8', async (err, data) => {
            if (err) {
                reject(err);
            } else {
                readData = data.split("\n").map(e => e.replace('\r', ''));
                let n = parseInt(readLine());
                let p = [];

                for (let i = 0; i < n; ++i) {
                    let linea = readLine();
                    let data = linea.split(" ");
                    let horas = data[1].split("-");
                    let horaI, minI, horaF, minF;
                    let tiempo = horas[0].split(":");
                    horaI = parseInt(tiempo[0]);
                    minI = parseInt(tiempo[1]);
                    tiempo = horas[1].split(":");
                    horaF = parseInt(tiempo[0]);
                    minF = parseInt(tiempo[1]);
                    p.push(new Procedimiento(data[0], new Hora(horaI, minI), new Hora(horaF, minF)))
                }
                resolve(p);
            }
        });
    });
}
/**
 * Método para realizar la escritura de la respuesta del problema, no modificar.
 */
async function output(obj) {
    let out = obj.n + "\n";
    out += obj.tiempoTotal + "\n";
    for (let i = 0; i < obj.n; ++i) {
        out += obj.nombreProcedimientos[i] + "\n";
    }
    return new Promise((resolve, reject) => {
        fs.writeFile(ARCHIVO_ESCRITURA + '.txt', out, (err, list) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}

/**
 * Implementar el algoritmo y devolver un objeto de tipo Respuesta, el cual servirá
 * para imprimir la solución al problema como se requiere en el enunciado.
 */
async function solve(n, procedimientos) {
    var combinaciones = [];
    var rangos = [];
    var rangosInidividuales = [], rangIndSort = [];
    var rango = 0;
    var horas, minutos;
    var horaFinal, horaActual;
    var procFinales, horasFinales;
    var horasIni = [], horasIniSort = [];
    var horasFin = [], horasFinSort = [];
    var nombreProc = [], nombreProcSort = [];

    //Agregar elementos a los arrays costo O(n)
    for (var i = 0; i < n; i++) {
        horasIni.push(procedimientos[i].horaInicio.hora + (procedimientos[i].horaInicio.minutos / 60));
        horasFin.push(procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60));
        nombreProc.push(procedimientos[i].nombre);
        rangosInidividuales.push(horasFin - horasIni);
    }

    /**buildRanges: ordena las horas iniciales de los procedimientos ascendentemente. Costo O(n)
     * Ejemplo:
     * [2,9,1,20,22] => [1,2,9,20,22]
    */
    
    const buildRanges = (horasInic) => {
        for (var i = 0; i < n; i++) {
            horasInic.push(procedimientos[i].horaInicio.hora +
                (procedimientos[i].horaInicio.minutos / 60));
        }
        horasInic.sort(function (a, b) { //Sort es un método de JS el cual ordena ascendentemente un array
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });
    }

    buildRanges(horasIniSort);

    /**match. Este metodo relaciona las horas finales y el nombre de un procedimiento de acuerdo a su
     * hora inicial. Costo O(n^2)
     * Ejemplo:
     * [0,1,2,3] = horas de inicio
     * [12,20,22] = horas finales
     * [Proc1, Proc2, Proc3]
     * Hipotesis: el Proc2 le corresponde la hora de inicio 2 y la hora final 22.
     * Por lo tanto [Proc2] , [2], [22] se guardarán las correspondencias en arrays independientes.
     */

    const match = () => {
        var inicio = 0;
        var x = 0;
        var prohibidos = []; //Se refiere a los procedimientos que son iguales y no deben duplicarse en el arreglo
        while (inicio < horasIni.length) {
            if (horasIniSort[inicio] == horasIni[x] && nombreProc[x] != prohibidos[x]) {//horasIniSort[0]=horasIni[1]|procSort[0]=proc[1]
                horasFinSort[inicio] = horasFin[x];
                nombreProcSort[inicio] = nombreProc[x];
                rangIndSort[inicio] = rangosInidividuales[x];
                prohibidos[x] = nombreProc[x];
                x = 0;
                inicio++;
            } else x++;
        }
    }
    match();

    /**maxHours. Este método saca las diferentes combinaciones de procedimientos que cuentan con la 
     * cantidad maxima de horas respecto a un procedimiento.
     * Ejemplo: Para el procedimiento 1 guardaria en el array: [Proc1 - Proc3 - Proc5]
     *  Proc1 0:00-8:00
        Proc2 5:00-12:00
        Proc3 11:00-22:00 
        Proc4 12:00-22:00
        Proc5 22:00-24:00 
     */

    const maxHours = () => {
        for (var d = 0; d < n - 1; d++) {//(0,1,2,3
            combinaciones[d] = nombreProcSort[d];
            horaFinal = horasFinSort[d];
            horaActual = horasIniSort[d];
            rango = horaFinal - horaActual;
            for (var k = d + 1; k < n; k++) {//(1x,2y,3x,4y; 2x,3y,4y; 3x,4y; 4
                var horaIniActual = horasIniSort[k];
                var horaFinActual = horasFinSort[k];
                if (horaIniActual >= horaFinal) {
                    combinaciones[d] += "-" + nombreProcSort[k];
                    horaFinal = horaFinActual;//2y->22
                    rango += horaFinActual - horaIniActual;
                }
            }
            if (rango <= 24)
                rangos[d] = rango;
            else
                rangos[d] = 0;
        }
    }

    maxHours();

    /**conrrespondencias. Este método acomoda todos los datos de los anteriores métodos para
     * ser enviados al archivo de texto. Costo O(n)
     * Ejemplo:
     * [Proc1 - Proc3 - Proc5] en el archivo pide un array, de posiciones, por lo que retornaría 
     * [Proc1, Proc3, Proc5]
     */
    const correspondences = () => {
        procFinales = combinaciones[0].split("-");
        horasFinales = rangos[0];
        for (var v = 1; v < n; v++) {
            if (horasFinales < rangos[v]) {
                procFinales = combinaciones[v].split("-");
                horasFinales = rangos[v];
            }
        }

        horasFinales = (horasFinales + "").split("."); //Cada elemento que tenga un . va a ser insertado en un arreglo
        horas = horasFinales[0];
        minutos = Math.trunc(parseFloat(0 + "." + horasFinales[1]) * 60);
    }

    correspondences();
    return new Respuesta(procFinales.length, new Hora(horas, minutos), procFinales);
}

async function main() {
    const p = await input();
    console.time('loop');
    let res = await solve(p.length, p);
    console.timeEnd('loop');
    await output(res);
}


function Respuesta(n, tiempoTotal, nombreProcedimientos) {
    this.n = n;
    this.tiempoTotal = tiempoTotal;
    this.nombreProcedimientos = nombreProcedimientos;
}

function Procedimiento(nombre, horaInicio, horaFin) {
    this.nombre = nombre;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;

}

class Hora {
    constructor(hora, minutos) {
        this.hora = hora;
        this.minutos = minutos;
    }
    toString() {
        let res = "";
        if (this.hora < 10)
            res += "0" + this.hora;
        else
            res += this.hora;
        res += ":";
        if (this.minutos < 10)
            res += "0" + this.minutos;
        else
            res += this.minutos;
        return res;
    }
}
main();