import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-users-profiles',
  templateUrl: './users-profiles.component.html',
  styleUrls: ['./users-profiles.component.scss'],
})
export class UsersProfilesComponent implements OnInit {
  clickedProfileID;
  currentUserEmail;
  profiles;
  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });
  model;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.currentUserEmail = this.authService.getUserEmail();
    this.getUsers();
  }

  getUsers() {
    this.authService.getUsers().subscribe(
      (data) => {
        this.profiles = data.filter(
          (user) => user.email !== this.currentUserEmail
        );
      },
      (err) => {
        this.toastr.error(err.error.message, 'Error!');
      }
    );
  }
  disableUser(userProfile) {
    this.authService.disableUser(userProfile.id, userProfile).subscribe(
      (data) => {
        this.getUsers();
        this.toastr.success(data.message, 'Success!');
      },
      (err) => {
        this.toastr.error(err.error.message, 'Error!');
      }
    );
  }

  restoreUser(userProfile) {
    this.authService.restoreUser(userProfile.id, userProfile).subscribe(
      (data) => {
        this.getUsers();
        this.toastr.success(data.message, 'Success!');
      },
      (err) => {
        this.toastr.error(err.error.message, 'Error!');
      }
    );
  }

  deleteUser(userProfile) {
    
    let doubleCheckText =
      userProfile.email == this.currentUserEmail
        ? 'Are you sure you want to delete your profile?'
        : `Are you sure you want to delete ${userProfile.firstName} ${userProfile.lastName}'s profile?`;

    if (confirm(doubleCheckText)) {
      this.authService.deleteUser(userProfile.id).subscribe(
        (data) => {
          this.toastr.success(data.message, 'Success!');
          if (userProfile.email == this.currentUserEmail) {
            this.authService.logout();
            return;
          }
          this.getUsers();
        },
        (err) => {
          this.toastr.error(err.error.message, 'Error!');
        }
      );
    }
  }

  // changeNames(id) {
  //   this.model = this.form.value;
  //   this.authService.changeNames(id, this.model).subscribe(
  //     (data) => {
  //       this.toastr.success(
  //         "You changed user's names successfully!",
  //         'Success!'
  //       );
  //     },
  //     (err) => {
  //       this.toastr.error(err.error.description, 'Error!');
  //     }
  //   );
  //   this.clickedProfileID = '';
  // }
}
