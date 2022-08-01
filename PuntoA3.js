const { pbkdf2 } = require('crypto');
let fs = require('fs');
const { off } = require('process');
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
    var horaComienzo, horaFin2;//horas y minutos de hi (hora de inicio)
    var horaLimite;//hora final de la linea anterior
    var horasAcum, minutosAcum;
    var cont2 = 0;
    var posiYproces = [];
    var pNegativos = [];
    var nombresProcedimientos = [];
    var posibilitiesFinal = [];
    var rangos = [];
    const buildRangesV = [];

    //Retorna un vector con el nombre de un procedimiento y su rango
    const buildRanges = (procedimientos) => {
        procedimientos.this = procedimientos;
        for (var i = 0; i < procedimientos.length; i++) {
            horaLimite = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
            horaComienzo = procedimientos[i].horaInicio.hora + (procedimientos[i].horaInicio.minutos / 60);
            var rango = horaLimite - horaComienzo;
            buildRangesV.push([procedimientos[i].nombre, rango]);
        }
        return buildRangesV;
    }

    //Encuentra el delta de un procedimiento dependiendo del nombre de un procedimiento
    const findRangexProce = (proc) => {
        buildRanges(procedimientos);
        for (var i = 0; i < buildRangesV.length; i++) {
            if (buildRangesV[i][0] === proc) {
                return buildRangesV[i][1];
            }
        }
    }
    //Ordena el vector de rangos
    const buildVectorRanges = (ranges) => {
        //ranges.sort();
        ranges.sort(function (a, b) {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });
        console.log("sort " + ranges);
        /*for(){
            
        }*/
    }

    //Encuentra el indice de un procedimiento
    const indexProce = (proc) => {
        for (var i = 0; i < procedimientos.length; i++) {
            if (proc == procedimientos[i].nombre) {
                return i;
            }
        }
    }

    /**Saca las posibilidades de un procedimiento */

    const posibilities = (proc, horaFin, procedimientos) => {
        var p = [];
        for (var i = 1; i < procedimientos.length; i++) {
            horaComienzo = procedimientos[i].horaInicio.hora + (procedimientos[i].horaInicio.minutos / 60);
            horaLimite = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
            if (horaComienzo >= horaFin && ranges <= 24) {
                var ranges = findRangexProce(proc) + findRangexProce(procedimientos[i].nombre);
                horaComienzo = procedimientos[i].horaInicio.hora + (procedimientos[i].horaInicio.minutos / 60);
                p.push(procedimientos[i].nombre/*, ranges*/);
                if (i < procedimientos.length - 2) {
                    horaFin = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
                } else {
                }

            } else if (horaComienzo >= horaFin) {
                horaComienzo = procedimientos[i].horaInicio.hora + (procedimientos[i].horaInicio.minutos / 60);
                var ranges = findRangexProce(proc) + findRangexProce(procedimientos[i].nombre);
                p.push(procedimientos[i].nombre/*, ranges*/);
            }
        }

        rangos.push(ranges);
        // buildVectorRanges(rangos);
        return p;

    }

    // console.log(posibilities("Proc3", 22, procedimientos));
    /** Esta función me retorna un array con los elementos que son hojas del arbol: 
     * osea los que no pueden tener procedimientos ligados por transitividad
     * Ej:
     * Proc1 2:00-6:00
       Proc2 3:00-12:00
       Proc3 11:00-20:00
       Proc4 12:00-22:00
       Proc5 13:00-24:00
       Salida: [Proc3, Proc4, Proc5]
       Lo que nos ayuda a reducir el problema de las posibilidades.
     */

    const horaFinYhoraIn = () => {
        for (var i = 0; i < procedimientos.length; i++) {
            var horaFActu = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
            if (horaFActu == 24) {
                pNegativos.push(procedimientos[i].nombre);
            }
        }
        for (var i = 0; i < procedimientos.length; i++) {
            var horaFActu = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
            var cont = 0;
            for (var j = indexProce(procedimientos[i].nombre) + 1; j < procedimientos.length; j++) {
                var horaCNext = procedimientos[j].horaInicio.hora + (procedimientos[j].horaInicio.minutos / 60);
                if (horaFActu <= horaCNext) {
                    cont++;
                } else {
                    cont -= 1;
                }
            }
            if (cont < 0) {
                cont2++;
                if (cont2 == 1 &&
                    pNegativos.includes(procedimientos[i].nombre) != true) {
                    pNegativos.push(procedimientos[i].nombre);
                } else {
                }
            }
        }

        /* for(var i=0; i<pNegativos.length;i++){
             console.log("los que no tienen subarboles "+pNegativos[i]);
         }*/

        return pNegativos;
    }

    const procHc = (proc) => {
        for (var i = 0; i < procedimientos.length; i++) {
            if (procedimientos[i].nombre === proc) {
                horaComienzo = procedimientos[i].horaInicio.hora + (procedimientos[i].horaInicio.minutos / 60);
                horaFin2 = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
                var p2 = [];
                p2.push(horaComienzo);
            }
        }
        return p2;
    }

    const procHf = (proc) => {
        for (var i = 0; i < procedimientos.length; i++) {
            if (procedimientos[i].nombre === proc) {
                horaComienzo = procedimientos[i].horaInicio.hora + (procedimientos[i].horaInicio.minutos / 60);
                horaFin2 = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
                var p2 = [];
                p2.push(horaFin2);
            }
        }
        return p2;
    }



    const transitivity = () => {
        var j = 0;
        var m = posibilitiesFinal[0][1].length;
        console.log("m " + m);
            for (var i = 0; i < posibilitiesFinal[0][1].length - 1; i++) {
                j++;
                console.log("proce en cuestion " + posibilitiesFinal[i][1][i] + " " + i);
                var hF = procHf(posibilitiesFinal[i][1][i]);
                var hC = procHc(posibilitiesFinal[j][1][i]);
                console.log("hf " + hF + " hc " + posibilitiesFinal[j][1][i]);
                if (hF <= hC) {
                    console.log(" sirve " + posibilitiesFinal[j][1][j]);
                } else {
                    
                j++;
            }


            /* for(var i=0; i<posibilitiesFinal.length;i++){
                 if(posibilitiesFinal[i][1].length == 0){
                     posibilitiesFinal[i].length = 1; 
                 }else{
                     var hF = procHf(posibilitiesFinal[0][1][0]);
                     var hC = procHc(posibilitiesFinal[i][1][1]);
                     console.log("hf "+hF+ " hC "+hC);
                     if(hF <= hC){*/

        }


    }


    /**Hay un procedimiento de 24 horas, no se diga más, ese es el que se hará.
    * El procedimiento de 24 solo puede ser el primero porque en terminos de horas
    * de inicio y fin, es el único posible (0:00 - 24:00) */

    if (procedimientos[0].horaInicio.hora == 0 && procedimientos[0].horaFin.hora == 24) {
        return new Respuesta(1, new Hora(24, 0),
            [procedimientos[0].nombre]);

        /**El resto de los casos empieza acá. */
    } else {
        var sheetsActiv = 0; var posiSheets = 0;;
        for (var i = 0; i < n; i++) {
            if (sheetsActiv == 0) {
                var sheets = [];
                // console.log(horaFinYhoraIn()); //Retorna un array con los elementos que son hojas del arbol
                sheets = horaFinYhoraIn();
                sheetsActiv = 1;
            }
            horaFin2 = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
            posibilitiesFinal.push([procedimientos[i].nombre, posibilities(procedimientos[i].nombre,
                horaFin2,
                procedimientos)]);
                
            // rangesXproces.push([posibilitiesFinal[i], rangos[i]]);
            // console.log("posis y rangos " + rangesXproces[i])
        }
        //      console.log("posibilities "+posibilitiesFinal);
    }
    var j = 0;
    for (var i = 0; i < posibilitiesFinal.length; i++) {
        if (posibilitiesFinal[i].length == 0) {
            posibilitiesFinal[i] = sheets[j]/*, findRangexProce(procedimientos[i].nombre)*/;
            // posibilitiesFinal[i++] = findRangexProce(procedimientos[i].nombre);
            j++;

        }

        if (posibilitiesFinal[i][1].length == 0) {
            posibilitiesFinal[i].length = 1;
        }
        console.log("posibilities " + posibilitiesFinal[i]);
        
        
    }

   // transitivity();

    console.log("final proces " + nombresProcedimientos);
    //threeBuild(nombresProcedimientos);
    return new Respuesta(cantidadProcedimientos, new Hora(horasAcum, minutosAcum), posiYproces);

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