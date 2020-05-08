import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth-service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  name: string = localStorage.getItem("name");
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
