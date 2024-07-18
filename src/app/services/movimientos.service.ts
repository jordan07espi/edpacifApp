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
      db.executeSql('CREATE TABLE IF NOT EXISTS MOVIMIENTOS(CODIGO_PRODUCTO VARCHAR(10), TIPO_MOVIMIENTO VARCHAR(20), CANTIDAD INTEGER, FECHA TEXT, PRODUCTO_DESTINO VARCHAR(10), PRODUCTO_ORIGEN VARCHAR(10))', [])
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

  async registrarMovimiento(codigoProducto: string, tipoMovimiento: string, cantidad: number, fecha: string, productoDestino: string = '', productoOrigen: string = ''): Promise<void> {
    if (!this.dbInstance) {
      console.error('Base de datos no inicializada');
      throw new Error('Base de datos no inicializada');
    }
    try {
      await this.dbInstance.executeSql('INSERT INTO MOVIMIENTOS (CODIGO_PRODUCTO, TIPO_MOVIMIENTO, CANTIDAD, FECHA, PRODUCTO_DESTINO, PRODUCTO_ORIGEN) VALUES (?, ?, ?, ?, ?, ?)', [codigoProducto, tipoMovimiento, cantidad, fecha, productoDestino, productoOrigen]);

      let stockUpdateQuery = '';
      let stockUpdateParams: any[] = [];

      if (tipoMovimiento === 'Ingreso') {
        stockUpdateQuery = 'UPDATE PRODUCTOS SET STOCK_LBS = COALESCE(STOCK_LBS, 0) + ? WHERE CODIGO = ?';
        stockUpdateParams = [cantidad, codigoProducto];
      } else if (tipoMovimiento === 'Salida' || tipoMovimiento === 'Transferencia') {
        stockUpdateQuery = 'UPDATE PRODUCTOS SET STOCK_LBS = COALESCE(STOCK_LBS, 0) - ? WHERE CODIGO = ?';
        stockUpdateParams = [cantidad, codigoProducto];
      }

      await this.dbInstance.executeSql(stockUpdateQuery, stockUpdateParams);

      if (tipoMovimiento === 'Transferencia') {
        // Registrar el movimiento de ingreso para el producto destino
        await this.dbInstance.executeSql('INSERT INTO MOVIMIENTOS (CODIGO_PRODUCTO, TIPO_MOVIMIENTO, CANTIDAD, FECHA, PRODUCTO_DESTINO, PRODUCTO_ORIGEN) VALUES (?, ?, ?, ?, ?, ?)', [productoDestino, 'Ingreso', cantidad, fecha, '', codigoProducto]);
        // Actualizar el stock del producto destino
        await this.dbInstance.executeSql('UPDATE PRODUCTOS SET STOCK_LBS = COALESCE(STOCK_LBS, 0) + ? WHERE CODIGO = ?', [cantidad, productoDestino]);
      }

      console.log('Movimiento registrado correctamente');
    } catch (e) {
      console.log('Error registrando movimiento', e);
      throw e;
    }
  }

  obtenerMovimientos(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      if (!this.dbInstance) {
        console.error('Base de datos no inicializada');
        resolve([]);
        return;
      }
      this.dbInstance.executeSql('SELECT * FROM MOVIMIENTOS ORDER BY FECHA DESC', []).then((data) => {
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

  obtenerMovimientosPorProducto(codigoProducto: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      if (!this.dbInstance) {
        console.error('Base de datos no inicializada');
        resolve([]);
        return;
      }
      this.dbInstance.executeSql('SELECT * FROM MOVIMIENTOS WHERE CODIGO_PRODUCTO = ? OR PRODUCTO_DESTINO = ? ORDER BY FECHA DESC', [codigoProducto, codigoProducto])
        .then((data) => {
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

  obtenerMovimientosPorCodigos(codigos: string[]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      if (!this.dbInstance) {
        console.error('Base de datos no inicializada');
        resolve([]);
        return;
      }
      const placeholders = codigos.map(() => '?').join(',');
      this.dbInstance.executeSql(`SELECT * FROM MOVIMIENTOS WHERE CODIGO_PRODUCTO IN (${placeholders})`, codigos).then((data) => {
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
