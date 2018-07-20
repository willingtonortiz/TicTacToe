import { Coordenada } from "./coordenada";
import { Jugador } from "./jugador";
import { Ia } from "./ia";

export class Tablero {
    private filas: number;
    private columnas: number;
    private tablero: Array<Array<Coordenada>>
    private turno: string;
    private j1: Jugador;
    private maquina: Ia;
    private turnosRestantes: number;
    private turnoTerminado: boolean;
    private nRondas:number;

    constructor(idContenedor: string) {
        if (this.validarYObtenerNumeros()) {
            this.inicializarMatriz();
            this.inicializarTabla(idContenedor);
            this.turno = 'j1';
            let nombreJugador: string = (<HTMLInputElement>document.getElementById('NombreJugador')).value;
            this.nRondas=parseInt((<HTMLInputElement>document.getElementById('rondas')).value);
            this.nRondas--;
            this.j1 = new Jugador(nombreJugador, 'X');
            this.maquina = new Ia('Ultron', 'O');
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

    private modificarDimensiones(): void {
        let anchoTotal: number = window.innerWidth;
        let tabla = document.getElementById('tabla').getBoundingClientRect();
        let altoTotal: number = document.body.scrollHeight - tabla.top;

        anchoTotal = (anchoTotal - 25) / this.columnas;
        altoTotal = (altoTotal - 25) / this.filas;

        let dimension: number;
        if (anchoTotal <= altoTotal) {
            dimension = anchoTotal;
        }
        else {
            dimension = altoTotal;
        }

        let celdas: any = document.getElementsByTagName('td');
        for (let i = 0; i < celdas.length; ++i) {
            celdas[i].style.height = dimension + 'px';
            celdas[i].style.width = dimension + 'px';
            celdas[i].style.fontSize = (dimension - 10) + 'px';
            celdas[i].style.lineHeight = .8;
        }
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

    public actualizarTableroVisual(nuevaRonda:boolean=false): void {
        let celdas: HTMLCollectionOf<Element> = document.getElementsByClassName('celda');
        for (let i: number = 0; i < celdas.length; ++i) {
            celdas[i].innerHTML = this.tablero[Math.floor(i / this.columnas)][i % this.columnas].Simbolo;
            if(nuevaRonda){
                celdas[i].classList.remove('ColorAzul');
                celdas[i].classList.remove('ColorRojo');
                celdas[i].classList.remove('ColorRojoMarcado');
                celdas[i].classList.remove('ColorAzulMarcado');
            }
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
                this.maquina.jugarIA2(this.tablero);
                this.turnosRestantes--;
            }
            else
            if(this.nRondas>0 ){
                //Mensaje de quien gano la ronda actual
                //Funcion para saber quien gana
                //Se reinicia la matriz 
                this.inicializarMatriz();
                this.actualizarTableroVisual(true);
                this.nRondas--;
                this.turnosRestantes=this.filas*this.columnas;

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
