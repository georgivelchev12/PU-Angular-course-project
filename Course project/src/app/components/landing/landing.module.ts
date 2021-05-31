import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';


import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [HomeComponent, NotFoundComponent],
  imports: [RouterModule],
  exports: [HomeComponent, NotFoundComponent],
})
export class LandingModule {}
