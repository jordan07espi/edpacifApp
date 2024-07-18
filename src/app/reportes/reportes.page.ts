import { Component } from '@angular/core';
import { MovimientosService } from '../services/movimientos.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage {
  movimientos: any[] = [];
  continenteSeleccionado: string = '';

  continentes = ['EUROPA', 'ASIA'];

  constructor(private movimientosService: MovimientosService, private dbService: DbService) {}

  cargarReportes() {
    if (this.continenteSeleccionado) {
      this.dbService.obtenerProductosPorContinente(this.continenteSeleccionado).then((productos) => {
        const codigosProductos = productos.map(producto => producto.CODIGO);
        this.movimientosService.obtenerMovimientosPorCodigos(codigosProductos).then((movimientos) => {
          this.movimientos = movimientos;
        }).catch((e) => {
          console.error('Error al obtener movimientos', e);
        });
      }).catch((e) => {
        console.error('Error al obtener productos', e);
      });
    }
  }
}
