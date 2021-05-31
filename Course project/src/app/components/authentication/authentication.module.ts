import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptor } from "src/app/core/interceptors/auth.interceptor";
import { SharedModule } from "../shared/shared.module";
import { LoginRegisterTemplateComponent } from "./login-register-template/login-register-template.component";
import { LoginComponent } from "./login/login.component";
import { MyProfileComponent } from "./my-profile/my-profile.component";
import { RegisterComponent } from "./register/register.component";
import { UsersProfilesComponent } from "./users-profiles/users-profiles.component";

@NgModule({
    declarations: [
        LoginRegisterTemplateComponent,
        LoginComponent,
        RegisterComponent,
        UsersProfilesComponent,
        MyProfileComponent
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        LoginComponent,
        RegisterComponent,
        UsersProfilesComponent,
        MyProfileComponent
    ],
    providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    ],
})

export class AuthenticationModule {}