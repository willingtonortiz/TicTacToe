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
    PensarJugada(jugada, limitex, limitey, Tablero) {
        for (let y = jugada.Y - 2; y <= jugada.Y + 2; y++) {
            for (let x = jugada.X - 2; x <= jugada.X + 2; x++) {
                if (y < 0 || y >= limitex)
                    break;
                if (x < 0 || x >= limitey)
                    continue;
                if (Tablero[y][x].Simbolo == jugada.Simbolo && Tablero[y][x] != jugada) {
                    if (this.EvaluarJugada(x, y, jugada, Tablero, limitex, limitey))
                        return true;
                }
            }
        }
        return false;
    }
    EvaluarJugada(x, y, jugada, Tablero, limitex, limitey) {
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
        if ((y - jugada.Y == 2 || y - jugada.Y == -2) && (x - jugada.X == 1 || x - jugada.X == -1))
            return false;
        if ((x - jugada.X == 2 || x - jugada.X == -2) && (y - jugada.Y == 1 || y - jugada.Y == -1))
            return false;
        let seguir = true;
        let choque = true;
        while (seguir) {
            if (y + dy < 0 || y + dy >= limitey || x + dx < 0 || x + dx >= limitex) {
                dy *= -1;
                dx *= -1;
                if (choque == true)
                    choque = false;
                else
                    break;
            }
            if (Tablero[y + dy][x + dx].Simbolo == '') {
                Tablero[y + dy][x + dx].Simbolo = this.Simbolo;
                this.jugada = Tablero[y + dy][x + dx];
                seguir = false;
            }
            else {
                if (Tablero[y + dy][x + dx].Simbolo === this.Simbolo) {
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

    jugarIA(jugada, limitex, limitey, Tablero) {
        if (!this.PensarJugada(jugada, limitex, limitey, Tablero)) {
            if (this.jugada != null) {
                if (!this.PensarJugada(this.jugada, limitex, limitey, Tablero)) {
                    this.jugada.Simbolo = '';
                    this.PensarJugada(this.jugada, limitex, limitey, Tablero);
                }
            }
            else {
                Tablero[0][0].Simbolo = this.Simbolo;
                this.jugada = Tablero[0][0];
                alert("primer turno");
            }
        }
        else alert("jugada evitada");
        alert("se jugo en: "+this.jugada.X+" "+this.jugada.Y);
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
    constructor(filas=3, columnas=3) {
        this.Filas = Number(filas);
        this.Columnas = Number(columnas);
        this.Turno = 'j1';
        
      
        if(this.ObtenerFilasColumnas()){       
        this.InicializarMatriz();
        this.InicializarTabla();
        this.j1 = new CJugador('', 'X');
        this.maquina = new CJugador('', 'O');
        return this;
        }

    }
    ValidacionNumeros(filas,columnas)
    {   var onlyNumbers=/^([0-9])*$/;//es una expresion regular
        //si no es un numero ej Fila=a || Columnas=c
        if(isNaN(this.Filas) && isNaN(this.Columnas) )
        {
            alert("Ingresar Valores Correctamente");
            return false;
        }
     //En caso filas este vacio
        if(isNaN(this.Filas) && !isNaN(this.Columnas))
        {
            alert("Ingresar Cantidad de Filas");
            return false;
        }
        //En caso columnas este vacio
        if(!isNaN(this.Filas) && isNaN(this.Columnas) )
        {
            alert("Ingresar Cantidad de Columnas");
            return false;
        }
        //encaso se ingrese numeros con otro caracter ejempl 1s 2"espacio" "3 m"
        if( !onlyNumbers.test(filas) ||  !onlyNumbers.test(columnas) )//si encuentra una letra retorar falso
        {       
            alert("Solo ingresar numeros");
            return false;

        }
        return true;

    }
    //Obtiene las filas y las columnas de los inputs
    ObtenerFilasColumnas() {
        this.Filas = parseInt(document.getElementById('filas').value);
        this.Columnas = parseInt(document.getElementById('columnas').value);
        var filasVerificacion=String(document.getElementById('filas').value);
        var columnasVerificacion=String(document.getElementById('columnas').value);
       return this.ValidacionNumeros(filasVerificacion,columnasVerificacion);
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
        if (
            celda.innerText === '') return true;
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