import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoursesService } from 'src/app/core/services/courses.service';
import { CourseModel } from '../course.model';

@Component({
  selector: 'app-details-course',
  templateUrl: './details-course.component.html',
  styleUrls: ['./details-course.component.scss'],
})
export class DetailsCourseComponent implements OnInit {
  rateCourseNum: number = 3;
  course: CourseModel;
  averageRate: number;
  isAlreadyRated: boolean;
  isAlreadyLiked: boolean;
  starsRating;
  courseId;
  constructor(
    public coursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.getCourse();
  }
  getCourse() {
    this.coursesService.get(this.courseId).subscribe(
      (data) => {
        this.course = <CourseModel>data[0];
        this.upgradeRatingAndLikes()
      },
      (err) => {
        this.toastr.error(err.error.message, 'Error!');
      }
    );
  }

  deleteCourse() {
    this.coursesService.delete(this.courseId).subscribe(
      (data) => {
        this.toastr.success('You deleted course successfully', 'Success!');
        this.router.navigateByUrl('/courses');
      },
      (err) => {
        this.toastr.error(err.error.message, 'Error!');
      }
    );
  }

  rateCourse() {
    if (!this.isAlreadyRated) {
      this.course.rating.push({
        email: this.authService.getUserEmail(),
        rate: this.rateCourseNum,
      });
      this.coursesService.edit(this.courseId, this.course).subscribe(
        (data) => {
          this.toastr.success('You rated the course successfully', 'Success!');
          this.upgradeRatingAndLikes();
        },
        (err) => {
          this.toastr.error(err.error.message, 'Error!');
        }
      );
    } else {
      this.toastr.error('You already rated this course', 'Error!');
    }
  }

  likeOrDislike() {
    let currUserEmail = this.authService.getUserEmail();

    if (!this.isAlreadyLiked) {
      // Add like
      this.course.likes.push(currUserEmail);
      this.coursesService.edit(this.courseId, this.course).subscribe(
        (data) => {
          this.toastr.success('You liked the course successfully', 'Success!');
        },
        (err) => {
          this.toastr.error(err.error.message, 'Error!');
        }
      );
    } else {
      // Remove like
      let indexOfName = this.course.likes.indexOf(currUserEmail);
      this.course.likes.splice(indexOfName, 1);
      
      this.coursesService.edit(this.courseId, this.course).subscribe(
        (data) => {
          this.toastr.success('You disliked the course successfully', 'Success!');
        },
        (err) => {
          this.toastr.error(err.error.message, 'Error!');
        }
      );
    }
    this.upgradeRatingAndLikes();
  }

  upgradeRatingAndLikes(){
    let currUserEmail = this.authService.getUserEmail();
    this.averageRate = this.course.rating.length > 0 
      ? Number((this.course.rating.reduce((a, b) => a + b['rate'], 0) / this.course.rating.length ).toFixed(1)) 
      : 0;
    this.starsRating = Math.round((this.averageRate / 5) * 100);

    this.isAlreadyRated = this.course.rating.find((obj) => obj.email == currUserEmail) !== undefined;
    this.isAlreadyLiked = this.course.likes.includes(currUserEmail);
  }
}
