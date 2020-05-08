import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CourseComponent } from "./course/course.component";
import { CoursesComponent } from "./courses/courses.component";
import { RouterModule } from "@angular/router";
import { HomePageComponent } from "../landing/home-page/home-page.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { CreateCourseComponent } from './create-course/create-course.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursesGuard } from 'src/app/core/guards/courses.guard';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { DetailsCourseComponent } from './details-course/details-course.component';

@NgModule({
  declarations: [CourseComponent, CoursesComponent, CreateCourseComponent, EditCourseComponent, DetailsCourseComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "courses",
        children: [
          { path: '', component: CoursesComponent, pathMatch: 'full'},
          { path: "create", component: CreateCourseComponent, canActivate: [CoursesGuard]},
          { path: "edit/:id", component: EditCourseComponent, canActivate: [CoursesGuard]},
          { path: "details/:id", component: DetailsCourseComponent, canActivate: [AuthGuard] },
          { path: "list", component: CourseComponent },
        ],
      },
    ]),
  ],
  exports: [CourseComponent, CoursesComponent],
})
export class CoursesModule {}
