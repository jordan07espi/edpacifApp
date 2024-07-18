import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then(m => m.ProductosPageModule)
  },
  {
    path: 'agregar-producto',
    loadChildren: () => import('./agregar-producto/agregar-producto.module').then( m => m.AgregarProductoPageModule)
  },
  {
    path: 'detalle-producto/:codigo',
    loadChildren: () => import('./detalle-producto/detalle-producto.module').then(m => m.DetalleProductoPageModule)
  },
  {
    path: 'movimientos',
    loadChildren: () => import('./movimientos/movimientos.module').then(m => m.MovimientosPageModule)
  },
  {
    path: 'kardex',
    loadChildren: () => import('./kardex/kardex.module').then( m => m.KardexPageModule)
  },
  {
    path: 'reportes',
    loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesPageModule)
  },
  {
    path: 'registrar-movimiento',
    loadChildren: () => import('./registrar-movimiento/registrar-movimiento.module').then( m => m.RegistrarMovimientoPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
