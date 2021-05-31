import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CoursesService } from 'src/app/core/services/courses.service';
import { CourseModel } from '../course.model';
import { mimeType } from '../create-course/myme-type.validator';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
})
export class EditCourseComponent implements OnInit {
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    author: new FormControl('', [
      Validators.required,
      Validators.pattern(/[A-Z][a-z]+ [A-Z][a-z]+/),
    ]),
    description: new FormControl('', [Validators.required]),
    categories: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\w+(?:,? \w+)*$/),
    ]),
    image: new FormControl(null, {
      validators: [Validators.required],
      asyncValidators: [mimeType],
    }),
  });

  imagePreview: string;
  courseId: string;
  currentCourse: CourseModel;

  constructor(
    public coursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params.id;
    this.coursesService.get(this.courseId).subscribe(
      (data) => {
        // data[0] database returns array of one element (wanted element)
        this.currentCourse = data[0];
        this.currentCourse.categories = data[0]['categories'].join(', ');
        this.imagePreview = this.currentCourse.imgFile;
        this.form.controls.image.setValue(this.currentCourse.imgFile);
      },
      (err) => {
        this.toastr.error(err.error.message, 'Error!');
      }
    );
  }

  edit() {
    if (this.form.valid) {
      const updatedCourse = {
        // Copy course and update only needed information
        ...this.currentCourse,
        categories: this.currentCourse.categories.toString().split(', '),
        imgFile: this.form.value.image ? this.form.value.image : this.currentCourse.imgFile,
      };

      this.coursesService.edit(this.courseId, updatedCourse).subscribe(
        (data) => {
          this.toastr.success(
            'You updated the course successfully',
            'Success!'
          );
          this.router.navigateByUrl(`courses/details/${this.courseId}`);
        },
        (err) => {
          this.toastr.error(err.error.message, 'Error!');
        }
      );
    } else {
      this.toastr.error('Please check input fields!', 'Error!');
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
