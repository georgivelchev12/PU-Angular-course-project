import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { SharedModule } from "./components/shared/shared.module";
import { LandingModule } from "./components/landing/landing.module";
import { HttpClientModule } from "@angular/common/http";


import { AppComponent } from "./app.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { AuthenticationModule } from "./components/authentication/authentication.module";
import { CoursesModule } from "./components/courses/courses.module";
import { AuthService } from "./core/services/auth-service";
import { AppRoutesModule } from './app.routes.module';
import { CoursesService } from './core/services/courses-service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AuthenticationModule,
    CoursesModule,
    SharedModule,
    BrowserModule,
    LandingModule,
    HttpClientModule,
    AppRoutesModule
  ],
  providers: [AuthGuard, AuthService, CoursesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
