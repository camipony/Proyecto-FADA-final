let fs = require('fs');
/**
 * Nombres de los archivos de lectura y escritura, modifique como considere.
 */
let ARCHIVO_LECTURA = 'Proyecto-FADA-final/inB';
let ARCHIVO_ESCRITURA = 'Proyecto-FADA-final/outB'

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
                let [n, m] = readLine().split(" ").map(e => parseInt(e));
                let libros = [];
                for(let i = 0 ; i < m; ++i){
                    let data = readLine().split(" ");
                    let nombre = data[0];
                    console.log(nombre);
                    let paginas = parseInt(data[1]);
                    console.log(paginas);
                    libros.push(new Libro(nombre, paginas));
                }
                console.log(n,m);
                resolve(new Entrada(n, m, libros));
            }
        });
    });
}
/**
 * Método para realizar la escritura de la respuesta del problema, no modificar.
 */
async function output(obj) {
    let out = obj.tiempoTotal + "\n";
    for( let i = 0 ; i < obj.libroQueEmpieza.length ; ++i){
        out+= obj.libroQueEmpieza[i] + " " + obj.libroQueTermina[i] +"\n";
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
async function solve(n, m, libros) {
    
    var cantidadPaginas = [], x=0;//array cantidadPaginas y su respectiva posicion (x)
    var reparticion;//Cantidad de paginas maximas que puede tener un escritor
    var deltaActual;
    var deltaAnterior = 0;
    var deltaFinal = 0;
    var sumPaginas = [];//Suma de las paginas de los libros en orden secuencial
    var librosIniciales = [];//Libros iniciales de los escritores
    var librosFinales = [];//Libros finales de los escritores
    var cantidadEscritores = n;
    var nuevoInicio = 0;

    //Cantidad de paginas totales inicialmente
    const paginas = (inicio) => {

        var anteriorLib = 0;//Paginas del libro anterior
       

        for(var h=0;h<m;h++){
            
            if(h<inicio){
               
                sumPaginas[h] = 0;
                
            }else{
                console.log(anteriorLib);
                console.log(libros[h].paginas)
                sumPaginas[h]=anteriorLib+libros[h].paginas;
                anteriorLib=sumPaginas[h];
            }

            
            
        }
        librosIniciales.push(libros[inicio].nombre);
        console.log(librosIniciales);
        console.log(sumPaginas);
        finSecuencia(sumPaginas);
    };
    
    console.log(libros);
    //posicion del libro final de un escritor
    const finSecuencia = (secuenciaLibros) => {
        reparticion = secuenciaLibros[secuenciaLibros.length-1]/cantidadEscritores;
        console.log(reparticion);
        
        for(var s=0;s<m;s++){
            
            deltaActual = Math.abs(secuenciaLibros[s]-reparticion);
    
            if(deltaActual<deltaAnterior){ 
                deltaFinal = s; 
                cantidadPaginas[x]=secuenciaLibros[deltaFinal];
            }
            
            deltaAnterior = deltaActual;
            console.log(deltaFinal);
        }

        librosFinales.push(libros[deltaFinal].nombre);
        x++;
        cantidadEscritores -= 1;
        nuevoInicio = deltaFinal+1;
        console.log(nuevoInicio);
        
        console.log(librosIniciales);
        console.log(librosFinales);
    }

    //costo O(n) -> Determinar la mayor cantidad de paginas asignadas para calcular el tiempo de demora
    const diasMaximos = (paginas) => {
        var dias = paginas[0];

        for(var w=1;w<paginas.length;w++){
            if(dias<paginas[w]) dias=paginas[w];
        }
        return dias;
    }


    const invocaciones = () => {
        paginas(0);
        var k = nuevoInicio;
        console.log(k);
        while(k<m){
            paginas(k);
            k = nuevoInicio;
            console.log(k);
        }
    }

    invocaciones();
    console.log(diasMaximos(cantidadPaginas));
    
    
    
    console.log(librosIniciales);
    console.log(librosFinales);
    
    return new Respuesta(diasMaximos(cantidadPaginas), librosIniciales, librosFinales);
}

async function main() {
    const inp = await input();
    let res = await solve(inp.n, inp.m, inp.libros);
    console.log(inp.libros)
    await output(res);
}


function Entrada(n, m, libros){
    this.n = n;
    this.m = m;
    this.libros = libros; 
}
function Libro(nombre, paginas){
    this.nombre = nombre;
    this.paginas = paginas;
}
function Respuesta(tiempoTotal, libroQueEmpieza, libroQueTermina){
    this.tiempoTotal = tiempoTotal;
    /**
     * Esta variable contiene en su posición i, el nombre del libro por el que empieza el i-ésimo
     * escritor.
     */
    this.libroQueEmpieza = libroQueEmpieza;
    /**
     * Esta variable contiene en su posición i, el nombre del libro por el que termina el i-ésimo
     * escritor.
     */
    this.libroQueTermina = libroQueTermina;
}

main();