import { Component, OnInit } from "@angular/core";
import { CoursesService } from "src/app/core/services/courses-service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/core/services/auth-service";
import { ToastrService } from "ngx-toastr";
import { CourseModel } from "../models/course.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-edit-course",
  templateUrl: "./edit-course.component.html",
  styleUrls: ["./edit-course.component.scss"],
})
export class EditCourseComponent implements OnInit {
  form = new FormGroup({
    title: new FormControl("", [Validators.required]),
    author: new FormControl("", [
      Validators.required,
      Validators.pattern(/[A-Z][a-z]+ [A-Z][a-z]+/),
    ]),
    description: new FormControl("", [Validators.required]),
    categories: new FormControl("", [
      Validators.required,
      Validators.pattern(/^\w+(?:,? \w+)*$/),
    ]), // pattern to check if delimer is comma and space
    imgUrl: new FormControl("", [
      Validators.required,
      Validators.pattern(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
      ),
    ]),
  });
  courseId;
  currentCourse: CourseModel;
  constructor(
    public coursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get("id");
    this.coursesService.get(this.courseId).subscribe(
      (data) => {
        this.currentCourse = <CourseModel>data;
        this.currentCourse.categories = data["categories"].join(", ");
      },
      (err) => {
        this.toastr.error(err.error.description, "Error!");
      }
    );
  }
  ngOnDestroy() {}

  edit() {
    this.currentCourse.categories = this.currentCourse.categories.toString().split(", ");
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.coursesService.edit(this.courseId, this.currentCourse).subscribe(
      (data) => {
        this.toastr.success("You updated the course successfully", "Success!");
        this.router.navigateByUrl(`courses/details/${this.courseId}`);
      },
      (err) => {
        this.toastr.error(err.error.description, "Error!");
      }
    );
  }
}
