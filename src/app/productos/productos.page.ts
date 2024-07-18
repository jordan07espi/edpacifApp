import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { DbService } from '../services/db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: any[] = [];

  constructor(
    private dbService: DbService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProductos();
  }
  ionViewWillEnter() {
    this.loadProductos();
  }

  loadProductos() {
    this.dbService.obtenerProductos().then((data) => {
      this.productos = data.filter(producto => producto.CODIGO && producto.CODIGO.trim() !== '');
    }).catch((e) => {
      console.error('Error al cargar productos', e);
    });
  }

  navegarAgregarProducto() {
    this.router.navigate(['/agregar-producto']);
  }

  async confirmarEliminarProducto(codigo: string) {
    const alert = await this.alertController.create({
      header: `Eliminar Producto ${codigo}`,
      message: 'Esta acción no se puede deshacer',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarProducto(codigo);
          }
        }
      ]
    });
    await alert.present();
  }

  eliminarProducto(codigo: string) {
    this.dbService.eliminarProducto(codigo).then(() => {
      this.loadProductos();
      this.presentToast('Producto eliminado exitosamente');
    }).catch(() => {
      this.presentToast('Error al eliminar producto');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  verDetallesProducto(codigo: string) {
    this.router.navigate(['/detalle-producto', codigo]);
  }
}
