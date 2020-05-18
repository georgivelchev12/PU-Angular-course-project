import { Component, OnInit } from "@angular/core";
import { CourseModel } from "../models/course.model";
import { CoursesService } from "src/app/core/services/courses-service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.scss"],
})
export class CoursesComponent implements OnInit {
  courses: any;
  constructor(private coursesService: CoursesService, public router: Router) {}

  ngOnInit() {
    this.listCourses();
  }
  onEvent(changed) {
    this.listCourses();
  }

  listCourses() {
    if (this.router.url.includes("courses/favourites")) {
      this.coursesService.listAll().subscribe(
        (data) => {
          this.courses = data;
          this.courses = this.courses.filter((elem) => {
            return elem["likes"].includes(localStorage.getItem("email"));
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
