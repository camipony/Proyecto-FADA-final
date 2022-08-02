const { Console } = require('console');
let fs = require('fs');
/**
 * Nombres de los archivos de lectura y escritura, modifique como considere.
 */
let ARCHIVO_LECTURA = 'inBPD';
let ARCHIVO_ESCRITURA = 'outBPD';

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
 * Este método realiza el algoritmo para calcular la respuesta.
 * Complejidad O(n^2+2n) => O(n^2) 
 */

async function solve(n, m, libros) {
    
    var cantidadPaginas = [], posicion=0;//array cantidadPaginas y su respectiva posicion (x)
    var reparticion;//Cantidad de paginas maximas que puede tener un escritor
    var deltaFinal = 0;//Posición del ultimo libro de un escritor
    var librosIniciales = [];//Libros iniciales de los escritores
    var librosFinales = [];//Libros finales de los escritores
    var cantidadEscritores = n; //cantidad de escritores
   // var matrizPaginas = [];
    var paginasTotales = []; //paginas totales de un escritor
    var paginas; // paginas a usar por libro y escritor

    //No es necesaria en la solución del problema, solo para el diseño del algoritmo
    //-----------------------------------------------
   /* const matrizInicial = () => {
        for(var fil=0;fil<m;fil++){
            matrizPaginas[fil]=[];

            for(var col=0;col<m;col++)
                if(col>=fil) matrizPaginas[fil][col]=0;
                else matrizPaginas[fil][col]=1;
        }    
    } 
    matrizInicial();
    console.log(matrizPaginas);*/
    //-------------------------------------------------
    
    /** sumaSecuencial: Este metodo agrega a un arreglo la posicion final
     * del libro de un escritor.
     * su complejidad es O(n)
    */

    const sumaSecuencial = () => {
        var paginasLibroAnterior=0;
        for(var lib=0;lib<m;lib++){
            paginasTotales[lib]=libros[lib].paginas+paginasLibroAnterior;
            paginasLibroAnterior=paginasTotales[lib];
        }
        paginas = paginasTotales[paginasTotales.length-1];
    }
    sumaSecuencial();
    
    /** detallesTrabajo: Este metodo contiene los detalles del trabajo (realizar copias), 
     * detalles como libros finales e iniciales, 
    y la cantidad de dias que demora en realizarse las copias. 
    * Su complejidad es O(n) debido a que se hace una recursion con una función de este orden.
    * Cumple con ser una de las etapas del proceso de prog. dinamica
    */

    const detallesTrabajo = (inicio) => {
        var descartadas=0;
        if(inicio==0) descartadas = 0;
        else descartadas = paginasTotales[inicio-1];      
        librosIniciales.push(libros[inicio].nombre);
        console.log(libros[inicio].nombre)
        paginas = paginas-descartadas;
        reparticion = paginas/cantidadEscritores;
        libroFinal(inicio,reparticion,descartadas);//O(n)
        paginas = paginasTotales[paginasTotales.length-1]
        librosFinales.push(libros[deltaFinal].nombre);
        posicion++;
        cantidadEscritores -= 1;
        if(deltaFinal+1<m) detallesTrabajo(deltaFinal+1);
    }

    /** libroFinal. Este método calcula el último libro que un escritor puede realizar
     * dependiendo de la reparticion y de las paginas. 
     * Cumple con establecer pequeñas decisiones o los estados. 
     * Su complejidad es O(n) */    

    const libroFinal = (inicio,reparticion,librosDescartados) => {
        var final = Math.abs(paginasTotales[inicio]-librosDescartados-reparticion);//40-75=35;
        deltaFinal = inicio;
        console.log(final);
        var diferencia;

       for(var lib=inicio+1;lib<m;lib++){
             diferencia = Math.abs(paginasTotales[lib]-librosDescartados-reparticion);//70-75=5,90-75=15
             if(diferencia<final){
                deltaFinal = lib; 
                final = diferencia;
                cantidadPaginas[posicion] = paginasTotales[lib]-librosDescartados;
            }
        }
    }

    /**diasMaximos: Este metodo determina la mayor cantidad de paginas asignadas 
        para calcular el tiempo de demora. 
        Función 
        Su complejidad es O(n)*/

    const diasMaximos = (paginas) => {
        var dias = paginas[0];
        for(var w=1;w<paginas.length;w++){
            if(isNaN(dias)){
                dias = 0; 
            }
            if(dias<paginas[w]) dias=paginas[w]
        }
        return dias;
    }
    
    //Se mandan las pautas para imprimir la respuesta.
    detallesTrabajo(0);
    return new Respuesta(diasMaximos(cantidadPaginas), librosIniciales, librosFinales);
}

async function main() {
    const inp = await input();
    console.time('loop');
    let res = await solve(inp.n, inp.m, inp.libros);
    console.log(inp.libros)
    await output(res);
    console.timeEnd('loop');
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