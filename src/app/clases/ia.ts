import { Jugador } from "./jugador";
import { Coordenada } from "./coordenada";

export class Ia extends Jugador {
    // Constructor
    constructor(nombre: string, simbolo: string) {
        super(nombre, simbolo);
    }
    //Funcion booleana    
    public PensarJugada(jugada: Coordenada, limitex: number, limitey: number, Tablero: any) {
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
    public EvaluarJugada(x: number, y: number, jugada: any, Tablero: any, limitex: number, limitey: number) {
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
    public jugarIA(jugada: any, limitex: number, limitey: number, Tablero: any) {
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

    public JugadaRandom(Tablero: any) {
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
