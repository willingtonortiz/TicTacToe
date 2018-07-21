export class Jugador {
    private nombre: string;
    private simbolo: string;
    private puntaje: number;
    private rondasGanadas: number;
    protected jugada: any;

    constructor(nombre: string, simbolo: string) {
        this.nombre = nombre;
        this.simbolo = simbolo;
        this.puntaje = 0;
        this.rondasGanadas = 0;
        this.jugada = null;
    }

    get Nombre(): string { return this.nombre; }
    get Simbolo(): string { return this.simbolo; }
    get Puntaje(): number { return this.puntaje; }
    get RondasGanadas(): number { return this.rondasGanadas; }
    get Jugada(): any { return this.jugada; }

    set Nombre(nombre: string) { this.nombre = nombre; }
    set Simbolo(simbolo: string) { this.simbolo = simbolo;; }
    set Puntaje(puntaje: number) { this.puntaje = puntaje; }
    set RondasGanadas(rondas: number) { this.rondasGanadas = rondas; }
    set Jugada(jugada: any) { this.jugada = jugada; }
}
