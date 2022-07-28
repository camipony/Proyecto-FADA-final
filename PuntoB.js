let fs = require('fs');
/**
 * Nombres de los archivos de lectura y escritura, modifique como considere.
 */
let ARCHIVO_LECTURA = 'Repositorio/Javascript/inB';
let ARCHIVO_ESCRITURA = 'Repositorio/Javascript/outB'

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
    
    var cantidadDias;
    var librosMaximos;//Cantidad de libros maximos que puede tener un escritor
    var distribucionLib = -1;//Cantidad de libros distribuidos por escritor
    var librosIniciales = [];//Libros iniciales de los escritores
    var librosFinales = [];//Libros finales de los escritores
    var paginasLibro = [0];//Cantidad de paginas asginadas por escritor
    var x = 0;//Posicion de paginasLibro

    //Mas libros que escritores, solo funciona si (m/n) es par (por ahora)
    if(m>n){

        librosMaximos = m/n;
        for(var i=0;i<m;i++){
            distribucionLib++;

            if(distribucionLib>=librosMaximos){
                distribucionLib=0;
                x++;
                paginasLibro[x] = 0;
            }
            
            if(distribucionLib==0){
                librosIniciales[x] = libros[i].nombre;//primer libro de un escritor
            }else if(distribucionLib==librosMaximos-1) {
                librosFinales[x] = libros[i].nombre;//ultimo libro de un escritor
            }
            
            console.log(distribucionLib);
            paginasLibro[x] += libros[i].paginas;
        }
    }
    //si m=n -> m/n=1, 1 libro para cada escritor
    else if(m==n){

        for(var j=0;j<n;j++){
            librosIniciales[j] = libros[j].nombre; 
            librosFinales[j] = "";
            paginasLibro[j]=libros[j].paginas;
        }
    }
    console.log(librosIniciales);
    console.log(librosFinales);
    console.log(paginasLibro);

    cantidadDias = paginasLibro[0];
    
    for(var k=1;k<n;k++){
        if(cantidadDias<paginasLibro[k]) {cantidadDias = paginasLibro[k];}
    }

    return new Respuesta(cantidadDias, librosIniciales, librosFinales);
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