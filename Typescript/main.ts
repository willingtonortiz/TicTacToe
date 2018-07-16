class Coordenada {
    private x: number;
    private y: number;
    private simbolo: string;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
        this.simbolo = '';
    }

    get X(): number { return this.x; }
    get Y(): number { return this.y; }
    get Simbolo(): string { return this.simbolo; }

    set X(x: number) { this.x = x; }
    set Y(y: number) { this.y = y;; }
    set Simbolo(simbolo: string) { this.simbolo = simbolo; }

}

class Jugador {
    private nombre: string;
    private simbolo: string;
    private puntaje: number;
    protected jugada: any;
    constructor(nombre: string, simbolo: string) {
        this.nombre = nombre;
        this.simbolo = simbolo;
        this.puntaje = 0;
        this.jugada = null;
    }

    get Nombre(): string { return this.nombre; }
    get Simbolo(): string { return this.simbolo; }
    get Puntaje(): number { return this.puntaje; }
    get Jugada(): any { return this.jugada; }

    set Nombre(nombre: string) { this.nombre = nombre; }
    set Simbolo(simbolo: string) { this.simbolo = simbolo;; }
    set Puntaje(puntaje: number) { this.puntaje = puntaje; }
    set Jugada(jugada: any) { this.jugada = jugada; }
}

class CIA extends Jugador {
    // Constructor
    constructor(nombre: string, simbolo: string) {
        super(nombre, simbolo);
    }
    //Funcion booleana
    PensarJugada(jugada: Coordenada, limitex: number, limitey: number, Tablero: any) {
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
    EvaluarJugada(x: number, y: number, jugada: any, Tablero: any, limitex: number, limitey: number) {
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
                document.getElementById(Tablero[y + dy][x + dx].Y + '-' + Tablero[y + dy][x + dx].X).classList.add('ColorAzul');
                seguir = false;
            } else {
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
    jugarIA(jugada: any, limitex: number, limitey: number, Tablero: any) {
        if (!this.PensarJugada(jugada, limitex, limitey, Tablero)) {
            if (this.jugada != null) {
                if (!this.PensarJugada(this.jugada, limitex, limitey, Tablero)) {
                    let jugadaNueva = new Coordenada(this.jugada.X, this.jugada.Y);
                    this.PensarJugada(jugadaNueva, limitex, limitey, Tablero);
                }
            } else {
                this.JugadaRandom(Tablero);
            }
        } else {
        }
    }

    JugadaRandom(Tablero: any) {
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
    private filas: number;
    private columnas: number;
    private tablero: Array<Array<Coordenada>>
    private turno: string;
    private j1: Jugador;
    private maquina: CIA;
    private turnosRestantes: number;
    private turnoTerminado: boolean;


    constructor(idContenedor: string) {
        if (this.validarYObtenerNumeros()) {
            this.inicializarMatriz();
            this.inicializarTabla(idContenedor);
            this.turno = 'j1';
            let nombreJugador: string = (<HTMLInputElement>document.getElementById('NombreJugador')).value;
            this.j1 = new Jugador(nombreJugador, 'X');
            this.maquina = new CIA('Ultron', 'O');
            this.turnosRestantes = this.filas * this.columnas;
            this.turnoTerminado = true;
        }
        return this;
    }

    private inicializarMatriz(): Tablero {
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

    private inicializarTabla(idContenedor: string): Tablero {
        let contenedor = document.getElementById(idContenedor);
        contenedor.innerHTML = "";
        let tabla = document.createElement('table');

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
        return this;
    }

    public obtenerCoordenada(celda: HTMLElement): Coordenada {
        let cadena: Array<string> = celda.getAttribute('id').split('-');
        let fila: number = parseInt(cadena[0]);
        let columna: number = parseInt(cadena[1]);
        return this.tablero[fila][columna];
    }

    public obtenerCelda(coordenada: Coordenada): HTMLElement {
        return document.getElementById(`${coordenada.Y}-${coordenada.X}`);
    }

    public actualizarTableroVisual(): void {
        let celdas: HTMLCollectionOf<Element> = document.getElementsByClassName('celda');
        for (let i: number = 0; i < celdas.length; ++i) {
            celdas[i].innerHTML = this.tablero[Math.floor(i / this.columnas)][i % this.columnas].Simbolo;
        }
    }

    public contarPuntajes(): Tablero {
        let puntaje1: number = 0, contador1: number = 0;
        let puntaje2: number = 0, contador2: number = 0;
        let Marcados1: Array<Coordenada>, Marcados2: Array<Coordenada>;

        //Conteo horizontal
        for (let i = 0; i < this.filas; ++i) {
            Marcados1 = new Array<Coordenada>();
            Marcados2 = new Array<Coordenada>();
            for (let j = 0; j < this.columnas; ++j) {
                if (this.tablero[i][j].Simbolo === 'X') {
                    contador1++;
                    Marcados1.push(this.tablero[i][j]);
                    contador2 = 0;
                    Marcados2 = new Array<Coordenada>();
                } else if (this.tablero[i][j].Simbolo === 'O') {
                    contador1 = 0;
                    Marcados1 = new Array<Coordenada>();
                    contador2++;
                    Marcados2.push(this.tablero[i][j]);
                } else {
                    contador1 = contador2 = 0;
                    Marcados1 = Marcados2 = new Array<Coordenada>();
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
            Marcados1 = new Array<Coordenada>();
            Marcados2 = new Array<Coordenada>();
            for (let i = 0; i < this.filas; ++i) {
                if (this.tablero[i][j].Simbolo === 'X') {
                    contador1++;
                    Marcados1.push(this.tablero[i][j]);
                    contador2 = 0;
                    Marcados2 = new Array<Coordenada>();
                } else if (this.tablero[i][j].Simbolo === 'O') {
                    contador1 = 0;
                    Marcados1 = new Array<Coordenada>();
                    contador2++;
                    Marcados2.push(this.tablero[i][j]);
                } else {
                    contador1 = contador2 = 0;
                    Marcados1 = Marcados2 = new Array<Coordenada>();
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
        let cantDiag = this.filas + this.columnas - 1,
            maxDiag = Math.max(this.filas, this.columnas),
            inicio1 = this.filas - 1,
            inicio2 = 0;
        for (let m = 0; m < cantDiag; ++m) {
            Marcados1 = new Array<Coordenada>();
            Marcados2 = new Array<Coordenada>();
            for (let n = 0; n < maxDiag; ++n) {
                if (this.tablero[inicio1 + n] !== undefined && this.tablero[inicio1 + n][inicio2 + n] !== undefined) {
                    if (this.tablero[inicio1 + n][inicio2 + n].Simbolo === 'X') {
                        contador1++;
                        Marcados1.push(this.tablero[inicio1 + n][inicio2 + n]);
                        contador2 = 0;
                        Marcados2 = new Array<Coordenada>();
                    } else if (this.tablero[inicio1 + n][inicio2 + n].Simbolo === 'O') {
                        contador1 = 0;
                        Marcados1 = new Array<Coordenada>();
                        contador2++;
                        Marcados2.push(this.tablero[inicio1 + n][inicio2 + n]);
                    } else {
                        contador1 = contador2 = 0;
                        Marcados1 = Marcados2 = new Array<Coordenada>();
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
            if (inicio1 !== 0) inicio1--;
            else inicio2++;
            contador1 = contador2 = 0;
        }
        //Diagonal de 45 grados
        inicio1 = 0;
        inicio2 = 0;
        for (let m = 0; m < cantDiag; ++m) {
            Marcados1 = new Array<Coordenada>();
            Marcados2 = new Array<Coordenada>();
            for (let n = 0; n < maxDiag; ++n) {
                if (this.tablero[inicio1 - n] !== undefined && this.tablero[inicio1 - n][inicio2 + n] !== undefined) {
                    if (this.tablero[inicio1 - n][inicio2 + n].Simbolo === 'X') {
                        contador1++;
                        Marcados1.push(this.tablero[inicio1 - n][inicio2 + n]);
                        contador2 = 0;
                        Marcados2 = new Array<Coordenada>();
                    } else if (this.tablero[inicio1 - n][inicio2 + n].Simbolo === 'O') {
                        contador1 = 0;
                        Marcados1 = new Array<Coordenada>();
                        contador2++;
                        Marcados2.push(this.tablero[inicio1 - n][inicio2 + n]);
                    } else {
                        contador1 = contador2 = 0;
                        Marcados1 = Marcados2 = new Array<Coordenada>();
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
            if (inicio1 !== this.filas - 1) inicio1++;
            else inicio2++;
            contador1 = contador2 = 0;
        }
        this.actualizarPuntajes(puntaje1, puntaje2);
        return this;
    }

    private marcarTresEnRaya(coordenadas: Array<Coordenada>, simbolo: string): Tablero {
        if (simbolo === 'X') {
            for (let i = 0; i < coordenadas.length; i++) {
                let Celda = this.obtenerCelda(coordenadas[i]);
                if (!Celda.classList.contains('ColorRojoMarcado')) {
                    Celda.classList.add('ColorRojoMarcado');
                }
            }
        } else {
            for (let i = 0; i < coordenadas.length; i++) {
                let Celda = this.obtenerCelda(coordenadas[i]);
                if (!Celda.classList.contains('ColorAzulMarcado')) {
                    Celda.classList.add('ColorAzulMarcado');
                }
            }
        }
        return this;
    }

    private actualizarPuntajes(puntaje1: number, puntaje2: number): Tablero {
        document.getElementById('puntaje').innerText = `${puntaje1}-${puntaje2}`;
        return this;
    }

    private sleep(tiempo: number): Promise<any> {
        return new Promise<any>((resolve: any) => setTimeout(resolve, tiempo));
    }

    private validarYObtenerNumeros(): boolean {
        let filas: number = parseInt((<HTMLInputElement>document.getElementById('filas')).value);
        let columnas: number = parseInt((<HTMLInputElement>document.getElementById('columnas')).value);
        let onlyNumbers: RegExp = /^([0-9])*$/; //es una expresion regular

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
        if (filas <= 2) filas = 3;
        if (columnas <= 2) columnas = 3;
        this.filas = filas;
        this.columnas = columnas;
        return true;
    }

    private esCeldaVacia(celda: HTMLTableCellElement): boolean {
        return celda.innerText === '';
    }

    async jugar(celda: HTMLTableCellElement) {
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
            let tiempo: number = Math.round(Math.random() * 1000 + 500);
            await this.sleep(tiempo);
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
    }

    public imprimirTableroConsola(): Tablero {
        let cadena: string = '';
        for (let i: number = 0; i < this.filas; ++i) {
            for (let j: number = 0; j < this.columnas; ++j) {
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

    let _tr = document.getElementsByTagName('tr');
    let _td = document.getElementsByTagName('td');
    let _svgAnimation = document.getElementsByClassName('svg-img');
    let _svgNeon = document.getElementsByClassName('neon-svg');
    let _reload = document.getElementsByClassName('reload')[0];
    let _containerDatos = document.getElementsByClassName('container-datos')[0];
    _containerDatos.classList.add('container-moveup');
    _svgAnimation[0].setAttribute("class", "shapeshifter svg-img play");
    _svgAnimation[1].setAttribute("class", "shapeshifter svg-img play");

    for (let q = 0; q < _svgNeon.length; q++) {
        _svgNeon[q].classList.add('neonAnimate');
    }

    if (_tr.length > 2 && _tr.length < 100) {
        for (let i = 0; i < _td.length; i++) {
            _td[i].style.height = "50px";
            _td[i].style.width = "50px";
            _td[i].style.fontSize = "36px";
        }
    }
    if (_tr.length > 9 && _tr.length < 16) {
        for (let i = 0; i < _td.length; i++) {
            _td[i].style.height = "30px";
            _td[i].style.width = "30px";
            _td[i].style.fontSize = "18px";
        }
    }

    _reload.classList.add('reload-animation');

    // FUNCION DEL RESET DEL JUEGO
    _reload.addEventListener('click', f => {
        _reload.classList.remove('reload-animation');
        _containerDatos.classList.remove('container-moveup');
        _svgAnimation[0].setAttribute("class", "shapeshifter svg-img");
        _svgAnimation[1].setAttribute("class", "shapeshifter svg-img");
        for (let q = 0; q < _svgNeon.length; q++) {
            _svgNeon[q].classList.remove('neonAnimate');
        }
    })
    document.getElementById('puntaje').innerText = '0-0';
});