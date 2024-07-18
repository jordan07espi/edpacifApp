import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private androidPermissions: AndroidPermissions) {}

  checkStoragePermissions(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => {
          if (result.hasPermission) {
            resolve(true);
          } else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
              requestResult => {
                if (requestResult.hasPermission) {
                  resolve(true);
                } else {
                  reject(false);
                }
              }
            );
          }
        },
        err => {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
            requestResult => {
              if (requestResult.hasPermission) {
                resolve(true);
              } else {
                reject(false);
              }
            }
          );
        }
      );
    });
  }
}
