import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DbService } from '../services/db.service';

interface Producto {
  CODIGO: string;
  DESCRIPCION: string;
  TALLA: string;
  CONTINENTE: string;
  PAIS: string;
  STOCK_LBS: number;
  PRECIO_COMPRA: number;
  PRECIO_VENTA: number;
}

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage implements OnInit {
  producto: Producto | null = null;

  constructor(
    private route: ActivatedRoute,
    private dbService: DbService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducto();
  }

  loadProducto() {
    const codigo = this.route.snapshot.paramMap.get('codigo');
    if (codigo) {
      this.dbService.obtenerProductoPorCodigo(codigo).then(data => {
        this.producto = data;
      }).catch(e => {
        console.error('Error obteniendo producto', e);
      });
    } else {
      console.error('Código del producto no proporcionado');
    }
  }

  async editarProducto() {
    if (!this.producto) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Editar Producto',
      inputs: [
        { name: 'codigo', type: 'text', placeholder: 'Código', value: this.producto.CODIGO, disabled: true },
        { name: 'descripcion', type: 'text', placeholder: 'Descripción', value: this.producto.DESCRIPCION },
        { name: 'talla', type: 'text', placeholder: 'Talla', value: this.producto.TALLA },
        { name: 'continente', type: 'text', placeholder: 'Continente', value: this.producto.CONTINENTE },
        { name: 'pais', type: 'text', placeholder: 'País', value: this.producto.PAIS },
        { name: 'stockLbs', type: 'number', placeholder: 'Stock Libras', value: this.producto.STOCK_LBS },
        { name: 'precioCompra', type: 'number', placeholder: 'Precio Compra', value: this.producto.PRECIO_COMPRA },
        { name: 'precioVenta', type: 'number', placeholder: 'Precio Venta', value: this.producto.PRECIO_VENTA }
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
          text: 'Guardar',
          handler: (data) => {
            this.actualizarProducto(data);
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarEliminarProducto() {
    if (!this.producto) {
      return;
    }

    const alert = await this.alertController.create({
      header: `Eliminar Producto ${this.producto!.CODIGO}`,
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
            this.eliminarProducto();
          }
        }
      ]
    });
    await alert.present();
  }

  actualizarProducto(data: any) {
    this.dbService.almacenarProducto(data.codigo, data.descripcion, data.talla, data.continente, data.pais, data.stockLbs, data.precioCompra, data.precioVenta).then(() => {
      this.presentToast('Producto actualizado exitosamente');
      this.producto = {
        CODIGO: data.codigo,
        DESCRIPCION: data.descripcion,
        TALLA: data.talla,
        CONTINENTE: data.continente,
        PAIS: data.pais,
        STOCK_LBS: data.stockLbs,
        PRECIO_COMPRA: data.precioCompra,
        PRECIO_VENTA: data.precioVenta
      };
    }).catch(() => {
      this.presentToast('Error al actualizar producto');
    });
  }

  eliminarProducto() {
    if (!this.producto) {
      return;
    }

    this.dbService.eliminarProducto(this.producto.CODIGO).then(() => {
      this.presentToast('Producto eliminado exitosamente');
      this.router.navigate(['/productos']);
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
}
