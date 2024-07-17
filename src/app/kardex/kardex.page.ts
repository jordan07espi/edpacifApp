import { Component } from '@angular/core';
import { MovimientosService } from '../services/movimientos.service';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.page.html',
  styleUrls: ['./kardex.page.scss'],
})
export class KardexPage {
  codigoProducto: string = '';
  movimientos: any[] = [];
  saldoActual: number | null = null;

  constructor(private movimientosService: MovimientosService) {}

  consultarKardex() {
    if (this.codigoProducto.trim() === '') {
      this.movimientos = [];
      this.saldoActual = null;
      return;
    }

    this.movimientosService.obtenerMovimientosPorProducto(this.codigoProducto).then((data) => {
      this.movimientos = data.filter((mov) => {
        // Filtrar movimientos relevantes para el producto
        return mov.CODIGO_PRODUCTO === this.codigoProducto || (mov.TIPO_MOVIMIENTO === 'Ingreso' && mov.PRODUCTO_DESTINO === this.codigoProducto);
      });
      this.calcularSaldoActual();
    }).catch((e) => {
      console.error('Error al obtener movimientos', e);
    });
  }

  calcularSaldoActual() {
    let saldo = 0;
    this.movimientos.forEach((mov) => {
      if (mov.TIPO_MOVIMIENTO === 'Ingreso') {
        saldo += mov.CANTIDAD;
      } else if (mov.TIPO_MOVIMIENTO === 'Salida') {
        saldo -= mov.CANTIDAD;
      }
    });
    this.saldoActual = saldo;
  }
}
