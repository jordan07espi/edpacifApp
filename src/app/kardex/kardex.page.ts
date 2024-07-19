import { Component, OnInit } from '@angular/core';
import { MovimientosService } from '../services/movimientos.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.page.html',
  styleUrls: ['./kardex.page.scss'],
})
export class KardexPage implements OnInit {
  codigoProducto: string = '';
  movimientos: any[] = [];
  saldoActual: number | null = null;
  productos: any[] = [];  // Lista de productos para el ion-select

  constructor(private movimientosService: MovimientosService, private dbService: DbService) {}

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos() {
    this.dbService.obtenerProductos().then((data) => {
      this.productos = data;
    }).catch((e) => {
      console.error('Error al cargar productos', e);
    });
  }

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
      if (mov.TIPO_MOVIMIENTO === 'Ingreso' || (mov.TIPO_MOVIMIENTO === 'Transferencia' && mov.PRODUCTO_DESTINO === this.codigoProducto)) {
        saldo += mov.CANTIDAD;
      } else if (mov.TIPO_MOVIMIENTO === 'Salida' || (mov.TIPO_MOVIMIENTO === 'Transferencia' && mov.CODIGO_PRODUCTO === this.codigoProducto)) {
        saldo -= mov.CANTIDAD;
      }
    });
    this.saldoActual = saldo;
  }
}
