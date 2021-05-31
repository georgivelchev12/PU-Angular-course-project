import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  isChangeNames: boolean;
  profile;
  model;
  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });
  constructor(
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.myProfile().subscribe(
      (data) => {
        this.profile = data[0];
      },
      (err) => {}
    );
  }

  changeNames() {
    this.model = this.form.value;
    this.authService.changeNames(this.model).subscribe(
      (data) => {
        this.toastr.success(data.message, 'Success!');
      },
      (err) => {
        this.toastr.error(err.error.description, 'Error!');
      }
    );
    this.isChangeNames = false;
  }

  deleteUser() {
    let currentUserEmail = this.authService.getUserEmail();
    let doubleCheckText =
      this.profile.email == currentUserEmail
        ? 'Are you sure you want to delete your profile?'
        : `Are you sure you want to delete ${this.profile.firstName} ${this.profile.lastName}'s profile?`;

    if (confirm(doubleCheckText)) {
      this.authService.deleteUser(this.profile.id).subscribe(
        (data) => {
          this.toastr.success(data.message, 'Success!');
          if (this.profile.email == currentUserEmail) {
            this.authService.logout();
            return;
          }
        },
        (err) => {
          this.toastr.error(err.error.message, 'Error!');
        }
      );
    }
  }
}
