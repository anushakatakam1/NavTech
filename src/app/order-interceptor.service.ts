import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderInterceptorService implements HttpInterceptor {

  Orders: any = [
    { OrdId: 1, OrdNo: 123, DDate: '12th jun 2020', CustName: 'Akshaya', Adrs: 'LB Nagar, Hyderabad', PhNo: '9898777757', OrdTotal: 987 },
    { OrdId: 2, OrdNo: 7415, DDate: '12th jan 2020', CustName: 'Sathvika', Adrs: 'Sai Nagar, Hyderabad', PhNo: '9878777757', OrdTotal: 1987 }
  ];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.handleRoute(request, next);
  }

  handleRoute(request, next) {
    const { url, method, headers, body } = request;
    console.log(method);
    switch (true) {
      case url.endsWith('/orders') && method === 'GET':
        return this.getOrders(body);
      case url.match(/\/order\/\d+$/) && method === 'GET':
        return this.getOrderById(body, url);
      case url.endsWith('/createorder') && method === 'POST':
        return this.CreateOrder(body);

      case url.endsWith('/updateorder') && method === 'PUT':
        return this.CreateOrder(body);
      case url.endsWith('/deleteorder') && method === 'DELETE':
        return this.DeleteOrder(body);

    }
    return next.handle(request);
  }

  getOrders(body) {
    body = this.Orders;
    return of(new HttpResponse({ status: 200, body }))
      .pipe(delay(500));
  }

  CreateOrder(body) {
    body.OrdId = this.CreateOrderId();
    return of(new HttpResponse({ status: 200, body }))
      .pipe(delay(500));
  }

  getOrderById(body: any, url) {
    console.log('Id');
    const urlParts = url.split('/');
    const Id = parseInt(urlParts[urlParts.length - 1]);
    console.log(Id);
    const order = this.Orders.find(x => x.OrdId === Id);
    body = order;
    return of(new HttpResponse({ status: 200, body }))
      .pipe(delay(500));
  }

  orderDetails(order: any) {
    const { OrdId, OrdNo, DDate, CustName, Adrs, PhNo, OrdTotal } = order;
    return { OrdId, OrdNo, DDate, CustName, Adrs, PhNo, OrdTotal };
  }

  updateorder(body) {
    let order = this.Orders.find(x => x.OrdId === body.OrdId);
    Object.assign(order, body);
    return of(new HttpResponse({ status: 200, body }))
      .pipe(delay(500));
  }

  DeleteOrder(body) {
    let index = this.Orders.findIndex(x => x.OrdId === body);
    this.Orders.splice(index, 1);
    body = this.Orders;
    return of(new HttpResponse({ status: 200, body }))
      .pipe(delay(500));
  }

  CreateOrderId() {
    return this.Orders.length + 1;
  }
}

export let OrdersBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: OrderInterceptorService,
  multi: true
};
