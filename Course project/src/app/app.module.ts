
// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Custom modules
import { LandingModule } from './components/landing/landing.module';
import { AppRoutesModule } from './app.routes.module';
import { CoursesModule } from './components/courses/courses.module';

// Components
import { AppComponent } from './app.component';


import { CoursesService } from './core/services/courses.service';
import { SharedModule } from './components/shared/shared.module';
import { AuthenticationModule } from './components/authentication/authentication.module';
import { AuthGuard } from './core/guards/auth.guard';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoursesModule,
    LandingModule,
    AppRoutesModule,
    SharedModule,
    AuthenticationModule,
  ],
  providers: [
    CoursesService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
