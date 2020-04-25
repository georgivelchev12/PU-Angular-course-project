import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { SharedModule } from "./components/shared/shared.module";
import { LandingModule } from "./components/landing/landing.module";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { HomePageComponent } from "./components/landing/home-page/home-page.component";
import { AppComponent } from "./app.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { AuthenticationModule } from "./components/authentication/authentication.module";
import { CoursesModule } from "./components/courses/courses.module";
import { AuthService } from "./core/services/auth-service";
import { LoginComponent } from "./components/authentication/login/login.component";
import { RegisterComponent } from './components/authentication/register/register.component';
import { AuthTemplateComponent } from './components/authentication/auth-template/auth-template.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AuthenticationModule,
    CoursesModule,
    SharedModule,
    BrowserModule,
    LandingModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: "", component: HomePageComponent, canActivate: [AuthGuard] },
      { path: "home", component: HomePageComponent, canActivate: [AuthGuard] },
      { path: "login", component: AuthTemplateComponent },
      { path: "register", component: AuthTemplateComponent },
      {
        path: "courses",
        canActivate: [AuthGuard],
        loadChildren: "./components/courses/courses.module#CoursesModule",
      },
    ]),
  ],
  providers: [AuthGuard, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
