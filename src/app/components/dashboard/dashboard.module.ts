import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { MatButtonModule } from '@angular/material/button';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatIconModule } from '@angular/material/icon'; 
import { SettingsComponent } from './settings/settings.component';
import { ActiveSessionsComponent } from './settings/active-sessions/active-sessions.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { AddressesComponent } from './addresses/addresses.component';
import { CheckoutComponent } from './checkout/checkout.component';

@NgModule({
  declarations: [OrdersComponent, ProfileComponent, SettingsComponent, ActiveSessionsComponent, CartComponent, WishlistComponent, AddressesComponent, CheckoutComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule,
    FormsModule
  ],
})
export class DashboardModule {}
