import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { MatButtonModule } from '@angular/material/button';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CategoriesComponent, ProductsComponent, OrdersComponent, ProfileComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
})
export class DashboardModule {}
