import { Component, OnInit } from '@angular/core';
import { Tablero } from "../clases/tablero";

@Component({
    selector: 'app-juego',
    templateUrl: './juego.component.html',
    styleUrls: ['./juego.component.scss']
})

export class JuegoComponent implements OnInit {
    private variable: boolean = true;
    constructor() { }

    ngOnInit() {
        document.getElementById('juegoBotonJugar').addEventListener('click', () => {
            let contenedorDatos = document.getElementById('contenedorDatos');
            contenedorDatos.style.display = 'none';

            let contenedorJuego = document.getElementById('contenedorJuego');
            contenedorJuego.style.display = 'flex';

            let cabeceraTitulo = document.getElementById('cabeceraTitulo');
            cabeceraTitulo.style.display = 'none';

            let recargar = document.getElementById('reload');
            recargar.classList.add('reload-animation');

            let puntajeJuego = document.getElementById('juegoPuntajeRonda');
            puntajeJuego.innerText = 'Rondas: 0-0';

            let puntajeRonda = document.getElementById('juegoPuntajeJuego');
            puntajeRonda.innerText = 'Juego: 0-0';

            let juego = new Tablero('contenedor');
        });

        document.getElementsByClassName('juegoCerrar')[0].addEventListener('click', () => {
            (<HTMLMapElement>document.getElementsByClassName('juegoContenedor')[0]).style.display = 'none';
        });

        document.getElementById('reload').addEventListener('click', f => {
            let recargar = document.getElementById('reload');
            recargar.classList.remove('reload-animation');

            let cabeceraTitulo = document.getElementById('cabeceraTitulo');
            cabeceraTitulo.style.display = 'flex';

            let contenedorDatos = document.getElementById('contenedorDatos');
            contenedorDatos.style.display = 'flex';

            let contenedorJuego = document.getElementById('contenedorJuego');
            contenedorJuego.style.display = 'none';
        });
    }

}
