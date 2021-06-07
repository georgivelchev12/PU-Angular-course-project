import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { RegisterModel } from '../models/register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user: RegisterModel;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      // Validators.minLength(3),
      // Validators.pattern('(?=.*[A-Z])(?=.*[0-9]).*'), // at least one capital letter and one number
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  constructor(
    private authService: AuthService,
    public toastr: ToastrService,
    public router: Router
  ) {}

  ngOnInit() {
    if(this.authService.isAuthenticated){
      this.router.navigateByUrl('/')
    }
  }

  register() {
    this.user = {
      id: '',
      email: this.form.value.email,
      password: this.form.value.password,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      date: new Date().toLocaleDateString().split(' ')[0],
    };

    this.authService.register(this.user).subscribe(
      (data) => {
        this.router.navigateByUrl('/login');
        this.toastr.success(
          'You registered successfully. You should login now!',
          'Success!'
        );
      },
      (error) => {
        this.toastr.error(error.error.message, "Error!");
      }
    );
  }
}
