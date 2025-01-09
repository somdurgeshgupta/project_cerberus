import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { authInterceptor } from './guards/auth.interceptor';
import { ExpiredPageComponent } from './components/expired-page/expired-page.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { HeaderCommonComponent } from './components/header-common/header-common.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoaderComponent } from './loader/loader.component';
import { loaderInterceptor } from './guards/loader.interceptor';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrokenImageDirective } from './broken-image.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    PageNotFoundComponent,
    HeaderComponent,
    SidebarComponent,
    ExpiredPageComponent,
    AboutComponent,
    ContactComponent,
    HeaderCommonComponent,
    ForgotPasswordComponent,
    LoaderComponent,
    BrokenImageDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
],
  providers: [
    provideAnimationsAsync(), provideHttpClient(withInterceptors([authInterceptor, loaderInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
