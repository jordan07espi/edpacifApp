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
  productos: any[] = [];
  continenteSeleccionado: string = '';

  continentes = ['EUROPA', 'ASIA'];

  constructor(private movimientosService: MovimientosService, private dbService: DbService) {}

  cargarReportes() {
    if (this.continenteSeleccionado) {
      this.dbService.obtenerProductosPorContinente(this.continenteSeleccionado).then((productos) => {
        const codigosProductos = productos.map(producto => producto.CODIGO);
        this.productos = productos;
        this.movimientosService.obtenerMovimientosPorCodigos(codigosProductos).then((movimientos) => {
          this.movimientos = movimientos;
          this.actualizarSaldos();
        }).catch((e) => {
          console.error('Error al obtener movimientos', e);
        });
      }).catch((e) => {
        console.error('Error al obtener productos', e);
      });
    }
  }

  actualizarSaldos() {
    this.productos.forEach(producto => {
      let saldo = 0;
      this.movimientos.forEach(mov => {
        if (mov.CODIGO_PRODUCTO === producto.CODIGO) {
          if (mov.TIPO_MOVIMIENTO === 'Ingreso' || (mov.TIPO_MOVIMIENTO === 'Transferencia' && mov.PRODUCTO_DESTINO === producto.CODIGO)) {
            saldo += mov.CANTIDAD;
          } else if (mov.TIPO_MOVIMIENTO === 'Salida' || (mov.TIPO_MOVIMIENTO === 'Transferencia' && mov.CODIGO_PRODUCTO === producto.CODIGO)) {
            saldo -= mov.CANTIDAD;
          }
        }
      });
      producto.SALDO_ACTUAL = saldo;
    });
  }
}