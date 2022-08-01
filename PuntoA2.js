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
    var horaComienzo, horaComienzoInit;//horas y minutos de hi (hora de inicio)
    var horaLimite, horaLimiteInit;//hora final de la linea anterior
    var tiempoAcum = 0;
    var tiempoAcum2 = 0;//Tiempo acumulado (unidad de horas)
    var horasAcum, minutosAcum;
    var nombresProcedimientos = [];
    const buildRangesV = [];

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

    const findRangexProce = (proc) => {
        for (var i = 0; i < buildRangesV.length; i++) {
            if (buildRangesV[i][0] === proc) {
                return buildRangesV[i][1];
            }
        }
    }

    const transitivity = (proc, nombresProcedimientos) => {
        var x = nombresProcedimientos[1].length-2; //[[proce1, proce3, proce5, 22]. [proce3, proce5, 17]] [proce5, proce, 17]]
        var z = nombresProcedimientos[1].length-2;


        for (var m = 0; m < nombresProcedimientos.length; m++) {
            for (var r = 1; r < nombresProcedimientos.length; r++) {
                var lastproce = nombresProcedimientos[m][1];

                if (lastproce > 0) {
                    var lastproce = nombresProcedimientos[m][0];

                } else {
                    var lastproce = nombresProcedimientos[m][1];
                }
                console.log("last "+lastproce);


                //el ultimo procedimiento
                if (nombresProcedimientos[m][x] === nombresProcedimientos[r][0]
                    && nombresProcedimientos[r][2] > 0) {
                    //  console.log("lo encontróoo "+nombresProcedimientos[r][1]);
                    var num = nombresProcedimientos[m][2];
                    nombresProcedimientos[m][2] = nombresProcedimientos[r][1];
                    nombresProcedimientos[m][3] = num + findRangexProce(nombresProcedimientos[r][1]);
                }
            }
            }

        /*var r = nombresProcedimientos[1].length-2;
       // console.log("lenght "+nombresProcedimientos[0][0].length)
      //  console.log("prueba "+ r+ " prueba2 "+nombresProcedimientos[nombresProcedimientos.length-1][nombresProcedimientos.length-2]);
            for (var m = 0; m < nombresProcedimientos.length; m++) {
                for(var j= 0; j<nombresProcedimientos.length; j++){
                    var lastproce = nombresProcedimientos[m][r];
                    console.log("last "+lastproce);
                    console.log("row "+nombresProcedimientos[m][0]);
    
                    if(lastproce === nombresProcedimientos[m][0]){
                        console.log(" encontró cadena "+lastproce);
                    }
                }
        }*/
    }

    const posiXproc = (proc, procedimientos) => {
        procedimientos.this = procedimientos;
        buildRanges(procedimientos);
        for (var i = 0; i < n; i++) {
            horaComienzoInit = procedimientos[i].horaInicio.hora + (procedimientos[i].horaInicio.minutos / 60);
            horaLimiteInit = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
            var rango1 = findRangexProce(procedimientos[i].nombre);
            for (var j = 1; j < n; j++) {
                horaLimite = procedimientos[j].horaFin.hora + (procedimientos[j].horaFin.minutos / 60);
                horaComienzo = procedimientos[j].horaInicio.hora + (procedimientos[j].horaInicio.minutos / 60);
                var rango = rango1 + findRangexProce(procedimientos[j].nombre);
                if (horaLimiteInit <= horaComienzo) {
                    nombresProcedimientos.push([procedimientos[i].nombre, procedimientos[j].nombre, rango]);//Insertar nombre de procedimientos en un array
                }
            }
            
            transitivity("Proc1", nombresProcedimientos);

            /*
            if (i == n - 2 || i == n - 1) {
                horaLimite = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
                horaComienzo = procedimientos[i].horaInicio.hora + (procedimientos[i].horaInicio.minutos / 60);
                var rango2 = horaLimite - horaComienzo;
                nombresProcedimientos.push([procedimientos[i].nombre, rango2]);//Insertar nombre de procedimientos en un array        
            }*/
        }
/*
        for (var m = 0; m < nombresProcedimientos.length; m++) {
            for (var r = 1; r < nombresProcedimientos.length; r++) {
                var lastproce = nombresProcedimientos[m][1];

                if (lastproce > 0) {
                    var lastproce = nombresProcedimientos[m][0];

                } else {
                    var lastproce = nombresProcedimientos[m][1];
                }
                console.log("last "+lastproce);


                //el ultimo procedimiento
                if (nombresProcedimientos[m][1] === nombresProcedimientos[r][0]
                    && nombresProcedimientos[r][2] > 0) {
                    //  console.log("lo encontróoo "+nombresProcedimientos[r][1]);
                    var num = nombresProcedimientos[m][2];
                    nombresProcedimientos[m][2] = nombresProcedimientos[r][1];
                    nombresProcedimientos[m][3] = num + findRangexProce(nombresProcedimientos[r][1]);
                }
            }
        }*/
    }

    //buildRanges(procedimientos); //Retorna un array con arrays (que contienen el procedimiento y su delta)
    //findRangexProce("Proc2"); //Encuentra el delta de un procedimiento dependiendo del nombre de un procedimiento
    posiXproc("Proc1", procedimientos);


    //console.log("nombre proces agregados "+nombresProcedimientos[0]+" "+nombresProcedimientos[1]);
    //console.log("nombre proces agregados "+nombresProcedimientos[2]+" "+nombresProcedimientos[3]);

    //console.log(minutosAcum);
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