export class Coordenada {
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
