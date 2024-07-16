import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
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
      db.executeSql('CREATE TABLE IF NOT EXISTS MOVIMIENTOS(CODIGO_PRODUCTO VARCHAR(10), TIPO_MOVIMIENTO VARCHAR(20), CANTIDAD INTEGER, FECHA TEXT, PRODUCTO_DESTINO VARCHAR(10))', [])
        .then(() => {
          console.log('Tabla MOVIMIENTOS creada correctamente');
        })
        .catch(e => {
          console.log('Error creando tabla MOVIMIENTOS', e);
        });
    })
    .catch(e => {
      console.log('Error inicializando base de datos', e);
    });
  }

  registrarMovimiento(codigoProducto: string, tipoMovimiento: string, cantidad: number, fecha: string, productoDestino: string = ''): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.dbInstance) {
        console.error('Base de datos no inicializada');
        reject('Base de datos no inicializada');
        return;
      }

      const executeSql = (sql: string, params: any[]): Promise<void> => {
        return this.dbInstance!.executeSql(sql, params).then(() => {}).catch(e => { throw e; });
      };

      if (tipoMovimiento === 'Transferencia') {
        executeSql('INSERT INTO MOVIMIENTOS (CODIGO_PRODUCTO, TIPO_MOVIMIENTO, CANTIDAD, FECHA, PRODUCTO_DESTINO) VALUES (?, ?, ?, ?, ?)', [codigoProducto, tipoMovimiento, cantidad, fecha, productoDestino])
          .then(() => {
            // Registrar el movimiento de ingreso para el producto destino
            return executeSql('INSERT INTO MOVIMIENTOS (CODIGO_PRODUCTO, TIPO_MOVIMIENTO, CANTIDAD, FECHA) VALUES (?, ?, ?, ?)', [productoDestino, 'Ingreso', cantidad, fecha]);
          })
          .then(() => {
            console.log('Movimientos de transferencia registrados correctamente');
            resolve();
          })
          .catch(e => {
            console.log('Error registrando movimientos de transferencia', e);
            reject(e);
          });
      } else {
        executeSql('INSERT INTO MOVIMIENTOS (CODIGO_PRODUCTO, TIPO_MOVIMIENTO, CANTIDAD, FECHA) VALUES (?, ?, ?, ?)', [codigoProducto, tipoMovimiento, cantidad, fecha])
          .then(() => {
            console.log('Movimiento registrado correctamente');
            resolve();
          })
          .catch(e => {
            console.log('Error registrando movimiento', e);
            reject(e);
          });
      }
    });
  }

  obtenerMovimientos(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      if (!this.dbInstance) {
        console.error('Base de datos no inicializada');
        resolve([]);
        return;
      }
      this.dbInstance.executeSql('SELECT * FROM MOVIMIENTOS', []).then((data) => {
        let movimientos = [];
        for (let i = 0; i < data.rows.length; i++) {
          movimientos.push(data.rows.item(i));
        }
        resolve(movimientos);
      })
      .catch(e => {
        console.log('Error obteniendo movimientos', e);
        reject(e);
      });
    });
  }
}
