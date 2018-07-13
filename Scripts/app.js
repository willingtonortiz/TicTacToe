/* DEFINICIÓN DE CLASES */
class CJugador {
    constructor(nombre, simbolo) {
        this.Nombre = nombre;
        this.Puntaje = 0;
        this.Simbolo = simbolo;
        this.Jugada = null;
        
    }
}
class Par {
    constructor(valor1, valor2) {
        this.first = valor1;
        this.second = valor2;
    }
}
class CIA extends CJugador {
    //Funcion booleana
    PensarJugada(jugada, limitex, limitey, Tablero) {
        for (let y = jugada.Y - 2; y <= jugada.Y + 2; y++) {
            for (let x = jugada.X - 2; x <= jugada.X + 2; x++) {
                if (y < 0 || y >= limitey)
                    break;
                if (x < 0 || x >= limitex)
                    continue;
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
        if ((y - jugada.Y == 2 || y - jugada.Y == -2) && (x - jugada.X == 1 || x - jugada.X == -1))
            return false;
        if ((x - jugada.X == 2 || x - jugada.X == -2) && (y - jugada.Y == 1 || y - jugada.Y == -1))
            return false;
        let dy, dx;
        if (y > jugada.Y)
            dy = -1;
        else {
            if (y == jugada.Y)
                dy = 0;
            else
                dy = +1;
        }
        if (x > jugada.X)
            dx = -1;
        else {
            if (x == jugada.X)
                dx = 0;
            else
                dx = +1;
        }
      this.EvaluarPrioridad(dx,dy,x,y,jugada,Tablero);
    }
    EvaluarPrioridad(dx, dy, x, y, jugada, Tablero, salto = true,agregarJugadas=true) {
        let prioridad = 0;
        let limites = 0;
        while (limites < 2) {
            if (!(y + dy < Tablero.length && y + dy >= 0 && x + dx >= 0 && x + dx < Tablero[0].length) || Tablero[y + dy][x + dx] == this.Simbolo)
                limites++;
            else if (Tablero[y + dy][x + dx].Simbolo == '') {
                if (salto  )
                    if(y + 2 * dy < Tablero.length && y + 2 * dy >= 0 && x + 2 * dx >= 0 && x + 2 * dx < Tablero[0].length)
                    if(Tablero[y + 2 * dy][x + 2 * dx].Simbolo == jugada.Simbolo)
                        prioridad += this.EvaluarPrioridad(dx, dy, x + 2 * dx, y + 2 * dy, jugada, Tablero, false,false);
                    if(limites==0 && agregarJugadas ){
                        let posiblejugada = new CCoordenada(x + dx, y + dy);
                        posiblejugada.Simbolo = this.Simbolo;
                        let PJ=new Par(prioridad,posiblejugada);
                        this.PosiblesJugadas.push(PJ);
                    }
                salto=false;
                limites++;
            }
            x+=dx;
            y+=dy;
            if (limites == 1) {
                if(prioridad==0){
                dx *= -1;
                dy *= -1;
                }
                prioridad++;
            }
        }
        if(agregarJugadas==false)
        return prioridad;
    }
    BuscarJugadaOptima(Tablero) {
        let mayor = 0;
        for (let i = 1; i < this.PosiblesJugadas.length; ++i) {
            if (this.PosiblesJugadas[mayor].first <= this.PosiblesJugadas[i].first)
                mayor = i;
        }
        Tablero[this.PosiblesJugadas[mayor].second.Y][this.PosiblesJugadas[mayor].second.X].Simbolo = this.Simbolo;
        this.Jugada = Tablero[this.PosiblesJugadas[mayor].second.Y][this.PosiblesJugadas[mayor].second.X];
    }
    //Funcion void
    jugarIA(jugada, limitex, limitey, Tablero) {

       this.PosiblesJugadas = new Array(0);
        //Se analiza las posibles jugadas de defensa que se puede realizar
        this.PensarJugada(jugada, limitex, limitey, Tablero);
        if (this.Jugada != null) {
            //Se analiza las posibles jugadas de ataque que se pueden realizar
            this.PensarJugada(this.Jugada, limitex, limitey, Tablero)
            //Si no se puede realizar ninguna jugada de defensa ni ataque, se busca generar una jugada de ataque
           /* if (this.PosiblesJugadas.length == 0) {
                let jugadaNueva = new CCoordenada(this.Jugada.X, this.Jugada.Y);
                this.PensarJugada(jugadaNueva, limitex, limitey, Tablero);
            }*/
        }
        //Se selecciona la jugada con
        //Si no se puede generar ninguna jugada, se juega al azar
        if (this.PosiblesJugadas.length == 0)
            this.JugadaRandom(Tablero);
        else
            //Se selecciona la jugada con  mayor prioridad
            this.BuscarJugadaOptima(Tablero);
    }

    JugadaRandom(Tablero) {
        let y, x;
        do {
            y = Math.round(Math.random() * (Tablero.length - 1));
            x = Math.round(Math.random() * (Tablero[0].length - 1));
        } while (Tablero[y][x].Simbolo !== '');
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
            this.TurnosRestantes = this.Filas * this.Columnas;
            this.TerminoTurno = true;
            return this;
        }
    }

    //Funcion para hacer sleep
    Sleep(tiempo) {
        return new Promise((resolve) => setTimeout(resolve, tiempo));
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
    async Jugar(celda) {
        if (this.EsCeldaVacia(celda) && this.TerminoTurno) {
            //Jugada del jugador
            this.ObtenerCoordenada(celda).Simbolo = this.j1.Simbolo;
            this.TurnosRestantes--;
            this.ActualizarTablero();
            this.ContarPuntajes();
            this.TerminoTurno = false;
            //Espera un segundo
            await this.Sleep(1000);
            this.TerminoTurno = true;
            //Si ya se completo la tabla, la maquina no jugara (tablas impares)
            if (this.TurnosRestantes !== 0) {
                //Jugada de la maquina
                this.maquina.jugarIA(this.ObtenerCoordenada(celda), this.Columnas, this.Filas, this.Tablero);
                this.TurnosRestantes--;
            }
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