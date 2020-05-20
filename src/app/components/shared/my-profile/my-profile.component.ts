import { Component, OnInit, AfterViewInit, Input } from "@angular/core";
import { AuthService } from "src/app/core/services/auth-service";
import {
  FormGroup,
  FormControl,
  FormControlName,
  Validator,
  Validators,
} from "@angular/forms";
import { NamesModel } from "../../authentication/models/names.model";
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"],
})
export class MyProfileComponent implements OnInit {
  isChangeNames: boolean;
  profile;
  model: NamesModel;
  form = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
  });
  constructor(public authService: AuthService, private toastr: ToastrService,private router: Router,) {}
  ngOnInit() {
    this.authService.myProfile(localStorage.getItem("id")).subscribe(
      (data) => {
        this.profile = data;
      },
      (err) => {}
    );
  }
  changeNames() {
    this.model = this.form.value;
    this.authService
      .changeNames(localStorage.getItem("id"), this.model)
      .subscribe(
        (data) => {
          this.toastr.success(
            "You changed your names successfully!",
            "Success!"
          );
        },
        (err) => {
          this.toastr.error(err.error.description, "Error!");
        }
      );
    this.isChangeNames = false;
  }
  deleteUser() {
    if (confirm("Are you sure you want to delete your profile?")) {
      this.authService.deleteOrBlockUser(localStorage.getItem("id"), "?hard=true").subscribe(
        (data) => {
          localStorage.clear();
          this.router.navigateByUrl("/login")
          this.toastr.success("You deleted profile successfully!", "Success!");
        },
        (err) => {
          this.toastr.error(err.error.description, "Error!");
        }
      );
    }
  }
}
