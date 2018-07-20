import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaJuegoComponent } from './pantalla-juego.component';

describe('PantallaJuegoComponent', () => {
  let component: PantallaJuegoComponent;
  let fixture: ComponentFixture<PantallaJuegoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantallaJuegoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantallaJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
