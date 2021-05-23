import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth-service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NamesModel } from '../models/names.model';

@Component({
  selector: 'app-users-profiles',
  templateUrl: './users-profiles.component.html',
  styleUrls: ['./users-profiles.component.scss'],
})
export class UsersProfilesComponent implements OnInit {
  clickedProfileID;
  currentProfileId;
  profiles;
  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });
  model: NamesModel;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.currentProfileId = localStorage.getItem('id');
    this.getUsers();
  }

  deleteUser(id, softOrHard) {
    if (confirm('Are you sure you want to delete your profile?')) {
      this.authService.deleteOrBlockUser(id, softOrHard).subscribe(
        (data) => {
          this.toastr.success(
            'You blocked/deleted profile successfully!',
            'Success!'
          );
          this.getUsers();
        },
        (err) => {
          this.toastr.error(err.error.description, 'Error!');
        }
      );
    }
  }

  getUsers() {
    this.authService.getUsers().subscribe(
      (data) => {
        this.profiles = data;
        this.profiles = this.profiles.filter(
          (elem) => elem['_id'] !== this.currentProfileId
        );
      },
      (err) => {
        this.toastr.error(err.error.description, 'Error!');
      }
    );
  }

  restoreProfile(id) {
    this.authService.restoreProfile(id).subscribe(
      (data) => {
        this.getUsers();
      },
      (err) => {
        this.toastr.error(err.error.description, 'Error!');
      }
    );
  }

  changeNames(id) {
    this.model = this.form.value;
    this.authService.changeNames(id, this.model).subscribe(
      (data) => {
        this.toastr.success(
          "You changed user's names successfully!",
          'Success!'
        );
      },
      (err) => {
        this.toastr.error(err.error.description, 'Error!');
      }
    );
    this.clickedProfileID = '';
  }
}
