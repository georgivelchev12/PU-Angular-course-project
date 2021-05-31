import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  // Tod do AuthService
  constructor(public authService: AuthService, public router: Router, ) { }


  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

}
