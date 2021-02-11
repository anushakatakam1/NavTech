import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  LoginForm: any;
  returnUrl: any;

  constructor(public fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    private authenticationService: AuthenticationService) {
    //It redirect to home if already logged in
    // if (this.authenticationService.userValue) { 
    this.router.navigate(['/']);
    // }
  }

  ngOnInit(): void {
    this.CreateLoginForm();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  CreateLoginForm() {
    this.LoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      RememberMe: [false]
    });
  }

  OnSubmit() {
    if (this.LoginForm.valid) {
      this.UserLogin();
    } else {
      console.log('Invalid');
    }
  }

  UserLogin() {
    this.authenticationService.login(this.LoginForm.controls['username'].value, this.LoginForm.controls['password'].value)
      .pipe(first())
      .subscribe(
        data => {
        console.log(this.returnUrl)
          this.router.navigate(['./orders']);
        });
  }

}
