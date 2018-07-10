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

    BloaquearJugada(jugada, limite, Tablero) {
        for (y = jugada.y - 2; y <= jugada.y + 2; y++) {
            for (x = jugada.x - 2; x <= jugada.x + 2; x++) {
                if (y < 0 || y > limite)
                    break;
                if (x < 0 || x > limite)
                    continue;
                if (Tablero[y][x].Simbolo == jugada.Simbolo) {
                    if (this.EvaluarJugada(x, y, jugada, Tablero))
                        return true;
                }
            }
        }
        return false;
    }
    EvaluarJugada(x, y, jugada, Tablero) {
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
        while (seguir && y + dy >= 0 && y + dy <= limite && x + dx >= 0 && x + dx <= limite) {
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

    jugarIA(jugada, limite, Tablero) {
        if (!this.BloaquearJugada(jugada, limite, Tablero)) {
            if (this.jugada != null)
                
        }
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
    constructor(filas = 3, columnas = 3) {
        this.Filas = filas;
        this.Columnas = columnas;
        this.InicializarMatriz();
    }

    //Creación de objetos en la matriz de juego
    InicializarMatriz() {
        this.Tablero = new Array(this.Filas);
        for (let i = 0; i < this.Filas; ++i) {
            this.Tablero[i] = new Array(this.Columnas);
            for (let j = 0; j < this.Columnas; ++j) {
                this.Tablero[i][j] = new CCoordenada(i, j);
            }
        }
        return this;
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

let juego = new CJuego(5, 5);

juego.ImprimirTableroConsola().ContarPuntaje();