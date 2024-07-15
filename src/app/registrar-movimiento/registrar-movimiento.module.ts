import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarMovimientoPageRoutingModule } from './registrar-movimiento-routing.module';

import { RegistrarMovimientoPage } from './registrar-movimiento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarMovimientoPageRoutingModule
  ],
  declarations: [RegistrarMovimientoPage]
})
export class RegistrarMovimientoPageModule {}
