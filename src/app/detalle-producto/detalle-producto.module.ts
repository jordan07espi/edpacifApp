import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RouterModule } from '@angular/router';
import { DetalleProductoPage } from './detalle-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: DetalleProductoPage
      }
    ])
  ],
  declarations: [DetalleProductoPage]
})
export class DetalleProductoPageModule {}
