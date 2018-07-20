"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Coordenada {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.simbolo = '';
    }
    get X() { return this.x; }
    get Y() { return this.y; }
    get Simbolo() { return this.simbolo; }
    set X(x) { this.x = x; }
    set Y(y) { this.y = y; ; }
    set Simbolo(simbolo) { this.simbolo = simbolo; }
}
class Jugador {
    constructor(nombre, simbolo) {
        this.nombre = nombre;
        this.simbolo = simbolo;
        this.puntaje = 0;
        this.jugada = null;
    }
    get Nombre() { return this.nombre; }
    get Simbolo() { return this.simbolo; }
    get Puntaje() { return this.puntaje; }
    get Jugada() { return this.jugada; }
    set Nombre(nombre) { this.nombre = nombre; }
    set Simbolo(simbolo) { this.simbolo = simbolo; ; }
    set Puntaje(puntaje) { this.puntaje = puntaje; }
    set Jugada(jugada) { this.jugada = jugada; }
}
class CIA extends Jugador {
    // Constructor
    constructor(nombre, simbolo) {
        super(nombre, simbolo);
    }
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
        }
        else {
            if (y == jugada.Y) {
                dy = 0;
            }
            else {
                dy = +1;
            }
        }
        if (x > jugada.X) {
            dx = -1;
        }
        else {
            if (x == jugada.X) {
                dx = 0;
            }
            else {
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
                }
                else {
                    break;
                }
            }
            if (Tablero[y + dy][x + dx].Simbolo == '') {
                Tablero[y + dy][x + dx].Simbolo = this.Simbolo;
                this.Jugada = Tablero[y + dy][x + dx];
                document.getElementById(Tablero[y + dy][x + dx].Y + '-' + Tablero[y + dy][x + dx].X).classList.add('ColorAzul');
                seguir = false;
            }
            else {
                if (Tablero[y + dy][x + dx].Simbolo === this.Simbolo) {
                    x += dx;
                    y += dy;
                    dy *= -1;
                    dx *= -1;
                    if (choque == true)
                        choque = false;
                    else {
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
            if (this.jugada != null) {
                if (!this.PensarJugada(this.jugada, limitex, limitey, Tablero)) {
                    let jugadaNueva = new Coordenada(this.jugada.X, this.jugada.Y);
                    this.PensarJugada(jugadaNueva, limitex, limitey, Tablero);
                }
            }
            else {
                this.JugadaRandom(Tablero);
            }
        }
        else {
        }
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
class Tablero {
    constructor(idContenedor) {
        if (this.validarYObtenerNumeros()) {
            this.inicializarMatriz();
            this.inicializarTabla(idContenedor);
            this.turno = 'j1';
            let nombreJugador = document.getElementById('NombreJugador').value;
            this.j1 = new Jugador(nombreJugador, 'X');
            this.maquina = new CIA('Ultron', 'O');
            this.turnosRestantes = this.filas * this.columnas;
            this.turnoTerminado = true;
        }
        return this;
    }
    inicializarMatriz() {
        this.tablero = null;
        this.tablero = new Array(this.filas);
        for (let i = 0; i < this.filas; ++i) {
            this.tablero[i] = new Array(this.columnas);
            for (let j = 0; j < this.columnas; ++j) {
                this.tablero[i][j] = new Coordenada(j, i);
            }
        }
        return this;
    }
    inicializarTabla(idContenedor) {
        let contenedor = document.getElementById(idContenedor);
        contenedor.innerHTML = "";
        let tabla = document.createElement('table');
        tabla.setAttribute('id', 'tabla');
        for (let i = 0; i < this.filas; ++i) {
            let fila = document.createElement('tr');
            for (let j = 0; j < this.columnas; ++j) {
                let celda = document.createElement('td');
                celda.setAttribute('id', `${i}-${j}`);
                celda.classList.add('celda');
                //Cuando el usuario da click
                celda.addEventListener('click', (evento) => {
                    this.jugar(celda);
                });
                fila.appendChild(celda);
            }
            tabla.appendChild(fila);
        }
        contenedor.appendChild(tabla);
        this.modificarDimensiones();
        return this;
    }
    modificarDimensiones() {
        let anchoTotal = window.innerWidth;
        let tabla = document.getElementById('tabla').getBoundingClientRect();
        let altoTotal = 2 * document.body.scrollHeight - tabla.top;
        anchoTotal = (anchoTotal - 25) / this.columnas;
        altoTotal = (altoTotal - 25) / this.filas;
        let dimension;
        if (anchoTotal <= altoTotal) {
            dimension = anchoTotal;
        }
        else {
            dimension = altoTotal;
        }
        let celdas = document.getElementsByTagName('td');
        for (let i = 0; i < celdas.length; ++i) {
            celdas[i].style.height = dimension + 'px';
            celdas[i].style.width = dimension + 'px';
            celdas[i].style.fontSize = (dimension - 10) + 'px';
            celdas[i].style.lineHeight = .8;
        }
    }
    obtenerCoordenada(celda) {
        let cadena = celda.getAttribute('id').split('-');
        let fila = parseInt(cadena[0]);
        let columna = parseInt(cadena[1]);
        return this.tablero[fila][columna];
    }
    obtenerCelda(coordenada) {
        return document.getElementById(`${coordenada.Y}-${coordenada.X}`);
    }
    actualizarTableroVisual() {
        let celdas = document.getElementsByClassName('celda');
        for (let i = 0; i < celdas.length; ++i) {
            celdas[i].innerHTML = this.tablero[Math.floor(i / this.columnas)][i % this.columnas].Simbolo;
        }
    }
    contarPuntajes() {
        let puntaje1 = 0, contador1 = 0;
        let puntaje2 = 0, contador2 = 0;
        let Marcados1, Marcados2;
        //Conteo horizontal
        for (let i = 0; i < this.filas; ++i) {
            Marcados1 = new Array();
            Marcados2 = new Array();
            for (let j = 0; j < this.columnas; ++j) {
                if (this.tablero[i][j].Simbolo === 'X') {
                    contador1++;
                    Marcados1.push(this.tablero[i][j]);
                    contador2 = 0;
                    Marcados2 = new Array();
                }
                else if (this.tablero[i][j].Simbolo === 'O') {
                    contador1 = 0;
                    Marcados1 = new Array();
                    contador2++;
                    Marcados2.push(this.tablero[i][j]);
                }
                else {
                    contador1 = contador2 = 0;
                    Marcados1 = Marcados2 = new Array();
                }
                if (contador1 >= 3) {
                    puntaje1++;
                    this.marcarTresEnRaya(Marcados1, 'X');
                }
                if (contador2 >= 3) {
                    puntaje2++;
                    this.marcarTresEnRaya(Marcados2, 'O');
                }
            }
            contador1 = contador2 = 0;
        }
        //Conteo vertical
        for (let j = 0; j < this.columnas; ++j) {
            Marcados1 = new Array();
            Marcados2 = new Array();
            for (let i = 0; i < this.filas; ++i) {
                if (this.tablero[i][j].Simbolo === 'X') {
                    contador1++;
                    Marcados1.push(this.tablero[i][j]);
                    contador2 = 0;
                    Marcados2 = new Array();
                }
                else if (this.tablero[i][j].Simbolo === 'O') {
                    contador1 = 0;
                    Marcados1 = new Array();
                    contador2++;
                    Marcados2.push(this.tablero[i][j]);
                }
                else {
                    contador1 = contador2 = 0;
                    Marcados1 = Marcados2 = new Array();
                }
                if (contador1 >= 3) {
                    puntaje1++;
                    this.marcarTresEnRaya(Marcados1, 'X');
                }
                if (contador2 >= 3) {
                    puntaje2++;
                    this.marcarTresEnRaya(Marcados2, 'O');
                }
            }
            contador1 = contador2 = 0;
        }
        //Conteo diagonal
        //Diagonal de 135 grados
        let cantDiag = this.filas + this.columnas - 1, maxDiag = Math.max(this.filas, this.columnas), inicio1 = this.filas - 1, inicio2 = 0;
        for (let m = 0; m < cantDiag; ++m) {
            Marcados1 = new Array();
            Marcados2 = new Array();
            for (let n = 0; n < maxDiag; ++n) {
                if (this.tablero[inicio1 + n] !== undefined && this.tablero[inicio1 + n][inicio2 + n] !== undefined) {
                    if (this.tablero[inicio1 + n][inicio2 + n].Simbolo === 'X') {
                        contador1++;
                        Marcados1.push(this.tablero[inicio1 + n][inicio2 + n]);
                        contador2 = 0;
                        Marcados2 = new Array();
                    }
                    else if (this.tablero[inicio1 + n][inicio2 + n].Simbolo === 'O') {
                        contador1 = 0;
                        Marcados1 = new Array();
                        contador2++;
                        Marcados2.push(this.tablero[inicio1 + n][inicio2 + n]);
                    }
                    else {
                        contador1 = contador2 = 0;
                        Marcados1 = Marcados2 = new Array();
                    }
                    if (contador1 >= 3) {
                        puntaje1++;
                        this.marcarTresEnRaya(Marcados1, 'X');
                    }
                    if (contador2 >= 3) {
                        puntaje2++;
                        this.marcarTresEnRaya(Marcados2, 'O');
                    }
                }
            }
            if (inicio1 !== 0)
                inicio1--;
            else
                inicio2++;
            contador1 = contador2 = 0;
        }
        //Diagonal de 45 grados
        inicio1 = 0;
        inicio2 = 0;
        for (let m = 0; m < cantDiag; ++m) {
            Marcados1 = new Array();
            Marcados2 = new Array();
            for (let n = 0; n < maxDiag; ++n) {
                if (this.tablero[inicio1 - n] !== undefined && this.tablero[inicio1 - n][inicio2 + n] !== undefined) {
                    if (this.tablero[inicio1 - n][inicio2 + n].Simbolo === 'X') {
                        contador1++;
                        Marcados1.push(this.tablero[inicio1 - n][inicio2 + n]);
                        contador2 = 0;
                        Marcados2 = new Array();
                    }
                    else if (this.tablero[inicio1 - n][inicio2 + n].Simbolo === 'O') {
                        contador1 = 0;
                        Marcados1 = new Array();
                        contador2++;
                        Marcados2.push(this.tablero[inicio1 - n][inicio2 + n]);
                    }
                    else {
                        contador1 = contador2 = 0;
                        Marcados1 = Marcados2 = new Array();
                    }
                    if (contador1 >= 3) {
                        puntaje1++;
                        this.marcarTresEnRaya(Marcados1, 'X');
                    }
                    if (contador2 >= 3) {
                        puntaje2++;
                        this.marcarTresEnRaya(Marcados2, 'O');
                    }
                }
            }
            if (inicio1 !== this.filas - 1)
                inicio1++;
            else
                inicio2++;
            contador1 = contador2 = 0;
        }
        this.actualizarPuntajes(puntaje1, puntaje2);
        return this;
    }
    marcarTresEnRaya(coordenadas, simbolo) {
        if (simbolo === 'X') {
            for (let i = 0; i < coordenadas.length; i++) {
                let Celda = this.obtenerCelda(coordenadas[i]);
                if (!Celda.classList.contains('ColorRojoMarcado')) {
                    Celda.classList.add('ColorRojoMarcado');
                }
            }
        }
        else {
            for (let i = 0; i < coordenadas.length; i++) {
                let Celda = this.obtenerCelda(coordenadas[i]);
                if (!Celda.classList.contains('ColorAzulMarcado')) {
                    Celda.classList.add('ColorAzulMarcado');
                }
            }
        }
        return this;
    }
    actualizarPuntajes(puntaje1, puntaje2) {
        document.getElementById('puntaje').innerText = `${puntaje1}-${puntaje2}`;
        return this;
    }
    sleep(tiempo) {
        return new Promise((resolve) => setTimeout(resolve, tiempo));
    }
    validarYObtenerNumeros() {
        let filas = parseInt(document.getElementById('filas').value);
        let columnas = parseInt(document.getElementById('columnas').value);
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
        if (!onlyNumbers.test(filas.toString()) || !onlyNumbers.test(columnas.toString())) {
            alert("Solo ingresar numeros");
            return false;
        }
        if (filas <= 2)
            filas = 3;
        if (columnas <= 2)
            columnas = 3;
        this.filas = filas;
        this.columnas = columnas;
        return true;
    }
    esCeldaVacia(celda) {
        return celda.innerText === '';
    }
    jugar(celda) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.esCeldaVacia(celda) && this.turnoTerminado) {
                //Jugada del jugador
                celda.classList.add('ColorRojo');
                let coordenada = this.obtenerCoordenada(celda);
                coordenada.Simbolo = this.j1.Simbolo;
                this.turnosRestantes--;
                this.actualizarTableroVisual();
                this.contarPuntajes();
                this.turnoTerminado = false;
                //Espera un segundo
                let tiempo = Math.round(Math.random() * 1000 + 500);
                yield this.sleep(tiempo);
                this.turnoTerminado = true;
                //Si ya se completo la tabla, la maquina no jugara (tablas impares)
                if (this.turnosRestantes !== 0) {
                    //Jugada de la maquina
                    this.maquina.jugarIA(coordenada, this.columnas, this.filas, this.tablero);
                    this.turnosRestantes--;
                }
                this.actualizarTableroVisual();
                this.contarPuntajes();
            }
        });
    }
    imprimirTableroConsola() {
        let cadena = '';
        for (let i = 0; i < this.filas; ++i) {
            for (let j = 0; j < this.columnas; ++j) {
                cadena += `${this.tablero[i][j].Simbolo}\t`;
            }
            cadena += `\n`;
        }
        console.log(cadena);
        return this;
    }
}
document.getElementById('botonJugar').addEventListener('click', () => {
    let juego = new Tablero('contenedor');
    let contenedor = document.getElementById('contenedorDatos');
    contenedor.classList.add('container-moveup');
    let animaciones = document.getElementsByClassName('svg-img');
    animaciones[0].setAttribute("class", "shapeshifter svg-img play");
    animaciones[1].setAttribute("class", "shapeshifter svg-img play");
    let imagenes = document.getElementsByClassName('neon-svg');
    for (let i = 0; i < imagenes.length; i++) {
        imagenes[i].classList.add('neonAnimate');
    }
    let recargar = document.getElementById('reload');
    recargar.classList.add('reload-animation');
    let puntaje = document.getElementById('puntaje');
    puntaje.innerText = '0-0';
});
document.getElementById('reload').addEventListener('click', f => {
    let recargar = document.getElementById('reload');
    recargar.classList.remove('reload-animation');
    let contenedor = document.getElementById('contenedorDatos');
    contenedor.classList.remove('container-moveup');
    let animaciones = document.getElementsByClassName('svg-img');
    animaciones[0].setAttribute("class", "shapeshifter svg-img");
    animaciones[1].setAttribute("class", "shapeshifter svg-img");
    let imagenes = document.getElementsByClassName('neon-svg');
    for (let i = 0; i < imagenes.length; i++) {
        imagenes[i].classList.remove('neonAnimate');
    }
});