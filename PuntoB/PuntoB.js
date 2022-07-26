let fs = require('fs');
/**
 * Nombres de los archivos de lectura y escritura, modifique como considere.
 */
let ARCHIVO_LECTURA = 'inB';
let ARCHIVO_ESCRITURA = 'outB'

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
//O(2n^2+n) => O(2n^2)
async function solve(n, m, libros) {
    
    var cantidadPaginas = [], x=0;//array cantidadPaginas y su respectiva posicion (x)
    var reparticion;//Cantidad de paginas maximas que puede tener un escritor
    var anteriorLib = 0;//Paginas del libro anterior
    var deltaFinal = 0;
    var sumPaginas = [];//Suma de las paginas de los libros en orden secuencial
    var librosIniciales = [];//Libros iniciales de los escritores
    var librosFinales = [];//Libros finales de los escritores
    var cantidadEscritores = n;
    var nuevoInicio = 0;

    //Cantidad de paginas totales inicialmente -> O(2n)
    /*
    Calculo de paginas:
    //[20,10,10,30,20,25] => [0+20,20+10,20+10+10,20+10+10+30,20+10+10+30+20,20+10+10+30+20+25]
    //[0,0,10,30,20,25] => [0,0,0+10,10+30,10+30+20,10+30+20+25]
    //[0,0,0,0,20,25] => [0,0,0,0,0+20,20+25]
    //[0,0,0,0,0,25] => [0,0,0,0,0,0+25]
    */
    const paginas = (inicio) => {
        anteriorLib = 0;
        //O(n)
        for(var h=0;h<m;h++){
            if(h>=inicio){
            sumPaginas[h]=anteriorLib+libros[h].paginas;
            anteriorLib=sumPaginas[h];
            }else{
                sumPaginas[h] = 0;
            }

        }
        librosIniciales.push(libros[inicio].nombre);
        finSecuencia(sumPaginas);//O(n)
    };
    
    //posicion del libro final de un escritor -> O(n)
    const finSecuencia = (secuenciaLibros) => {
        sumPaginas = secuenciaLibros;
        reparticion = sumPaginas[sumPaginas.length-1]/cantidadEscritores;
        var final = Math.abs(sumPaginas[0]-reparticion);
        var diferencia;

        for(var s=1;s<m;s++){
            diferencia = Math.abs(sumPaginas[s]-reparticion);
            if(diferencia<final){ 
                deltaFinal = s; 
                final = diferencia;
                cantidadPaginas[x]=sumPaginas[deltaFinal];
            }
        }
        librosFinales.push(libros[deltaFinal].nombre);
        x++;
        cantidadEscritores -= 1;
        nuevoInicio = deltaFinal+1;
    }

    //costo O(n) -> Determinar la mayor cantidad de paginas asignadas para calcular el tiempo de demora
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

    //O(2n^2)
    const invocaciones = () => {
        paginas(0);
        var k = nuevoInicio;

        //O(n)
        while(k<m){
            paginas(k);//O(2n)
            k = nuevoInicio;
        }
    }

    invocaciones();
    console.log(librosIniciales);
    console.log(librosFinales);
    
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