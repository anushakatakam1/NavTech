import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OrderslistComponent } from './orderslist/orderslist.component';
import { HomeComponent } from './home/home.component';

import { HttpClientModule } from '@angular/common/http';
import { OrdersBackendProvider } from './order-interceptor.service';
import { LoginBackendProvider } from './login-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OrderslistComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [LoginBackendProvider, OrdersBackendProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
