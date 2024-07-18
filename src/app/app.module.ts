// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DbService } from './services/db.service';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { MovimientosService } from './services/movimientos.service';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DbService,
    SQLite,
    MovimientosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}