import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { OrderModel } from './order-model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private router: Router,
    private http: HttpClient) { }

  getOrders() {
    return this.http.get(`${environment.apiUrl}/orders`);
  }

  getOrderById(OrdId: any) {
    return this.http.get(`${environment.apiUrl}/order/` + OrdId);
  }

  CreateOrder(OrderData: any) {
    return this.http.post<any>(`${environment.apiUrl}/createorder`, OrderData)
  }

  UpdateOrder(OrderData: any) {
    return this.http.put(`${environment.apiUrl}/updateorder`, OrderData);
  }

  DeleteOrder(OrderData: any) {
    return this.http.delete(`${environment.apiUrl}/deleteorder`, OrderData);
  }
}
