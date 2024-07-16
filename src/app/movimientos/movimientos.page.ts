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
  ingresos: any[] = [];
  salidas: any[] = [];
  segmentValue: string = 'ingresos';

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
      this.ingresos = this.movimientos.filter(mov => mov.TIPO_MOVIMIENTO === 'Ingreso');
      this.salidas = this.movimientos.filter(mov => mov.TIPO_MOVIMIENTO === 'Salida' || mov.TIPO_MOVIMIENTO === 'Transferencia');
    }).catch((e) => {
      console.error('Error al cargar movimientos', e);
    });
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
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
