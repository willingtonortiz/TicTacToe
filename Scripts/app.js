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
        this.EvaluarPrioridad(dx, dy, x, y, jugada, Tablero);
    }
    EvaluarPrioridad(dx, dy, x, y, jugada, Tablero, salto = true, agregarJugadas = true) {
        let prioridad = 0;
        let limites = 0;
        let cambio = false;
        while (limites < 2) {
            if (!(y + dy < Tablero.length && y + dy >= 0 && x + dx >= 0 && x + dx < Tablero[0].length) || (Tablero[y + dy][x + dx].Simbolo != jugada.Simbolo && Tablero[y + dy][x + dx].Simbolo != '')) {
                limites++;
                cambio = true;
                if (limites == 1)
                    break;
            }
            else if (Tablero[y + dy][x + dx].Simbolo == '') {
                console.log('Turno de bot');
                document.getElementsByClassName('neon-svg')[0].classList.add('turnoHumano');
                document.getElementsByClassName('neon-svg')[1].classList.remove('turnoAI');

                prioridad = this.ContarCadena(x + dx, y + dy, dx * -1, dy * -1, jugada.Simbolo, Tablero);
                if (salto)
                    if (y + 2 * dy < Tablero.length && y + 2 * dy >= 0 && x + 2 * dx >= 0 && x + 2 * dx < Tablero[0].length)
                        if (Tablero[y + 2 * dy][x + 2 * dx].Simbolo == jugada.Simbolo) {
                            prioridad++;
                            this.AgregarJugada(x, y, dx, dy, prioridad,true);
                            prioridad --;
                        }
                if (agregarJugadas && prioridad > 0) {
                    this.AgregarJugada(x, y, dx, dy, prioridad);
                    prioridad = 0;
                }
                cambio = true;
                limites++;
            }
            x += dx;
            y += dy;
            if (cambio) {
                dx *= -1;
                dy *= -1;
                cambio = false;
            }

            if (agregarJugadas == false && limites == 2)
                break;
        }
        if (agregarJugadas == false)
            return prioridad;
    }
    ContarCadena(x, y, dx, dy, simbolo, Tablero) {
        let contador = 0;
        while (true) {
            if (!(y + dy < Tablero.length && y + dy >= 0 && x + dx >= 0 && x + dx < Tablero[0].length) || Tablero[y + dy][x + dx].Simbolo != simbolo)
                break;
            contador++;
            y += dy;
            x += dx;
        }
        if (contador >= 2)
            return 1;
        return 0;
    }
    AgregarJugada(x, y, dx, dy, prioridad,salto=false) {
        let posiblejugada = new CCoordenada(x + dx, y + dy);
        posiblejugada.Simbolo = this.Simbolo;
        let datosPosibleJugada = new Array();
        datosPosibleJugada.push(prioridad);
        let direccion = new Par(dx, dy);
        datosPosibleJugada.push(direccion);
        datosPosibleJugada.push(posiblejugada);
        if (!this.BuscarJugada(datosPosibleJugada)){
            if(!salto)
            this.PosiblesJugadas.push(datosPosibleJugada);
            else{
                datosPosibleJugada[1].first*=-1;
                datosPosibleJugada[1].second*=-1;
                if(!this.BuscarJugada(datosPosibleJugada)){
                    datosPosibleJugada[1].first*=-1;
                    datosPosibleJugada[1].second*=-1;
                    this.PosiblesJugadas.push(datosPosibleJugada);
                }
            }
        }
        }
    BuscarJugada(datosPosibleJugada) {
        let repetido = false;
        for (let i = 0; i < this.PosiblesJugadas.length; ++i) {
            if (this.PosiblesJugadas[i][2].X == datosPosibleJugada[2].X && this.PosiblesJugadas[i][2].Y == datosPosibleJugada[2].Y) {
                if (this.PosiblesJugadas[i][1].first != datosPosibleJugada[1].first || this.PosiblesJugadas[i][1].second != datosPosibleJugada[1].second)
                    this.PosiblesJugadas[i][0] += datosPosibleJugada[0];
                repetido = true;
            }
        }
        return repetido;
    }
    BuscarJugadaOptima(Tablero) {
        let mayor = 0;
        for (let i = 1; i < this.PosiblesJugadas.length; ++i) {
            if (this.PosiblesJugadas[mayor][0] < this.PosiblesJugadas[i][0])
                mayor = i;
        }
        Tablero[this.PosiblesJugadas[mayor][2].Y][this.PosiblesJugadas[mayor][2].X].Simbolo = this.Simbolo;
        this.Jugada = Tablero[this.PosiblesJugadas[mayor][2].Y][this.PosiblesJugadas[mayor][2].X]
        document.getElementById(this.Jugada.Y + '-' + this.Jugada.X).classList.add('ColorAzul');
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
    jugarIA2(simbolo, Tablero) {
        this.PosiblesJugadas = new Array(0);
        for (let i = 0; i < Tablero.length; ++i) {
            for (let j = 0; j < Tablero[0].length; ++j) {
                if (Tablero[i][j].Simbolo != '')
                    this.PensarJugada(Tablero[i][j], Tablero[0].length, Tablero.length, Tablero);
            }
        }
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
        document.getElementById(Tablero[y][x].Y + '-' + Tablero[y][x].X).classList.add('ColorAzul');
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
            celda.classList.add('ColorRojo');
            console.log('Turno humano');
            document.getElementsByClassName('neon-svg')[1].classList.add('turnoAI');
            document.getElementsByClassName('neon-svg')[0].classList.remove('turnoHumano');
            let coordenada = this.ObtenerCoordenada(celda);
            coordenada.Simbolo = this.j1.Simbolo;
            this.TurnosRestantes--;
            this.ActualizarTablero();
            this.ContarPuntajes();
            this.TerminoTurno = false;
            //Espera un segundo
            let tiempo = Math.round(Math.random() * 1000 + 500);
            await this.Sleep(tiempo);
            this.TerminoTurno = true;
            //Si ya se completo la tabla, la maquina no jugara (tablas impares)
            if (this.TurnosRestantes !== 0) {
                //Jugada de la maquina
                // this.maquina.jugarIA(coordenada, this.Columnas, this.Filas, this.Tablero);
                this.maquina.jugarIA2(this.j1.Simbolo, this.Tablero);
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

    ObtenerCelda(coordenada) {
        return document.getElementById(coordenada.Y + '-' + coordenada.X);
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
        let Marcados1, Marcados2;
        //Conteo horizontal
        for (let i = 0; i < this.Filas; ++i) {
            Marcados1 = new Array();
            Marcados2 = new Array();
            for (let j = 0; j < this.Columnas; ++j) {
                if (this.Tablero[i][j].Simbolo === 'X') {
                    contador1++;
                    Marcados1.push(this.Tablero[i][j]);
                    contador2 = 0;
                    Marcados2 = new Array();
                } else if (this.Tablero[i][j].Simbolo === 'O') {
                    contador1 = 0;
                    Marcados1 = new Array();
                    contador2++;
                    Marcados2.push(this.Tablero[i][j]);
                } else {
                    contador1 = contador2 = 0;
                    Marcados1 = new Array();
                    Marcados2 = new Array();
                }
                if (contador1 >= 3) {
                    puntaje1++;
                    this.MarcarTresEnRaya(Marcados1, 'X');
                }
                if (contador2 >= 3) {
                    puntaje2++;
                    this.MarcarTresEnRaya(Marcados2, 'O');
                }
            }
            contador1 = contador2 = 0;
        }
        //Conteo vertical
        for (let j = 0; j < this.Columnas; ++j) {
            Marcados1 = new Array();
            Marcados2 = new Array();
            for (let i = 0; i < this.Filas; ++i) {
                if (this.Tablero[i][j].Simbolo === 'X') {
                    contador1++;
                    Marcados1.push(this.Tablero[i][j]);
                    contador2 = 0;
                    Marcados2 = new Array();
                } else if (this.Tablero[i][j].Simbolo === 'O') {
                    contador1 = 0;
                    Marcados1 = new Array();
                    contador2++;
                    Marcados2.push(this.Tablero[i][j]);
                } else {
                    contador1 = contador2 = 0;
                    Marcados1 = new Array();
                    Marcados2 = new Array();
                }
                if (contador1 >= 3) {
                    puntaje1++;
                    this.MarcarTresEnRaya(Marcados1, 'X');
                }
                if (contador2 >= 3) {
                    puntaje2++;
                    this.MarcarTresEnRaya(Marcados2, 'O');
                }
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
            Marcados1 = new Array();
            Marcados2 = new Array();
            for (let n = 0; n < maxDiag; ++n) {
                if (this.Tablero[inicio1 + n] !== undefined && this.Tablero[inicio1 + n][inicio2 + n] !== undefined) {
                    if (this.Tablero[inicio1 + n][inicio2 + n].Simbolo === 'X') {
                        contador1++;
                        Marcados1.push(this.Tablero[inicio1 + n][inicio2 + n]);
                        contador2 = 0;
                        Marcados2 = new Array();
                    } else if (this.Tablero[inicio1 + n][inicio2 + n].Simbolo === 'O') {
                        contador1 = 0;
                        Marcados1 = new Array();
                        contador2++;
                        Marcados2.push(this.Tablero[inicio1 + n][inicio2 + n]);
                    } else {
                        contador1 = contador2 = 0;
                        Marcados1 = new Array();
                        Marcados2 = new Array();
                    }
                    if (contador1 >= 3) {
                        puntaje1++;
                        this.MarcarTresEnRaya(Marcados1, 'X');
                    }
                    if (contador2 >= 3) {
                        puntaje2++;
                        this.MarcarTresEnRaya(Marcados2, 'O');
                    }
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
            Marcados1 = new Array();
            Marcados2 = new Array();
            for (let n = 0; n < maxDiag; ++n) {
                if (this.Tablero[inicio1 - n] !== undefined && this.Tablero[inicio1 - n][inicio2 + n] !== undefined) {
                    if (this.Tablero[inicio1 - n][inicio2 + n].Simbolo === 'X') {
                        contador1++;
                        Marcados1.push(this.Tablero[inicio1 - n][inicio2 + n]);
                        contador2 = 0;
                        Marcados2 = new Array();
                    } else if (this.Tablero[inicio1 - n][inicio2 + n].Simbolo === 'O') {
                        contador1 = 0;
                        Marcados1 = new Array();
                        contador2++;
                        Marcados2.push(this.Tablero[inicio1 - n][inicio2 + n]);
                    } else {
                        contador1 = contador2 = 0;
                        Marcados1 = new Array();
                        Marcados2 = new Array();
                    }
                    if (contador1 >= 3) {
                        puntaje1++;
                        this.MarcarTresEnRaya(Marcados1, 'X');
                    }
                    if (contador2 >= 3) {
                        puntaje2++;
                        this.MarcarTresEnRaya(Marcados2, 'O');
                    }
                }
            }
            if (inicio1 !== this.Filas - 1) inicio1++;
            else inicio2++;
            contador1 = contador2 = 0;
        }
        this.ActualizarPuntajes(puntaje1, puntaje2);
        return this;
    }

    MarcarTresEnRaya(Vector, Simbolo) {
        if (Simbolo === 'X') {
            for (let i = 0; i < Vector.length; i++) {
                let Celda = this.ObtenerCelda(Vector[i]);
                if (!Celda.classList.contains('ColorRojoMarcado')) {
                    Celda.classList.add('ColorRojoMarcado');
                }
            }
        } else {
            for (let i = 0; i < Vector.length; i++) {
                let Celda = this.ObtenerCelda(Vector[i]);
                if (!Celda.classList.contains('ColorAzulMarcado')) {
                    Celda.classList.add('ColorAzulMarcado');
                }
            }
        }
    }

    ActualizarPuntajes(puntaje1, puntaje2) {
        document.getElementById('puntaje').innerText = puntaje1 + ' - ' + puntaje2;
        return this;
    }
}

document.getElementById('botonJugar').addEventListener('click', () => {
    let juego = new CJuego();
    var _tr = document.getElementsByTagName('tr');
    var _td = document.getElementsByTagName('td');
    var _svgAnimation = document.getElementsByClassName('svg-img');
    var _svgNeon = document.getElementsByClassName('neon-svg');
    var _reload = document.getElementsByClassName('reload')[0];
    var _containerDatos = document.getElementsByClassName('container-datos')[0];
    _containerDatos.classList.add('container-moveup');
    _svgAnimation[0].setAttribute("class", "shapeshifter svg-img play");
    _svgAnimation[1].setAttribute("class", "shapeshifter svg-img play");

    for (var q = 0; q < _svgNeon.length; q++) {
        _svgNeon[q].classList.add('neonAnimate');
    }

    if (_tr.length > 2 && _tr.length < 100) {
        for (var i = 0; i < _td.length; i++) {
            _td[i].style.height = "50px";
            _td[i].style.width = "50px";
            _td[i].style.fontSize = "36px";
        }
    }
    if (_tr.length > 9 && _tr.length < 16) {
        for (var i = 0; i < _td.length; i++) {
            _td[i].style.height = "40px";
            _td[i].style.width = "40px";
            _td[i].style.fontSize = "25px";
        }
    }

    _reload.classList.add('reload-animation');

    // FUNCION DEL RESET DEL JUEGO
    _reload.addEventListener('click', f => {
        _reload.classList.remove('reload-animation');
        _containerDatos.classList.remove('container-moveup');
        _svgAnimation[0].setAttribute("class", "shapeshifter svg-img");
        _svgAnimation[1].setAttribute("class", "shapeshifter svg-img");
        for (var q = 0; q < _svgNeon.length; q++) {
            _svgNeon[q].classList.remove('neonAnimate');
        }
    })
    document.getElementById('puntaje').innerText = '0 - 0';
});