/* DEFINICIÓN DE CLASES */
class CJugador {
    constructor(nombre, simbolo) {
        this.Nombre = nombre;
        this.Puntaje = 0;
        this.Simbolo = simbolo;
        this.jugada = null;
    }
    jugada(CCoordenada) {
        this.jugada = CCoordenada;
    }
}
class CIA extends CJugador {

    BloaquearJugada(jugada, limitex,limitey, Tablero) {
        for (y = jugada.y - 2; y <= jugada.y + 2; y++) {
            for (x = jugada.x - 2; x <= jugada.x + 2; x++) {
                if (y < 0 || y > limitex)
                    break;
                if (x < 0 || x > limitey)
                    continue;
                if (Tablero[y][x].Simbolo == jugada.Simbolo) {
                    if (this.EvaluarJugada(x, y, jugada, Tablero))
                        return true;
                }
            }
        }
        return false;
    }
    EvaluarJugada(x, y, jugada, Tablero,limitex,limitey) {
        if (y > jugada.y)
            dy = -1;
        else {
            if (y == jugada.y)
                dy = 0;
            else
                dy = +1;
        }
        if (x > jugada.x)
            dx = -1;
        else {
            if (x == jugada.x)
                dx = 0;
            else
                dx = +1;
        }
        seguir = true;
        choque = true;
        while (seguir && y + dy >= 0 && y + dy <= limitey && x + dx >= 0 && x + dx <= limitex) {
            if (Tablero[y + dy][x + dx].simbolo === "") {
                Tablero[y + dy][x + dx].simbolo = this.simbolo;
                this.jugada = Tablero[y + dy][x + dx];
                seguir = false;
            }
            else {
                if (Tablero[y + dy][x + dx].simbolo === this.simbolo) {
                    dy *= -1;
                    dx *= -1;
                    if (choque == true)
                        choque = false;
                    else
                        break;
                }
            }
            x += dx;
            y += dy;
        }
        return !seguir;
    }

    jugarIA(jugada, limitex,limitey, Tablero) {
        if (!this.BloaquearJugada(jugada, limitex,limitey, Tablero)) {
            if (this.jugada != null)
                this.BloaquearJugada(this.jugada, limitex,limitey, Tablero);
            else {
                Tablero[0][0].simbolo = this.simbolo;
                this.jugada = Tablero[0][0];
            }



        }
    }
}
class CCoordenada {
    constructor(x = 0, y = 0) {
        this.X = x;
        this.Y = y;
        this.Simbolo = 'X';
    }
}

class CJuego {
    //Contructor
    constructor(filas = 3, columnas = 3) {
        this.Filas = filas;
        this.Columnas = columnas;
        this.Turno = 'j1';
       
        this.ObtenerFilasColumnas();
        var onlyNumbers=/\w/;
        if(!onlyNumbers.test(this.Filas) && !onlyNumbers.test(this.Columnas))
        {       
        this.InicializarMatriz();
        this.InicializarTabla();
        this.j1 = new CJugador('', 'X');
        this.maquina = new CJugador('', 'O');
        return this;
        }
        else
        {
            alert("Solo ingresar numeros");
        }
    }

    //Obtiene las filas y las columnas de los inputs
    ObtenerFilasColumnas() {
        this.Filas = parseInt(document.getElementById('filas').value);
        this.Columnas = parseInt(document.getElementById('columnas').value);
    }

    //Creación la matriz del juego
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

    //Realiza una iteracion en el juego
    Jugar(celda) {
        if (this.EsCeldaVacia(celda)) {
            if (this.Turno) {
                this.Turno = true;
                return this.j1.Simbolo;
            } else {
                this.Turno = true;
                return this.maquina.Simbolo;
            }
        } else return celda.innerText;
    }

    //Devuelve true si la celda esta vacia
    EsCeldaVacia(celda) {
        if (celda.innerText === '') return true;
        else return false;
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
                    } else {
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
                    } else {
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
        //puntaje1 tiene el puntaje del jugador 1
        //puntaje2 tiene el puntaje del jugador 2 o maquina
        return this;
    }
}

document.getElementById('botonJugar').addEventListener('click', () => {
    let juego = new CJuego();
});