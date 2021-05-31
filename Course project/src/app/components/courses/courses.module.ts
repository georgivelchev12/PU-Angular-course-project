import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateCourseComponent } from './create-course/create-course.component';
import { CourseComponent } from './course/course.component';
import { CoursesComponent } from './courses/courses.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { DetailsCourseComponent } from './details-course/details-course.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

@NgModule({
  declarations: [
    CreateCourseComponent,
    CoursesComponent,
    CourseComponent,
    EditCourseComponent,
    DetailsCourseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'courses',
        children: [
          { path: '', component: CoursesComponent, pathMatch: 'full' },
          { path: 'create', component: CreateCourseComponent },
          { path: 'edit/:id', component: EditCourseComponent },
          { path: 'details/:id', component: DetailsCourseComponent },
        ],
        canActivate: [AuthGuard]
      },
    ]),
  ],
  exports: [],
})
export class CoursesModule {}
