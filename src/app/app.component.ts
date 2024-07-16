import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import {Device} from '@capacitor/device';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isweb:boolean;
  public load: boolean;

  public appPages = [
    { title: 'Productos', url: '/productos', icon: 'cube' },
    { title: 'Movimientos', url: '/movimientos', icon: 'git-compare' },
    { title: 'Kardex', url: '/kardex', icon: 'stats-chart' },
    { title: 'Reportes', url: '/reportes', icon: 'document-text' },
  ];

  constructor(private plataform: Platform) {
    this.isweb = false;
    this.load = false;
    this.initAPP();
  }
  initAPP(){
    this.plataform.ready().then( async()=>{
      const info = await Device.getInfo();
      this.isweb = info.platform == 'web';
      this.load = true;
    })
  }
}
