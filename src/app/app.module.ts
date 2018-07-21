import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//esto es nuevo
import { routes } from './app.router';

import { AppComponent } from './app.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { PieComponent } from './pie/pie.component';
import { MenuComponent } from './menu/menu.component';
import { JuegoComponent } from './juego/juego.component';
import { PantallaInicioComponent } from './pantalla-inicio/pantalla-inicio.component';
import { PantallaJuegoComponent } from './pantalla-juego/pantalla-juego.component';

@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    PieComponent,
    MenuComponent,
    JuegoComponent,
    PantallaInicioComponent,
    PantallaJuegoComponent
  ],
  imports: [
    BrowserModule,
    routes,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
