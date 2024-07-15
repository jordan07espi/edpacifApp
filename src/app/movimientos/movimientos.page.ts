import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MovimientosService } from '../services/movimientos.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
})
export class MovimientosPage implements OnInit {
  movimientos: any[] = [];

  constructor(
    private movimientosService: MovimientosService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMovimientos();
  }

  ionViewWillEnter() {
    this.loadMovimientos();
  }

  loadMovimientos() {
    this.movimientosService.obtenerMovimientos().then((data) => {
      this.movimientos = data;
    }).catch((e) => {
      console.error('Error al cargar movimientos', e);
    });
  }

  registrarMovimiento() {
    this.router.navigate(['/registrar-movimiento']);
  }

  getColorClass(tipoMovimiento: string): string {
    switch (tipoMovimiento) {
      case 'Ingreso':
        return 'ingreso';
      case 'Salida':
        return 'salida';
      case 'Transferencia':
        return 'transferencia';
      default:
        return '';
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
