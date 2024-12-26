import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent, // Parent container component
    children: [
      {
        path: 'categories',
        component: CategoriesComponent, // Nested route
      },
      {
        path: 'products',
        component: ProductsComponent, // Nested route
      },
      {
        path: 'orders',
        component: OrdersComponent, // Nested route
      },
      {
        path: '',
        redirectTo: 'categories', // Default child route
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '', // Fallback route
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
