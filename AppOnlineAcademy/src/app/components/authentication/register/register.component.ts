import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/services/auth-service";
import { Router } from "@angular/router";
import { RegisterModel } from "../models/register.model";
import {
  FormGroup,
  FormControl,
  FormControlName,
  Validator,
  Validators,
} from "@angular/forms";
import { LoginModel } from "../models/login.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerFailed: boolean = false;
  errMessage: string;
  model: RegisterModel;
  // loginModel: LoginModel;
  form = new FormGroup({
    username: new FormControl("", [Validators.required, Validators.email]),
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern("(?=.*[A-Z])(?=.*[0-9]).*"), // at least one capital letter and one number
    ]),
    confirmPassword: new FormControl("", [Validators.required]),
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
  log() {
    console.log(this.form.get("password"));
  }
  register() {
    this.model = this.form.value;
    this.model.date = new Date().toLocaleDateString().split(' ')[0];
    delete this.model["confirmPassword"];
    this.authService.register(this.model).subscribe(
      (data) => {
        this.router.navigateByUrl("/login");
        this.toastr.success(
          "You registered successfully. You should login now",
          "Success!"
        );

        // this.loginModel = <LoginModel>this.model;
        // this.authService.login(this.loginModel).subscribe(
        //   (data) => {},
        //   (err) => {
        //     this.registerFailed = true;
        //     this.errMessage = err.error.description;
        //   }
        // );

        if (!(data["username"] == "z.strahinova@uni-plovdiv.bg" || data["username"] == "g.velchev12@gmail.com")) {
          this.authService
            .assignRole(data["_id"])
            .pipe((err) => err)
            .subscribe(
              (data) => {},
              (err) => {
                this.registerFailed = true;
                this.errMessage = err.error.description;
                this.toastr.error(err.error.description, "Error!");
              }
            );
        }
      },
      (err) => {
        this.toastr.error(err.error.description, "Error!");
        //is loading functionality
      }
    );
  }
}
