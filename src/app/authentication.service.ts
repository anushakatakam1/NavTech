import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

import { User } from './user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // public userSubject: BehaviorSubject<>;
  UserData = new Subject<User>();;
  constructor(private router: Router,
    private http: HttpClient) {
    // this.userSubject = new BehaviorSubject<User>({ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' });
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
      .pipe(map(user => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        user.authdata = window.btoa(username + ':' + password);
        localStorage.setItem('user', JSON.stringify(user));
        this.UserData.next(user);
        this.IsUserLoggedIn();
        return user;
      }));
  }

  IsUserLoggedIn() {
    return localStorage.getItem('user') != null;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.UserData.next(null);
    this.router.navigate(['/login']);
  }
}
