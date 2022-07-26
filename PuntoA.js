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
        console.log(inputLine);
        return inputLine;
    }
    return new Promise((resolve, reject) => {
        fs.readFile((ARCHIVO_LECTURA + '.txt'), 'utf-8', async (err, data) => {
            if (err) {
                reject(err);
            } else {
                readData = data.split("\n").map(e => e.replace('\r', ''));
                let n = parseInt(readLine());//cantidad de lineas (n, primera linea)
                let p = [];
                console.log(n);
                for (let i = 0; i < n; ++i) {
                    let linea = readLine();
                    let data = linea.split(" ");
                    console.log(data);
                    let horas = data[1].split("-");
                    console.log(horas);
                    let horaI, minI, horaF, minF;
                    let tiempo = horas[0].split(":");
                    console.log(tiempo);
                    horaI = parseInt(tiempo[0]);
                    minI = parseInt(tiempo[1]);
                    console.log(horaI);
                    tiempo = horas[1].split(":");
                    console.log(tiempo);
                    horaF = parseInt(tiempo[0]);
                    minF = parseInt(tiempo[1]);
                    console.log(horaF);
                    p.push(new Procedimiento(data[0], new Hora(horaI, minI), new Hora(horaF, minF)));//las lineas del archivo se ingresan en el array
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
    let out = obj.n + "\n";;
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

    var cantidadProcedimientos = 0;
    var horaComienzo, horaComienzoNext;//horas y minutos de hi (hora de inicio)
    var horaLimite = 0; //hora final de la linea anterior
    var horaFinal = 0, horaFinalNext = 0; //hora final de un procedimiento
    var tiempoAcum = 0, tiempoAcum2;//Tiempo acumulado (unidad de horas)
    var horasAcum, minutosAcum;
    var nombresProcedimientos = [];
    var posibilidades = [];
    var rangos = [];

    //Si un procedimiento consta de 24h es caso base.

    for (var i = 0; i < 1; i++) {
        horaComienzo = procedimientos[i].horaInicio.hora + (procedimientos[i].horaInicio.minutos / 60);
        horaFinal = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
        rangos.push(horaFinal - horaComienzo);
        for (var j = 1; j < n; j++) {
            horaComienzoNext = procedimientos[j].horaInicio.hora + (procedimientos[j].horaInicio.minutos / 60);
            horaFinalNext = procedimientos[j].horaFin.hora + (procedimientos[j].horaFin.minutos / 60);
            tiempoAcum += (horaFinal - horaComienzo) + (horaFinalNext - horaComienzoNext); //Tiempo en que se usa la sala por un procedimiento    
            console.log("hora final " + horaFinal + " hora comienzo segundo " + horaComienzoNext);

            if (horaFinal <= horaComienzoNext
            ) {
                posibilidades.push(procedimientos[j].nombre);
                rangos.push(horaFinalNext - horaComienzoNext);
                //console.log("posibilidades "+posibilidades[j]);
                //console.log("rangos "+rangos[i]);
                tiempoAcum = 0;
                horaComienzoNext = 0;
                horaFinalNext = 0;
            } else if (horaComienzo >= horaLimite) {
                cantidadProcedimientos += 1;
                console.log(cantidadProcedimientos);
                console.log(horaComienzo + ">" + horaLimite);
                horaLimite = procedimientos[j].horaFin.hora + (procedimientos[j].horaFin.minutos / 60);
                tiempoAcum += horaLimite - horaComienzo;//Tiempo en que se usa la sala por un procedimiento
                console.log(horaLimite + "-" + horaComienzo);
                posibilidades.push(procedimientos[j].nombre);//Insertar nombre de procedimientos en un array
            }
    }
}

for (var x = 0; x < posibilidades.length; x++) {
    console.log(posibilidades[x]);
    console.log("rangos " + rangos[x])
}



tiempoAcum = (tiempoAcum + "").split(".");
horasAcum = tiempoAcum[0];
minutosAcum = Math.trunc(parseFloat(0 + "." + tiempoAcum[1]) * 60);
console.log("tiempo acum final " + tiempoAcum);
console.log(minutosAcum);
return new Respuesta(cantidadProcedimientos, new Hora(horasAcum, minutosAcum), nombresProcedimientos);
}

async function main() {
    const p = await input();
    let res = await solve(p.length, p);
    console.log(res);
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