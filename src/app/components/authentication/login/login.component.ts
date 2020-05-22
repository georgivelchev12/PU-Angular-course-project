import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LoginModel } from "../models/login.model";
import { AuthService } from "src/app/core/services/auth-service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginFailed: boolean = false;
  errMessage: string;
  model: LoginModel;
  form = new FormGroup({
    username: new FormControl("", [Validators.email]),
    password: new FormControl("", []),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.authService.checkIfLogged()) {
      this.router.navigateByUrl("/home");
    }
  }

  login() {
    this.model = this.form.value;
    this.authService.login(this.model).subscribe(
      (data) => {
        this.toastr.success("You logged in successfully", "Success!"); 
        //you can set this object as value
        //, {
        //  disableTimeOut: true
        //}
        // if (data["_kmd"]["roles"] !== undefined) {
        //   console.log("trueee");
        // } else {
        //   console.log("falseeee");
        // }
      },
      (err) => {
        this.toastr.error(err.error.description, "Error!");
      }
    );
  }
}
