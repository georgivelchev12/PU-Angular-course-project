import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginModel } from '../models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: LoginModel;

  form = new FormGroup({
    email: new FormControl('', [Validators.email]),
    password: new FormControl('', []),
  });

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {}

  login() {
    this.user = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService.login(this.user);
  }
}
