import { Component, OnInit, AfterViewInit } from "@angular/core";
import { AuthService } from "src/app/core/services/auth-service";
import { RegisterModel } from "../../authentication/models/register.model";

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"],
})
export class MyProfileComponent implements OnInit, AfterViewInit {
  profile;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.myProfile(localStorage.getItem("id")).subscribe(
      (data) => {
        this.profile = data;
        console.log(this.profile);
      },
      (err) => {}
    );
  }

  ngAfterViewInit() {
    
  }
}
