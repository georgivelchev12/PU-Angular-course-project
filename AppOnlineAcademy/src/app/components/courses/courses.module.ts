import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CourseComponent } from "./course/course.component";
import { CoursesComponent } from "./courses/courses.component";
import { RouterModule } from "@angular/router";
import { HomePageComponent } from '../landing/home-page/home-page.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

@NgModule({
  declarations: [CourseComponent, CoursesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "courses", component: HomePageComponent, canActivate:[AuthGuard] },
      { path: "details/:id", component: CourseComponent },
    ]),
  ],
  exports: [CourseComponent, CoursesComponent],
})
export class CoursesModule {}
