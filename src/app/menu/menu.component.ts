import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
    ngOnInit() {
        let titulos: any = document.getElementsByClassName('menuTitulo');
        let botones: any = document.getElementsByClassName('cerrar');
        for (let i = 0; i < titulos.length; i++) {
            titulos[i].addEventListener('click', (evento) => {
                let index: number = parseInt(evento.currentTarget.getAttribute('data-id'));
                let contenedores: any = document.getElementsByClassName('menuContenedor');
                contenedores[index - 2].classList.add('mostrarContenedor');
            });
        }
        for (let i = 0; i < botones.length; i++) {
            botones[i].addEventListener('click', (evento) => {
                evento.currentTarget.parentElement.classList.remove('mostrarContenedor');
            });
        }
    }

}
