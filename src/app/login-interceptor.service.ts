import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from './user-model';

const users: User[] = [
  { id: 1, username: 'testuser1', password: 'password', firstName: 'Test', lastName: 'User1' },
  { id: 2, username: 'testuser2', password: 'password', firstName: 'Test', lastName: 'User2' }
];

@Injectable()
export class LoginInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute)) // this will handle dummy api call related code
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown 
      .pipe(delay(200))
      .pipe(dematerialize());

    // this will handle dummy api call related code
    function handleRoute() {
      console.log(method);
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticateUser();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticateUser() {
      const { username, password } = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return LoginSuccess({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      })
    }

    function getUsers() {
      if (!isLoggedIn()) return unauthorized();
      return LoginSuccess(users);
    }

    //function when user loggedin success to return the object
    function LoginSuccess(body?: any) {
      return of(new HttpResponse({ status: 200, body }));
    }

    //function when user loggedin fails
    function error(message: any) {
      return throwError({ error: { message } });
    }

    //function when user loggedin details are invalid  
    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    //Checks whether user loggedin or not 
    function isLoggedIn() {
      return headers.get('Authorization') === `Basic ${window.btoa('test:test')}`;
    }
  }


}



export let LoginBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: LoginInterceptorService,
  multi: true
};