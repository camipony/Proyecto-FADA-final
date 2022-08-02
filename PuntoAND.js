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
    var horaFinal, horaActual;
    var procFinales, horasFinales;
    var horasIni=[], horasIniSort = [];
    var horasFin = [], horasFinSort = [];
    var nombreProc = [], nombreProcSort = [];

    for(var i=0; i<n; i++){
        horasIni.push(procedimientos[i].horaInicio.hora+(procedimientos[i].horaInicio.minutos/60));
        horasFin.push(procedimientos[i].horaFin.hora+(procedimientos[i].horaFin.minutos/60));
        nombreProc.push(procedimientos[i].nombre);
    } 
    
   
    const buildRanges = (horasInic) => {
        for(var i=0; i<n; i++){
            horasInic.push(procedimientos[i].horaInicio.hora+
            (procedimientos[i].horaInicio.minutos/60));
        }
        horasInic.sort(function (a, b) {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });
    }

    buildRanges(horasIniSort)

    const emparejar = () =>{
        var inicio = 0;
        var x = 0;
        var y = 0;
        var prohibidos = [];
    
        while(inicio<horasIni.length){
            if(horasIniSort[inicio]==horasIni[x] && nombreProc[x]!=prohibidos[x]){//horasIniSort[0]=horasIni[1]|procSort[0]=proc[1]
                
                horasFinSort[inicio]=horasFin[x];
                nombreProcSort[inicio]=nombreProc[x];
                y=x;
                prohibidos[x]=nombreProc[x];
                x = 0;
                inicio++;
                
            }else x++;
        }
        console.log(prohibidos)
        
    }
    emparejar();
    
    console.log(horasIni)
    console.log(isNaN(horasIni[0]))
    console.log(horasIniSort)
    console.log(horasFin)
    console.log(horasFinSort)
    console.log(nombreProc)
    console.log(nombreProcSort)

//Para cada procedimiento sacar la combinacion con más cantidad de horas
for(var d=0;d<n-1;d++){//(0,1,2,3

	combinaciones[d]=nombreProcSort[d];
    horaFinal = horasFinSort[d];
    horaActual = horasIniSort[d];
    rango = horaFinal - horaActual;
    console.log(rango)
    console.log(horaFinal)

	for(var k=d+1;k<n;k++){//(1x,2y,3x,4y; 2x,3y,4y; 3x,4y; 4
        var horaIniActual = horasIniSort[k];
        var horaFinActual = horasFinSort[k];
        
		
        if(horaIniActual>=horaFinal){
            
            combinaciones[d] += "-"+nombreProcSort[k];
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
    console.log(horasFinales)
    horas = horasFinales[0];
    minutos = Math.trunc(parseFloat(0+"."+horasFinales[1])*60);
    

    console.log(horas)

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