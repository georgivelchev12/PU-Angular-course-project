import { Component, OnInit } from "@angular/core";
import { CourseModel } from "../models/course.model";
import { CoursesService } from "src/app/core/services/courses-service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: "app-create-course",
  templateUrl: "./create-course.component.html",
  styleUrls: ["./create-course.component.scss"],
})
export class CreateCourseComponent implements OnInit {
  model: CourseModel;
  form = new FormGroup({
    title: new FormControl("", [Validators.required]),
    author: new FormControl("", [Validators.required, Validators.pattern(/[A-Z][a-z]+ [A-Z][a-z]+/)]),
    description: new FormControl("", [Validators.required]),
    categories: new FormControl("", [Validators.required, Validators.pattern(/^\w+(?:,? \w+)*$/)]), // pattern to check if delimer is comma and space
    imgUrl: new FormControl("", [Validators.required, Validators.pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)]),
  });

  constructor(
    private coursesService: CoursesService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {}

  create() {
    this.model = this.form.value;
    this.model.categories = this.form.value['categories'].split(', ');
    this.model.likes = [];
    this.model.rating = [];
    this.model.date = new Date().toLocaleDateString().split(' ')[0];
    
    this.coursesService.createCourse(this.model).subscribe(
      (data) => {
        this.toastr.success('You created a course successfully', 'Success');
        this.router.navigateByUrl('/courses')
      },
      (err) => {
        this.toastr.error(err.error.description, "Error!");
      }
    );
  }
}
