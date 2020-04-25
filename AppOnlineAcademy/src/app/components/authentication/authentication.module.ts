import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { SharedModule } from '../shared/shared.module';
import { AuthTemplateComponent } from './auth-template/auth-template.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AuthTemplateComponent],
  imports: [CommonModule, FormsModule, SharedModule,RouterModule ],
  exports: [LoginComponent, RegisterComponent],
})
export class AuthenticationModule {}
