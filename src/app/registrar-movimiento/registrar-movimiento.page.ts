import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MovimientosService } from '../services/movimientos.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-registrar-movimiento',
  templateUrl: './registrar-movimiento.page.html',
  styleUrls: ['./registrar-movimiento.page.scss'],
})
export class RegistrarMovimientoPage implements OnInit {
  productos: any[] = [];
  movimiento = {
    codigoProducto: '',
    tipoMovimiento: '',
    cantidad: 0,
    fecha: '',
    productoDestino: '' // nuevo campo para el producto destino en caso de transferencia
  };

  mostrarProductoDestino: boolean = false;

  constructor(
    private movimientosService: MovimientosService,
    private dbService: DbService,
    private toastController: ToastController,
    private router: Router
  ) {}

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

  onTipoMovimientoChange(event: any) {
    this.mostrarProductoDestino = event.detail.value === 'Transferencia';
  }

  registrarMovimiento() {
    const { codigoProducto, tipoMovimiento, cantidad, fecha, productoDestino } = this.movimiento;
    this.movimientosService.registrarMovimiento(codigoProducto, tipoMovimiento, cantidad, fecha, productoDestino).then(() => {
      this.presentToast('Movimiento registrado exitosamente');
      this.router.navigate(['/movimientos']);
    }).catch((error) => {
      console.error('Error al registrar movimiento:', error);
      this.presentToast('Error al registrar movimiento');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
