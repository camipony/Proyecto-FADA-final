const { Console } = require('console');
let fs = require('fs');
/**
 * Nombres de los archivos de lectura y escritura, modifique como considere.
 */
let ARCHIVO_LECTURA = 'Proyecto-FADA-final/inBPD';
let ARCHIVO_ESCRITURA = 'Proyecto-FADA-final/outBPD';

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
//O(n^2+2n) => O(n^2) 
async function solve(n, m, libros) {
    
    var cantidadPaginas = [], posicion=0;//array cantidadPaginas y su respectiva posicion (x)
    var reparticion;//Cantidad de paginas maximas que puede tener un escritor
    var deltaFinal = 0;//Posición del ultimo libro de un escritor
    var librosIniciales = [];//Libros iniciales de los escritores
    var librosFinales = [];//Libros finales de los escritores
    var cantidadEscritores = n;
    var matrizPaginas = [];
    var paginasTotales = [];
    var paginas;

    //No es necesaria en la solución del problema, solo para el diseño del algoritmo
    //-----------------------------------------------
    const matrizInicial = () => {
        for(var fil=0;fil<m;fil++){
            matrizPaginas[fil]=[];

            for(var col=0;col<m;col++)
                if(col>=fil) matrizPaginas[fil][col]=0;
                else matrizPaginas[fil][col]=1;
        }    
    } 
    matrizInicial();
    console.log(matrizPaginas);
    //-------------------------------------------------
    
    //O(n)
    const sumaSecuencial = () => {
        var paginasLibroAnterior=0;
        for(var lib=0;lib<m;lib++){
            paginasTotales[lib]=libros[lib].paginas+paginasLibroAnterior;
            paginasLibroAnterior=paginasTotales[lib];
        }
        paginas = paginasTotales[paginasTotales.length-1];
    }
    sumaSecuencial();
    console.log(paginasTotales);
    /*
    Realizar matriz de 0 y 1, 
    donde 1 represente los valores que pueden tomarse para restarle a la cantidad de paginasIniciales
    var matrizPaginas = [ [20,20+10,20+10+10], 
                        [10,10+10,10+10+30] ]*/


    
    console.log(libros[0].paginas);
    //posicion del libro final de un escritor -> O(n)
    
    //Contiene los detalles del trabajo (realizar copias), detalles como libros finales e iniciales, y la cantidad de dias que demora en realizarse las copias
    const detallesTrabajo = (inicio) => {
        
        var descartadas=0;

        if(inicio==0) descartadas = 0;
        else descartadas = paginasTotales[inicio-1];      

        console.log(descartadas);
        
        librosIniciales.push(libros[inicio].nombre);
        console.log(libros[inicio].nombre)
        paginas = paginas-descartadas;
        console.log(paginas)
        
        reparticion = paginas/cantidadEscritores;

        console.log(reparticion)
        
        libroFinal(inicio,reparticion,descartadas);//O(n)
        
        console.log(deltaFinal);
        paginas = paginasTotales[paginasTotales.length-1]
        librosFinales.push(libros[deltaFinal].nombre);
        console.log(libros[deltaFinal].nombre)
        posicion++;
        cantidadEscritores -= 1;

        if(deltaFinal+1<m) detallesTrabajo(deltaFinal+1);

    }

    //console.log(matrizPaginas[2]);
    //posicion final del ultimo libro un escritor
    
    const libroFinal = (inicio,reparticion,librosDescartados) => {
        var final = Math.abs(paginasTotales[inicio]-librosDescartados-reparticion);//40-75=35;
        deltaFinal = inicio;
        console.log(final);
        var diferencia;
        
        //O(n)
       for(var lib=inicio+1;lib<m;lib++){
             diferencia = Math.abs(paginasTotales[lib]-librosDescartados-reparticion);//70-75=5,90-75=15
                
             if(diferencia<final){
                deltaFinal = lib; 
                final = diferencia;
                console.log(deltaFinal)
                console.log(final);
                cantidadPaginas[posicion] = paginasTotales[lib]-librosDescartados;
            }
        
           

        }
        console.log(deltaFinal)
    }

    //costo O(n) -> Determinar la mayor cantidad de paginas asignadas para calcular el tiempo de demora
    const diasMaximos = (paginas) => {
        var dias = paginas[0];

        for(var w=1;w<paginas.length;w++){
            if(dias<paginas[w]) dias=paginas[w];
        }
        return dias;
    }
    
    detallesTrabajo(0);
   
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