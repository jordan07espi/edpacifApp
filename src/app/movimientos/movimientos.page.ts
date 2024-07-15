import { Component, OnInit } from '@angular/core';
import { MovimientosService } from '../services/movimientos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
})
export class MovimientosPage implements OnInit {
  movimientos: any[] = [];

  constructor(
    private movimientosService: MovimientosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMovimientos();
  }

  loadMovimientos() {
    this.movimientosService.obtenerMovimientos().then((data) => {
      this.movimientos = data;
    }).catch((e) => {
      console.error('Error al cargar movimientos', e);
    });
  }

  irARegistrarMovimiento() {
    this.router.navigate(['/registrar-movimiento']);
  }
}
