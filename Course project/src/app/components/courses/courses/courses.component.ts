import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from 'src/app/core/services/courses.service';
import { CourseModel } from '../course.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  courses: Array<CourseModel>;
  constructor(private coursesService: CoursesService, public router: Router) {}

  ngOnInit() {    
    this.listCourses();
  }

  onEvent(changed) {
    // probably reset coruses on delete one.. try it later
    this.listCourses();
  }

  listCourses() {
    if (this.router.url.includes('courses/favourites')) {
      this.coursesService.listAll().subscribe(
        (data) => {
          this.courses = data;
          this.courses = this.courses.filter((elem) => {
            return elem['likes'].includes(localStorage.getItem('email'));
          });
        },
        (err) => {}
      );
    } else {
      this.coursesService.listAll().subscribe(
        (data) => {
          this.courses = data;
        },
        (err) => {}
      );
    }
  }
}
