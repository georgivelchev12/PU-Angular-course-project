import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { AuthService } from "src/app/core/services/auth-service";
import { CourseModel } from "../models/course.model";
import { Router, ActivatedRoute } from "@angular/router";
import { CoursesService } from "src/app/core/services/courses-service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.scss"],
})
export class CourseComponent implements OnInit, OnDestroy {
  @Input() course: CourseModel;
  @Output() courses = new EventEmitter<any>();
  starsWidth: number;
  courseRating: number;
  courseId;
  averageRate;
  starsRating;
  isAlreadyLiked: boolean;
  constructor(
    public coursesService: CoursesService,
    private route: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.courseId = this.course["_id"];
    this.averageRate =
      this.course.rating.length > 0
        ? Number(
            (
              this.course.rating.reduce((a, b) => a + b["rate"], 0) /
              this.course.rating.length
            ).toFixed(1)
          )
        : 0;
    this.starsRating =
      this.course.rating.length !== 0
        ? Math.round((this.averageRate / 5) * 100)
        : 0;
    this.isAlreadyLiked = this.course.likes.includes(
      localStorage.getItem("email")
    );
  }
  ngOnDestroy() {}

  listAll() {
    this.coursesService.listAll().subscribe(
      (data) => {
        this.courses.emit(data);
      },
      (err) => {}
    );
  }
  deleteCourse(id) {
    this.coursesService.delete(id).subscribe(
      (data) => {
        this.toastr.success("You deleted course successfully", "Success!");
      },
      (err) => {
        this.toastr.error(err.error.description, "Error!");
      }
    );
    this.listAll();
  }
  likeOrDislike() {
    if (!this.isAlreadyLiked) {
      this.course.likes.push(localStorage.getItem("email"));
      this.coursesService.edit(this.courseId, this.course).subscribe(
        (data) => {
          this.toastr.success("You liked the course successfully", "Success!");
        },
        (err) => {
          this.toastr.error(err.error.description, "Error!");
        }
      );
    } else {
      let indexOfName = this.course.likes.indexOf(
        localStorage.getItem("email")
      );
      this.course.likes.splice(indexOfName, 1);
      this.coursesService.edit(this.courseId, this.course).subscribe(
        (data) => {
          this.toastr.success(
            "You disliked the course successfully",
            "Success!"
          );
        },
        (err) => {
          this.toastr.error(err.error.description, "Error!");
        }
      );
    }
    this.listAll();
  }
}
