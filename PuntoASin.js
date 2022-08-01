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
                
                for(let i = 0 ; i < n; ++i){
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
    for( let i = 0 ; i < obj.n ; ++i){
        out+= obj.nombreProcedimientos[i] +"\n";
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
    var aI = [], aF = [], aP= [];

    const noEmptyArrays = () => {
        for(var i=0; i<n; i++){
            aI.push(procedimientos[i].horaInicio.hora+(procedimientos[i].horaInicio.minutos/60));
            aF.push(procedimientos[i].horaFin.hora+(procedimientos[i].horaFin.minutos/60));
            aP.push(procedimientos[i].nombre);
        }
    }

    noEmptyArrays();
    var i =0; j=1;

    const procHc = (proc, n) => {
        for (var i = 0; i < procedimientos.length; i++) {
            if (procedimientos[i].nombre === proc) {
                horaComienzo = procedimientos[i].horaInicio.hora + (procedimientos[i].horaInicio.minutos / 60);
                horaFin = procedimientos[i].horaFin.hora + (procedimientos[i].horaFin.minutos / 60);
            }
        }
        if(n == 1){
            return horaComienzo;
        }else{
            return horaFin;
        }
    }

    const cadenaMasLarga = (procNom) => {
        var p = aP.splice(aP.indexOf(procNom), aP.length);
        var hC = aI.splice(aI.indexOf(procHc(procNom,1)), aI.length);
        var hF = aF.splice(aF.indexOf(procHc(procNom,0)), aF.length);
        console.log("queda "+p);
        console.log("queda2 "+hC);
        console.log("queda3 "+hF);
        var str = "";
        var m = 0;
        for(var i = 1; i<p.length;i++){
            console.log("a "+hF[m]+" hc "+ hC[i]);
            if(hF[m] <= hC[i]){
                str += p[i];
                console.log("s "+str);
            }
            
            
            
        }
    }

    cadenaMasLarga(aP[0]);

    return new Respuesta(0, new Hora(0, 0), []);
}
async function main() {
    const p = await input();
    let res = await solve(p.length, p);
    await output(res);
}


function Respuesta(n, tiempoTotal, nombreProcedimientos){
    this.n = n;
    this.tiempoTotal = tiempoTotal;
    this.nombreProcedimientos = nombreProcedimientos;
}

function Procedimiento(nombre, horaInicio, horaFin){
    this.nombre = nombre;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    
}

class Hora {
    constructor(hora, minutos) {
        this.hora = hora;
        this.minutos = minutos;
    }
    toString(){
        let res = "";
        if (this.hora < 10)
            res+="0"+this.hora;
        else
            res+=this.hora; 
        res+=":";
        if (this.minutos < 10)
            res+="0"+this.minutos;
        else
            res+=this.minutos;
        return res;
    }
}
main();