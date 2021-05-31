import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CourseModel } from '../course.model';
import { CoursesService } from 'src/app/core/services/courses.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './myme-type.validator';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
})
export class CreateCourseComponent implements OnInit {
  course: CourseModel;
  imagePreview: string;

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

  constructor(
    private coursesService: CoursesService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit() {}

  create() {
    this.course = {
      id: null,
      title: this.form.value.title,
      author: this.form.value.author,
      description: this.form.value.description,
      imgFile: this.form.value.image,
      date: new Date().toLocaleDateString().split(' ')[0],
      likes: [],
      rating: [],
      categories: this.form.value.categories.split(', '),
    };

    this.coursesService.createCourse(this.course).subscribe(
      (data) => {
        this.toastr.success('You created a course successfully', 'Success');
        this.router.navigateByUrl('/courses');
      },
      (err) => {
        this.toastr.error(err.error.description, 'Error!');
      }
    );
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
