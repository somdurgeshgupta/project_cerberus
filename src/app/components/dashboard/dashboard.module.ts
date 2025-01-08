import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { MatButtonModule } from '@angular/material/button';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [CategoriesComponent, ProductsComponent, OrdersComponent, ProfileComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,


  ],
})
export class DashboardModule {}
