import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite) {
    this.initDB();
  }

  initDB() {
    this.sqlite.create({
      name: 'datos.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.dbInstance = db;
      db.executeSql('CREATE TABLE IF NOT EXISTS PRODUCTOS(CODIGO VARCHAR(10) PRIMARY KEY, DESCRIPCION VARCHAR(100), TALLA VARCHAR(10), CONTINENTE VARCHAR(20), PAIS VARCHAR(50), STOCK_LBS INTEGER, PRECIO_COMPRA REAL, PRECIO_VENTA REAL)', [])
        .then(() => {
          console.log('Tabla PRODUCTOS creada correctamente');
        })
        .catch(e => {
          console.log('Error creando tabla PRODUCTOS', e);
        });
    })
    .catch(e => {
      console.log('Error inicializando base de datos', e);
    });
  }

  almacenarProducto(codigo: string, descripcion: string, talla: string, continente: string, pais: string, stockLbs: number, precioCompra: number, precioVenta: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.dbInstance) {
        console.error('Base de datos no inicializada');
        reject('Base de datos no inicializada');
        return;
      }
      this.dbInstance.executeSql('REPLACE INTO PRODUCTOS (CODIGO, DESCRIPCION, TALLA, CONTINENTE, PAIS, STOCK_LBS, PRECIO_COMPRA, PRECIO_VENTA) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [codigo, descripcion, talla, continente, pais, stockLbs, precioCompra, precioVenta])
        .then(() => {
          console.log('Producto almacenado correctamente');
          resolve();
        })
        .catch(e => {
          console.log('Error almacenando producto', e);
          reject(e);
        });
    });
  }

  obtenerProductos(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      if (!this.dbInstance) {
        console.error('Base de datos no inicializada');
        resolve([]);
        return;
      }
      this.dbInstance.executeSql('SELECT * FROM PRODUCTOS', []).then((data) => {
        let productos = [];
        for (let i = 0; i < data.rows.length; i++) {
          productos.push(data.rows.item(i));
        }
        resolve(productos);
      })
      .catch(e => {
        console.log('Error obteniendo productos', e);
        reject(e);
      });
    });
  }

  obtenerProductoPorCodigo(codigo: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!this.dbInstance) {
        console.error('Base de datos no inicializada');
        resolve(null);
        return;
      }
      this.dbInstance.executeSql('SELECT * FROM PRODUCTOS WHERE CODIGO = ?', [codigo]).then((data) => {
        if (data.rows.length > 0) {
          resolve(data.rows.item(0));
        } else {
          resolve(null);
        }
      })
      .catch(e => {
        console.log('Error obteniendo producto', e);
        reject(e);
      });
    });
  }

  eliminarProducto(codigo: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.dbInstance) {
        console.error('Base de datos no inicializada');
        reject('Base de datos no inicializada');
        return;
      }
      this.dbInstance.executeSql('DELETE FROM PRODUCTOS WHERE CODIGO = ?', [codigo])
        .then(() => {
          console.log('Producto eliminado correctamente');
          resolve();
        })
        .catch(e => {
          console.log('Error eliminando producto', e);
          reject(e);
        });
    });
  }
}
