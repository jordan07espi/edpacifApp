import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarMovimientoPage } from './registrar-movimiento.page';

describe('RegistrarMovimientoPage', () => {
  let component: RegistrarMovimientoPage;
  let fixture: ComponentFixture<RegistrarMovimientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarMovimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
