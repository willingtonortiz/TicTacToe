/* DEFINICIÓN DE CLASES */
class CJugador {
    constructor(nombre, simbolo) {
        this.Nombre = nombre;
        this.Puntaje = 0;
        this.Simbolo = simbolo;
    }
}

class CCoordenada {
    constructor(x = 0, y = 0) {
        this.X = x;
        this.Y = y;
        this.Simbolo = '';
        this.Puntaje = 0;
        this.Libre = true;
    }
}

class CJuego {
    constructor(filas = 3, columnas = 3) {
        this.Filas = filas;
        this.Columnas = columnas;
        this.Turno = 'j1';
        this.ObtenerFilasColumnas();
        this.InicializarMatriz();
        this.InicializarTabla();
        this.j1 = new CJugador('', 'X');
        this.maquina = new CJugador('', 'O');
    }

    ObtenerFilasColumnas() {
        this.Filas = parseInt(document.getElementById('filas').value);
        this.Columnas = parseInt(document.getElementById('columnas').value);
    }

    //Creación de objetos en la matriz de juego
    InicializarMatriz() {
        this.Tablero = '';
        this.Tablero = new Array(this.Filas);
        for (let i = 0; i < this.Filas; ++i) {
            this.Tablero[i] = new Array(this.Columnas);
            for (let j = 0; j < this.Columnas; ++j) {
                this.Tablero[i][j] = new CCoordenada(i, j);
            }
        }
        return this;
    }

    InicializarTabla() {
        let contenedor = document.getElementById('contenedor');
        contenedor.innerHTML = '';
        let tabla = document.createElement('table');
        for (let i = 0; i < this.Filas; ++i) {
            let fila = document.createElement('tr');
            for (let j = 0; j < this.Columnas; ++j) {
                let celda = document.createElement('td');
                celda.setAttribute('id', i + '-' + j);
                //Cuando el usuario da click
                celda.addEventListener('click', (evento) => {
                    evento.currentTarget.innerText = this.Jugar(celda);
                });
                fila.appendChild(celda);
            }
            tabla.appendChild(fila);
        }
        contenedor.appendChild(tabla);
        return this;
    }

    Jugar(celda) {
        if (this.EsCeldaVacia(celda)) {
            if (this.Turno) {
                this.Turno = false;
                return this.j1.Simbolo;
            } else {
                this.Turno = true;
                return this.maquina.Simbolo;
            }
        } else return celda.innerText;
    }

    EsCeldaVacia(celda) {
        if (celda.innerText === '') return true;
        else return false;
    }

    ImprimirTableroConsola() {
        for (let i = 0; i < this.Filas; ++i) {
            let cadena = '';
            for (let j = 0; j < this.Columnas; ++j) {
                cadena += this.Tablero[i][j].Simbolo + '\t';
            }
            console.log(cadena);
        }
        return this;
    }

    ContarPuntaje() {
        let puntaje1 = 0,
            contador1 = 0;
        let puntaje2 = 0,
            contador2 = 0;

        //Conteo horizontal
        for (let i = 0; i < this.Filas; ++i) {
            for (let j = 0; j < this.Columnas; ++j) {
                if (this.Tablero[i][j].Simbolo === 'X') {
                    contador1++;
                    contador2 = 0;
                } else {
                    contador2++;
                    contador1 = 0;
                }
                if (contador1 >= 3) puntaje1++;
                if (contador2 >= 3) puntaje2++;
            }
            contador1 = contador2 = 0;
        }

        //Conteo vertical
        for (let j = 0; j < this.Columnas; ++j) {
            for (let i = 0; i < this.Filas; ++i) {
                if (this.Tablero[i][j].Simbolo === 'X') {
                    contador1++;
                    contador2 = 0;
                } else {
                    contador2++;
                    contador1 = 0;
                }
                if (contador1 >= 3) puntaje1++;
                if (contador2 >= 3) puntaje2++;
            }
            contador1 = contador2 = 0;
        }

        //Conteo diagonal

        console.log(puntaje1, puntaje2);
        return this;
    }
}

document.getElementById('botonJugar').addEventListener('click', () => {
    let juego = new CJuego();
});