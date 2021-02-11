import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth-guard';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OrderslistComponent } from './orderslist/orderslist.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'orders', component: OrderslistComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
