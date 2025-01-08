import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [CategoriesComponent, ProductsComponent, OrdersComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,


  ],
})
export class DashboardModule {}
