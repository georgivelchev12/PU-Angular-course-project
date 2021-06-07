import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login-register-template',
  templateUrl: './login-register-template.component.html',
  styleUrls: ['./login-register-template.component.scss']
})
export class LoginRegisterTemplateComponent implements OnInit {

  constructor(public router: Router, private authService: AuthService) { }

  ngOnInit() {
    if(this.authService.isAuthenticated){
      this.router.navigateByUrl('/')
    }
  }

}
