import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public isweb: boolean;
  public load: boolean;

  public appPages = [
    { title: 'Productos', url: '/productos', icon: 'cube' },
    { title: 'Movimientos', url: '/movimientos', icon: 'git-compare' },
    { title: 'Kardex', url: '/kardex', icon: 'stats-chart' },
    { title: 'Reportes', url: '/reportes', icon: 'document-text' },
  ];

  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions
  ) {
    this.isweb = false;
    this.load = false;
    this.initAPP();
  }

  initAPP() {
    this.platform.ready().then(async () => {
      const info = await Device.getInfo();
      this.isweb = info.platform === 'web';
      this.load = true;

      if (!this.isweb) {
        this.requestPermissions();
      }
    });
  }

  requestPermissions() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);
        }
      },
      err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE])
    );
  }
}
