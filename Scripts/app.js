/* DEFINICIÓN DE CLASES */
class CJugador {
    constructor(nombre, simbolo) {
        this.Nombre = nombre;
        this.Puntaje = 0;
        this.Simbolo = simbolo;
        this.Jugada = null;
    }
}

class CIA extends CJugador {
    //Funcion booleana
    PensarJugada(jugada, limitex, limitey, Tablero) {
        for (let y = jugada.Y - 2; y <= jugada.Y + 2; y++) {
            for (let x = jugada.X - 2; x <= jugada.X + 2; x++) {
                if (y < 0 || y >= limitey) {
                    break;
                }
                if (x < 0 || x >= limitex) {
                    continue;
                }
                if (Tablero[y][x].Simbolo == jugada.Simbolo && Tablero[y][x] != jugada) {
                    if (this.EvaluarJugada(x, y, jugada, Tablero, limitex, limitey)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //Funcion booleana
    EvaluarJugada(x, y, jugada, Tablero, limitex, limitey) {
        let dy, dx;
        if (y > jugada.Y) {
            dy = -1;
        } else {
            if (y == jugada.Y) {
                dy = 0;
            } else {
                dy = +1;
            }
        }
        if (x > jugada.X) {
            dx = -1;
        } else {
            if (x == jugada.X) {
                dx = 0;
            } else {
                dx = +1;
            }
        }
        if ((y - jugada.Y == 2 || y - jugada.Y == -2) && (x - jugada.X == 1 || x - jugada.X == -1)) {
            return false;
        }
        if ((x - jugada.X == 2 || x - jugada.X == -2) && (y - jugada.Y == 1 || y - jugada.Y == -1)) {
            return false;
        }
        let seguir = true;
        let choque = true;
        while (seguir) {
            if (y + dy < 0 || y + dy >= limitey || x + dx < 0 || x + dx >= limitex) {
                dy *= -1;
                dx *= -1;
                if (choque == true) {
                    choque = false;
                } else {
                    break;
                }
            }
            if (Tablero[y + dy][x + dx].Simbolo == '') {
                Tablero[y + dy][x + dx].Simbolo = this.Simbolo;
                this.Jugada = Tablero[y + dy][x + dx];
                seguir = false;
            } else {
                if (Tablero[y + dy][x + dx].Simbolo === this.Simbolo) {
                    dy *= -1;
                    dx *= -1;
                    if (choque == true) {
                        choque = false;
                    } else {
                        break;
                    }
                }
            }
            x += dx;
            y += dy;
        }
        return !seguir;
    }

    //Funcion void
    jugarIA(jugada, limitex, limitey, Tablero) {
        if (!this.PensarJugada(jugada, limitex, limitey, Tablero)) {
            if (this.Jugada != null) {
                if (!this.PensarJugada(this.Jugada, limitex, limitey, Tablero)) {
                    this.Jugada.Simbolo = '';
                    this.PensarJugada(this.Jugada, limitex, limitey, Tablero);
                }
            } else {
                this.JugadaRandom(Tablero);
                //alert("primer turno");
            }
        } else {
            //alert("jugada evitada");
        }
        //alert("se jugo en: " + this.Jugada.X + " " + this.Jugada.Y);
    }

    JugadaRandom(Tablero) {
        let y, x;
        do {
            y = Math.round(Math.random() * (Tablero.length - 1));
            x = Math.round(Math.random() * (Tablero[0].length - 1));
        } while (Tablero[y][x].Simbolo !== '')
        Tablero[y][x].Simbolo = this.Simbolo;
        this.Jugada = Tablero[y][x];
    }
}

class CCoordenada {
    constructor(x = 0, y = 0) {
        this.X = x;
        this.Y = y;
        this.Simbolo = '';
    }
}

class CJuego {
    //Contructor
    constructor() {
        this.Turno = 'j1';
        if (this.ValidarYObtenerNumeros()) {
            this.InicializarMatriz();
            this.InicializarTabla();
            let nombreJugador = document.getElementById('NombreJugador');
            this.j1 = new CJugador(nombreJugador, 'X');
            this.maquina = new CIA('Ultron', 'O');
            return this;
        }
    }

    //Obtiene y valida las filas y las columnas de los inputs
    ValidarYObtenerNumeros() {
        let filas = document.getElementById('filas').value;
        let columnas = document.getElementById('columnas').value;
        let onlyNumbers = /^([0-9])*$/; //es una expresion regular

        //si no es un numero ej filas = a || columnas = c
        if (isNaN(filas) && isNaN(columnas)) {
            alert("Ingresar Valores Correctamente");
            return false;
        }

        //En caso filas este vacio o no sea un numero
        if (isNaN(filas) && !isNaN(columnas)) {
            alert("Ingresar Cantidad de Filas");
            return false;
        }

        //En caso columnas este vacio o no sea un numero
        if (!isNaN(filas) && isNaN(columnas)) {
            alert("Ingresar Cantidad de Columnas");
            return false;
        }

        //encaso se ingrese numeros con otro caracter ejemplo 1s 2 "espacio" "3 m"
        //si encuentra una letra retorar falso
        if (!onlyNumbers.test(filas) || !onlyNumbers.test(columnas)) {
            alert("Solo ingresar numeros");
            return false;
        }
        if (filas <= 2) filas = 3;
        if (columnas <= 2) columnas = 3;
        this.Filas = filas;
        this.Columnas = columnas;
        return true;
    }

    //Creación la matriz del juego
    InicializarMatriz() {
        this.Tablero = '';
        this.Tablero = new Array(this.Filas);
        for (let i = 0; i < this.Filas; ++i) {
            this.Tablero[i] = new Array(this.Columnas);
            for (let j = 0; j < this.Columnas; ++j) {
                this.Tablero[i][j] = new CCoordenada(j, i);
            }
        }
        return this;
    }

    //Crea la tabla que se mestra en la pantalla
    InicializarTabla() {
        let contenedor = document.getElementById('contenedor');
        contenedor.innerHTML = '';
        let tabla = document.createElement('table');
        for (let i = 0; i < this.Filas; ++i) {

            let fila = document.createElement('tr');
            for (let j = 0; j < this.Columnas; ++j) {
                let celda = document.createElement('td');
                celda.setAttribute('id', i + '-' + j);
                celda.classList.add('celda');
                //Cuando el usuario da click
                celda.addEventListener('click', (evento) => {
                    this.Jugar(celda);
                });
                fila.appendChild(celda);
            }
            tabla.appendChild(fila);
        }
        contenedor.appendChild(tabla);
        return this;
    }

    //Realiza una iteracion en el juego
    Jugar(celda) {
        if (this.EsCeldaVacia(celda)) {
            //Jugada del jugador
            this.ObtenerCoordenada(celda).Simbolo = this.j1.Simbolo;

            //Jugada de la maquina
            this.maquina.jugarIA(this.ObtenerCoordenada(celda), this.Columnas, this.Filas, this.Tablero);
            this.ActualizarTablero();
            this.ContarPuntajes();
        }
    }

    ActualizarTablero() {
        let celdas = document.getElementsByClassName('celda');
        for (let i = 0; i < celdas.length; ++i) {
            celdas[i].innerText = this.Tablero[Math.floor(i / this.Columnas)][i % this.Columnas].Simbolo;
        }
    }

    ObtenerCoordenada(celda) {
        let cadena = celda.getAttribute('id');
        cadena = cadena.split('-');
        let fila = cadena[0].toString();
        let columna = cadena[1].toString();
        return this.Tablero[fila][columna];
    }

    //Devuelve true si la celda esta vacia
    EsCeldaVacia(celda) {
        return celda.innerText === ''
    }

    //Funcion que imprime el tablero en la consola
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

    //Funcion que cuenta los puntajes de los jugadores
    ContarPuntajes() {
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
                } else if (this.Tablero[i][j].Simbolo === 'O') {
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
                } else if (this.Tablero[i][j].Simbolo === 'O') {
                    contador2++;
                    contador1 = 0;
                }
                if (contador1 >= 3) puntaje1++;
                if (contador2 >= 3) puntaje2++;
            }
            contador1 = contador2 = 0;
        }

        //Conteo diagonal
        //Diagonal de 135 grados
        let cantDiag = this.Filas + this.Columnas - 1,
            maxDiag = Math.max(this.Filas, this.Columnas),
            inicio1 = this.Filas - 1,
            inicio2 = 0;
        for (let m = 0; m < cantDiag; ++m) {
            for (let n = 0; n < maxDiag; ++n) {
                if (this.Tablero[inicio1 + n] !== undefined && this.Tablero[inicio1 + n][inicio2 + n] !== undefined) {
                    if (this.Tablero[inicio1 + n][inicio2 + n].Simbolo === 'X') {
                        contador1++;
                        contador2 = 0;
                    } else if (this.Tablero[inicio1 + n][inicio2 + n].Simbolo === 'O') {
                        contador2++;
                        contador1 = 0;
                    }
                    if (contador1 >= 3) puntaje1++;
                    if (contador2 >= 3) puntaje2++;
                }
            }
            if (inicio1 !== 0) inicio1--;
            else inicio2++;
            contador1 = contador2 = 0;
        }
        //Diagonal de 45 grados
        inicio1 = 0;
        inicio2 = 0;
        for (let m = 0; m < cantDiag; ++m) {
            for (let n = 0; n < maxDiag; ++n) {
                if (this.Tablero[inicio1 - n] !== undefined && this.Tablero[inicio1 - n][inicio2 + n] !== undefined) {
                    if (this.Tablero[inicio1 - n][inicio2 + n].Simbolo === 'X') {
                        contador1++;
                        contador2 = 0;
                    } else if (this.Tablero[inicio1 - n][inicio2 + n].Simbolo === 'O') {
                        contador2++;
                        contador1 = 0;
                    }
                    if (contador1 >= 3) puntaje1++;
                    if (contador2 >= 3) puntaje2++;
                }
            }
            if (inicio1 !== this.Filas - 1) inicio1++;
            else inicio2++;
            contador1 = contador2 = 0;
        }
        this.ActualizarPuntajes(puntaje1, puntaje2);
        return this;
    }

    ActualizarPuntajes(puntaje1, puntaje2) {
        document.getElementById('puntaje').innerText = puntaje1 + ' - ' + puntaje2;
        return this;
    }
}

document.getElementById('botonJugar').addEventListener('click', () => {
    let juego = new CJuego();
});