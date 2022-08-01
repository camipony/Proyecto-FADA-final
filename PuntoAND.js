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
    var combinaciones = [];
    var rangos = [];
    var rango = 0;
    var horas, minutos;
    var horaFinal, minutosFinal, horaActual;
    var procFinales, horasFinales;

//Para cada procedimiento sacar la combinacion con más cantidad de horas
for(var d=0;d<n-1;d++){//(0,1,2,3

	combinaciones[d]=procedimientos[d].nombre;
    minutosFinal = procedimientos[d].horaFin.minutos/60;
    horaFinal = procedimientos[d].horaFin.hora+minutosFinal;
    horaActual = procedimientos[d].horaInicio.hora+(procedimientos[d].horaInicio.minutos/60)
    rango = horaFinal - horaActual;
    console.log(rango)
    console.log(horaFinal)

	for(var k=d+1;k<n;k++){//(1x,2y,3x,4y; 2x,3y,4y; 3x,4y; 4
        
        var minIniActual = procedimientos[k].horaInicio.minutos/60;
        var horaIniActual = procedimientos[k].horaInicio.hora+minIniActual;
        var minFinActual = procedimientos[k].horaFin.minutos/60;
        var horaFinActual = procedimientos[k].horaFin.hora+minFinActual;
        
		
        if(horaIniActual>=horaFinal){
            
            combinaciones[d] += "-"+procedimientos[k].nombre;
            horaFinal = horaFinActual;//2y->22
            rango += horaFinActual - horaIniActual;
        }  
	}   
        if(rango<=24)
        rangos[d] = rango;
        else 
        rangos[d] = 0;
}

console.log(combinaciones[0])
console.log(combinaciones[1])
console.log(combinaciones[2])
console.log(combinaciones[3])
console.log(rangos);
console.log(combinaciones.length)



    procFinales = combinaciones[0].split("-");
    horasFinales = rangos[0];
    
    for(var v=1;v<n;v++){
        
        if(horasFinales<rangos[v]){
            procFinales=combinaciones[v].split("-");
            horasFinales=rangos[v];
        }
            
    }


//rangoMayor()
    horasFinales = (horasFinales+"").split(".");
    horas = horasFinales[0];
    minutos = Math.trunc(parseFloat(0+"."+horasFinales[1])*60);
    

    console.log(horas)
    console.log(minutos)

    console.log(procFinales)
    
    return new Respuesta(procFinales.length, new Hora(horas, minutos), procFinales);
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