import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";

import { AppComponent } from "./app.component";
import { PantallaInicioComponent } from "./pantalla-inicio/pantalla-inicio.component";
import { PantallaJuegoComponent } from "./pantalla-juego/pantalla-juego.component";

export const router: Routes = [
    { path: '', redirectTo: 'pantalla-inicio', pathMatch: 'full' },
    { path: 'pantalla-inicio', component: PantallaInicioComponent },
    { path: 'pantalla-juego', component: PantallaJuegoComponent },
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);