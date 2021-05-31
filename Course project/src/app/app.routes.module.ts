// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterTemplateComponent } from './components/authentication/login-register-template/login-register-template.component';
import { MyProfileComponent } from './components/authentication/my-profile/my-profile.component';
import { UsersProfilesComponent } from './components/authentication/users-profiles/users-profiles.component';

// Components
import { HomeComponent } from './components/landing/home/home.component';
import { NotFoundComponent } from './components/landing/not-found/not-found.component';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginRegisterTemplateComponent },
  { path: 'register', component: LoginRegisterTemplateComponent },
  { path: 'my-profile', component: MyProfileComponent },

  {
    path: 'users-profiles',
    component: UsersProfilesComponent,
    canActivate: [AdminGuard] 
  },
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutesModule {}
