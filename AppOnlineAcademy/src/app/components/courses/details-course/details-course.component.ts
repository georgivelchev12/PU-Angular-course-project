import { Component, OnInit } from "@angular/core";
import { CoursesService } from "src/app/core/services/courses-service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth-service";
import { ToastrService } from "ngx-toastr";
import { CourseModel } from "../models/course.model";
import { FormGroup, FormControl } from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loading-service';

@Component({
  selector: "app-details-course",
  templateUrl: "./details-course.component.html",
  styleUrls: ["./details-course.component.scss"],
})
export class DetailsCourseComponent implements OnInit {
  rateCourseNum: number = 3;
  courseId;
  course: CourseModel;
  averageRate: number;
  starsRating;
  isAlreadyRated: boolean;
  isAlreadyLiked: boolean;
  constructor(
    public coursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    public loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get("id");
    this.getCourse();
  }
  getCourse(){
    this.coursesService.get(this.courseId).subscribe(
      (data) => {
        this.course = <CourseModel>data;
        this.averageRate = this.course.rating.length > 0 ? Number((this.course.rating.reduce((a, b) => a + b['rate'], 0) / this.course.rating.length).toFixed(1)) : 0;
        this.starsRating = this.course.rating.length !== 0 
                              ? Math.round((this.averageRate / 5) * 100) 
                              : 0;
        this.isAlreadyRated = this.course.rating.find((obj) =>obj['name'] == localStorage.getItem('email')) !== undefined;
        this.isAlreadyLiked = this.course.likes.includes(localStorage.getItem('email'))
        
      },
      (err) => {
        this.toastr.error(err.error.description, "Error!");
      }
    );
  }
  deleteCourse() {
    this.coursesService.delete(this.courseId).subscribe(
      (data) => {
        this.toastr.success("You deleted course successfully", "Success!");
        this.router.navigateByUrl('/courses')
      },
      (err) => {
        this.toastr.error(err.error.description, "Error!");
      }
    );

  }
  rate(){
    if (!this.isAlreadyRated) {
      this.course.rating.push({name: localStorage.getItem('email'),rate:this.rateCourseNum});
      this.coursesService.edit(this.courseId, this.course).subscribe(
        (data) => {
          this.toastr.success("You rated the course successfully", "Success!");
          this.getCourse();
        },
        (err) => {
          this.toastr.error(err.error.description, "Error!");
        }
      );
    } else{
      this.toastr.error('You already rated this course', "Error!");
    }
  }
  likeOrDislike(){
    if (!this.isAlreadyLiked) {
      this.course.likes.push(localStorage.getItem('email'));
      this.coursesService.edit(this.courseId, this.course).subscribe(
        (data) => {
          this.toastr.success("You liked the course successfully", "Success!");
          this.getCourse();
        },
        (err) => {
          this.toastr.error(err.error.description, "Error!");
        }
      );
    } else{
      let indexOfName = this.course.likes.indexOf(localStorage.getItem('email'));
      this.course.likes.splice(indexOfName,1);
      this.coursesService.edit(this.courseId, this.course).subscribe(
        (data) => {
          this.toastr.success("You disliked the course successfully", "Success!");
          this.getCourse();
        },
        (err) => {
          this.toastr.error(err.error.description, "Error!");
        }
      );
    }
    this.getCourse();
  }
}
