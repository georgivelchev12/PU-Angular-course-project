import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoursesService } from 'src/app/core/services/courses.service';
import { CourseModel } from '../course.model';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  @Input() course: CourseModel;
  @Output() courses = new EventEmitter<Array<CourseModel>>();

  starsWidth: number;
  courseRating: number;
  starsRating: number;
  isAlreadyLiked: boolean;
  averageRate: number;

  constructor(
    public coursesService: CoursesService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.upgradeRatingAndLikes()
  }

  // Helper function to listAll posts after delete or update course
  listAll() {
    this.coursesService.listAll().subscribe(
      (data) => {
        this.courses.emit(data);
      },
      (err) => {
        this.toastr.error(err.error.description, 'Error!');
      }
    );
  }

  deleteCourse() {
    this.coursesService.delete(this.course.id).subscribe(
      (data) => {
        this.toastr.success('You deleted course successfully', 'Success!');
        this.listAll();
      },
      (err) => {
        this.toastr.error(err.error.description, 'Error!');
      }
    );
  }

  likeOrDislike() {
    let currUserEmail = this.authService.getUserEmail();
    if (!this.isAlreadyLiked) {
      // Add like
      this.course.likes.push(currUserEmail);
      this.coursesService.edit(this.course.id, this.course).subscribe(
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
      
      this.coursesService.edit(this.course.id, this.course).subscribe(
        (data) => {
          this.toastr.success(
            'You disliked the course successfully',
            'Success!'
          );
        },
        (err) => {
          this.toastr.error(err.error.message, 'Error!');
        }
      );
    }
    this.upgradeRatingAndLikes()
  }

  upgradeRatingAndLikes(){
    this.averageRate = this.course.rating.length > 0 
      ? Number((this.course.rating.reduce((a, b) => a + b['rate'], 0) / this.course.rating.length ).toFixed(1)) 
      : 0;
    this.starsRating = Math.round((this.averageRate / 5) * 100);
    this.isAlreadyLiked = this.course.likes.includes(this.authService.getUserEmail());
  }
}
