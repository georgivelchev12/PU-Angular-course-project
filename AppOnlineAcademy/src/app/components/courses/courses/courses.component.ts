import { Component, OnInit } from "@angular/core";
import { CourseModel } from "../models/course.model";
import { CoursesService } from "src/app/core/services/courses-service";

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.scss"],
})
export class CoursesComponent implements OnInit {
  courses: any;
  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    this.coursesService.listAll().subscribe(
      (data) => {
        this.courses = data;
      },
      (err) => {}
    );
  }
  onEvent(changed) {
    this.coursesService.listAll().subscribe(
      (data) => {
        this.courses = data;
      },
      (err) => {}
    );
  }
}
