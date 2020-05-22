import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/landing/home-page/home-page.component';
import { AuthTemplateComponent } from './components/authentication/auth-template/auth-template.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UsersProfilesComponent } from './components/authentication/users-profiles/users-profiles.component';
import { CoursesGuard } from './core/guards/courses.guard';
import { MyProfileComponent } from './components/shared/my-profile/my-profile.component';
import { NotFoundComponent } from './components/landing/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: AuthTemplateComponent },
  { path: 'register', component: AuthTemplateComponent },
  {
    path: 'my-profile',
    component: MyProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users-profiles',
    component: UsersProfilesComponent,
    canActivate: [CoursesGuard],
  },
  {
    path: 'courses',
    canActivate: [AuthGuard],
    pathMatch: 'full',
    loadChildren: './components/courses/courses.module#CoursesModule',
  },
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutesModule {}
