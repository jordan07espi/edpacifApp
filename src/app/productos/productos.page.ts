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

  loadProductos() {
    this.dbService.obtenerProductos().then((data) => {
      this.productos = data.filter(producto => producto.CODIGO && producto.CODIGO.trim() !== '');
    }).catch((e) => {
      console.error('Error al cargar productos', e);
    });
  }

  async mostrarFormulario() {
    const alert = await this.alertController.create({
      header: 'Nuevo Producto',
      inputs: [
        { name: 'codigo', type: 'text', placeholder: 'Código' },
        { name: 'descripcion', type: 'text', placeholder: 'Descripción' },
        { name: 'talla', type: 'text', placeholder: 'Talla' },
        { name: 'continente', type: 'text', placeholder: 'Continente' },
        { name: 'pais', type: 'text', placeholder: 'País' },
        { name: 'precioCompra', type: 'number', placeholder: 'Precio Compra' },
        { name: 'precioVenta', type: 'number', placeholder: 'Precio Venta' }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Almacenar',
          handler: (data) => {
            this.almacenarProducto(data.codigo, data.descripcion, data.talla, data.continente, data.pais, data.precioCompra, data.precioVenta);
          }
        }
      ]
    });
    await alert.present();
  }

  almacenarProducto(codigo: string, descripcion: string, talla: string, continente: string, pais: string, precioCompra: number, precioVenta: number) {
    this.dbService.almacenarProducto(codigo, descripcion, talla, continente, pais, precioCompra, precioVenta).then(() => {
      this.loadProductos();
      this.presentToast('Producto agregado exitosamente');
    }).catch(() => {
      this.presentToast('Error al agregar producto');
    });
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
