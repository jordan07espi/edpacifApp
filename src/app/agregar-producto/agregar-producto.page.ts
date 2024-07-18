import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.page.html',
  styleUrls: ['./agregar-producto.page.scss'],
})
export class AgregarProductoPage {
  producto = {
    codigo: '',
    descripcion: '',
    talla: '',
    continente: '',
    pais: ''
  };

  constructor(
    private dbService: DbService,
    private toastController: ToastController,
    private router: Router
  ) {}

  almacenarProducto() {
    const { codigo, descripcion, talla, continente, pais } = this.producto;
    this.dbService.almacenarProducto(codigo, descripcion, talla, continente, pais, 0, 0).then(() => {
      this.presentToast('Producto agregado exitosamente');
      this.router.navigate(['/productos']);
    }).catch(() => {
      this.presentToast('Error al agregar producto');
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
