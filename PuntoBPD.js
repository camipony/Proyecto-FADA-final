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
async function solve(n, m, libros) {
    
    var cantidadPaginas = [], posicion=0;//array cantidadPaginas y su respectiva posicion (x)
    var reparticion;//Cantidad de paginas maximas que puede tener un escritor
    var anteriorLib = 0;//Paginas del libro anterior
    var deltaActual;
    var deltaFinal = 0;
    var sumPaginas = [];//Suma de las paginas de los libros en orden secuencial
    var librosIniciales = [];//Libros iniciales de los escritores
    var librosFinales = [];//Libros finales de los escritores
    var cantidadEscritores = n;
    var nuevoInicio = 0;

    const matrizPaginas = () => {
        for(var f=0;f<m;f++)
            matrizPaginas[f]=[];
    } 
    matrizPaginas();
    /*var matrizPaginas = [ [20,20+10,20+10+10], 
                        [10,10+10,10+10+30] ]*/

    /*Matriz que contiene las distintas formas en que los paginas de los libros
    pueden distribuirse desde un punto inicial*/
    const matrizReparticion = () => {
        var x = 0;
        var y = 0;
        var posibilidadesCol = m;
        var limite = 0;

        while(y<m){//O(n)
            if(x>=y){
                matrizPaginas[y][x] = limite+libros[x].paginas;//m[0][0]=0+20 =>20;m[0][1]=20+10 => 30;m[0][2]=30+10 => 40;m[0][3]=40+30=>70;m[0][4]=70+20=>90;m[0][5]=90+25=>115
                limite = matrizPaginas[y][x];//limite=20;limite=30,limite=40,limite=70,limite=90
                x++;//x=1;x=2;x=3;x=4;x=5;x=6
                posibilidadesCol--;//pCol=5;pCol=4;pCol=3;pCol=2;pCol=1;pCol=0
            }else{
                matrizPaginas[y][x] = 0;
                x++;
                posibilidadesCol--;
            }


            if(posibilidadesCol==0){
                limite = 0;
                posibilidadesCol = m;//6-1=>5
                y++;//y=1
                x = 0;
            }else y += 0;//y no se mueve mientras no se hayan insertado todos los elementos x en y O(n)
        }
    }
    matrizReparticion();
    console.log(matrizPaginas[2]);

    
    console.log(libros[0].paginas);
    //posicion del libro final de un escritor
    const finSecuencia = (inicio) => {
        var deltaAnterior = 0;
        nuevoInicio = inicio;
        librosIniciales.push(libros[nuevoInicio].nombre);

        reparticion = matrizPaginas[nuevoInicio][matrizPaginas[nuevoInicio].length-1]/cantidadEscritores;
        console.log(reparticion);
        
        for(var s=0;s<m;s++){
            
            deltaActual = Math.abs(matrizPaginas[nuevoInicio][s]-reparticion);//10-28.33
    
            if(deltaActual<deltaAnterior){ 
                deltaFinal = s; 
                cantidadPaginas[posicion]=matrizPaginas[nuevoInicio][deltaFinal];
                cambioDeltaFinal=true;
                console.log(cantidadPaginas);
            }

            deltaAnterior = deltaActual;
            console.log(deltaFinal);
        }
        librosFinales.push(libros[deltaFinal].nombre);
        posicion++;
        cantidadEscritores -= 1;

        if(deltaFinal+1<m) finSecuencia(deltaFinal+1);

    }

    //costo O(n) -> Determinar la mayor cantidad de paginas asignadas para calcular el tiempo de demora
    const diasMaximos = (paginas) => {
        var dias = paginas[0];

        for(var w=1;w<paginas.length;w++){
            if(dias<paginas[w]) dias=paginas[w];
        }
        return dias;
    }

    finSecuencia(0);
    //invocaciones();
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