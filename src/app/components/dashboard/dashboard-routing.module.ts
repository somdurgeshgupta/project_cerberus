import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { OrdersComponent } from './orders/orders.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { ActiveSessionsComponent } from './settings/active-sessions/active-sessions.component';

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
        path: 'orders',
        component: OrdersComponent, // Nested route
      },
      {
        path: 'contact',
        component: ContactComponent, // Nested route
      },
      {
        path: 'about',
        component: AboutComponent, // Nested route
      },
      {
        path: 'profile',
        component: ProfileComponent, // Nested route
      },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {
            path: 'active-sessions',
            component: ActiveSessionsComponent
          },
          {
            path: '',
            redirectTo: 'active-sessions',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'categories', // Default child route
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**', // Catch-all route
    component: PageNotFoundComponent, // Display PageNotFoundComponent outside of Dashboard layout
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
