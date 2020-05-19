import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { SharedModule } from "../shared/shared.module";
import { AuthTemplateComponent } from "./auth-template/auth-template.component";
import { RouterModule } from "@angular/router";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "src/app/core/interceptors/token.interceptor";
import { UsersProfilesComponent } from './users-profiles/users-profiles.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AuthTemplateComponent, UsersProfilesComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [LoginComponent, RegisterComponent, UsersProfilesComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class AuthenticationModule {}
