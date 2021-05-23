import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomePageComponent } from "./home-page/home-page.component";
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [HomePageComponent, NotFoundComponent],
  imports: [CommonModule, RouterModule],
  exports: [HomePageComponent, NotFoundComponent],
})
export class LandingModule {}
