import { Jugador } from "./jugador";
import { Coordenada } from "./coordenada";

export class Ia extends Jugador {
   // Constructor
   private PosiblesJugadas:any;
   constructor(nombre: string, simbolo: string) {
       super(nombre, simbolo);
   }
   //Funcion booleana
   PensarJugada(jugada: Coordenada, limitex: number, limitey: number, Tablero: any) {
       for (let y:number = jugada.Y - 2; y <= jugada.Y + 2; y++) {
           for (let x:number = jugada.X - 2; x <= jugada.X + 2; x++) {
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
       if ((y - jugada.Y == 2 || y - jugada.Y == -2) && (x - jugada.X == 1 || x - jugada.X == -1))
           return false;
       if ((x - jugada.X == 2 || x - jugada.X == -2) && (y - jugada.Y == 1 || y - jugada.Y == -1))
           return false;
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
       this.EvaluarPrioridad(dx, dy, x, y, jugada, Tablero);
   }
   EvaluarPrioridad(dx: number, dy: number, x: number, y: number, jugada: Coordenada, Tablero: any, salto: boolean = true, agregarJugadas: boolean = true) {
       let prioridad: number = 0, limites: number = 0, cambio: boolean = false;
       while (limites < 2) {
           if (!(y + dy < Tablero.length && y + dy >= 0 && x + dx >= 0 && x + dx < Tablero[0].length) || (Tablero[y + dy][x + dx].Simbolo != jugada.Simbolo && Tablero[y + dy][x + dx].Simbolo != '')) {
               limites++;
               cambio = true;
               if (limites == 1)
                   break;
           }
           else if (Tablero[y + dy][x + dx].Simbolo == '') {
               prioridad = this.ContarCadena(x + dx, y + dy, dx * -1, dy * -1, jugada.Simbolo, Tablero);
               if (salto && y + 2 * dy < Tablero.length && y + 2 * dy >= 0 && x + 2 * dx >= 0 && x + 2 * dx < Tablero[0].length && Tablero[y + 2 * dy][x + 2 * dx].Simbolo == jugada.Simbolo) {
                   prioridad++;
                   this.AgregarJugada(x, y, dx, dy, prioridad, true);
                   prioridad--;
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
   ContarCadena(x: number, y: number, dx: number, dy: number, simbolo: string, Tablero: any) {
       let contador: number = 0;
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
   AgregarJugada(x: number, y: number, dx: number, dy: number, prioridad: number, salto: boolean = false) {
       let posiblejugada:Coordenada = new Coordenada(x + dx, y + dy);
       posiblejugada.Simbolo = this.Simbolo;
       let datosPosibleJugada:any = new Array();
       datosPosibleJugada.push(prioridad);
       let direccionx:number = dx;
       let direcciony:number = dy;
       datosPosibleJugada.push(direccionx);
       datosPosibleJugada.push(direcciony);
       datosPosibleJugada.push(posiblejugada);
       if (!this.BuscarJugada(datosPosibleJugada)) {
           if (!salto)
               this.PosiblesJugadas.push(datosPosibleJugada);
           else {
               datosPosibleJugada[1] *= -1;
               datosPosibleJugada[2] *= -1;
               if (!this.BuscarJugada(datosPosibleJugada)) {
                   datosPosibleJugada[1] *= -1;
                   datosPosibleJugada[2] *= -1;
                   this.PosiblesJugadas.push(datosPosibleJugada);
               }
           }
       }
   }
   BuscarJugada(datosPosibleJugada:any) {
       let repetido:boolean = false;
       for (let i = 0; i < this.PosiblesJugadas.length; ++i) {
           if (this.PosiblesJugadas[i][3].X == datosPosibleJugada[3].X && this.PosiblesJugadas[i][3].Y == datosPosibleJugada[3].Y) {
               if (this.PosiblesJugadas[i][1] != datosPosibleJugada[1] || this.PosiblesJugadas[i][2] != datosPosibleJugada[2])
                   this.PosiblesJugadas[i][0] += datosPosibleJugada[0];
               repetido = true;
           }
       }
       return repetido;
   }
   BuscarJugadaOptima(Tablero:any) {
       let mayor = 0;
       for (let i = 1; i < this.PosiblesJugadas.length; ++i) {
           if (this.PosiblesJugadas[mayor][0] < this.PosiblesJugadas[i][0])
               mayor = i;
       }
       Tablero[this.PosiblesJugadas[mayor][3].Y][this.PosiblesJugadas[mayor][3].X].Simbolo = this.Simbolo;
       this.Jugada = Tablero[this.PosiblesJugadas[mayor][3].Y][this.PosiblesJugadas[mayor][3].X]
       document.getElementById(this.Jugada.Y + '-' + this.Jugada.X).classList.add('ColorAzul');
   }
   //Funcion void
   jugarIA(jugada: any, limitex: number, limitey: number, Tablero: any) {
       this.PosiblesJugadas = new Array(0);
       if (!this.PensarJugada(jugada, limitex, limitey, Tablero)) {
           if (this.jugada != null) {
               if (!this.PensarJugada(this.jugada, limitex, limitey, Tablero)) {
                   let jugadaNueva = new Coordenada(this.jugada.X, this.jugada.Y);
                   this.PensarJugada(jugadaNueva, limitex, limitey, Tablero);
               }
           } 
       } 
       if (this.PosiblesJugadas.length == 0)
           this.JugadaRandom(Tablero);
       else
           //Se selecciona la jugada con  mayor prioridad
           this.BuscarJugadaOptima(Tablero);
   }
   jugarIA2(Tablero:any) {
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