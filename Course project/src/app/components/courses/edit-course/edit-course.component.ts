import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CoursesService } from 'src/app/core/services/courses.service';
import { CategoryModel } from '../category.model';
import { CourseModel } from '../course.model';
import { mimeType } from '../create-course/myme-type.validator';

export function customValidateArray(): ValidatorFn {
  return (formArray: FormArray): { [key: string]: any } | null => {
    let valid: boolean = formArray.controls.filter((c) => c.value).length > 0;
    return valid ? null : { error: 'Error!' };
  };
}

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
    categories: new FormArray([], [customValidateArray()]),
    image: new FormControl(null, {
      validators: [Validators.required],
      asyncValidators: [mimeType],
    }),
  });

  imagePreview: string;
  courseId: string;
  currentCourse: CourseModel;
  allCategories: Array<CategoryModel>;
  selectedCategories;
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
        this.imagePreview = this.currentCourse.imgFile;
        this.form.controls.image.setValue(this.currentCourse.imgFile);
        this.getAllCategories();
      },
      (err) => {
        this.toastr.error(err.error.message, 'Error!');
      }
    );
  }
  getAllCategories() {
    this.coursesService.getCategories().subscribe(({ categories }) => {
      this.allCategories = categories;
      this.allCategories.forEach((c) => {
        // Select form checkboxes which current course has. (Init form checkboxes)
        let containsCategory =
          this.currentCourse.categories.find(
            (catInCourse) => catInCourse._id == c._id
          ) || false;
        (this.form.get('categories') as FormArray).push(
          new FormControl(containsCategory)
        );
      });
      this.getSelectedCategories();
    });
  }

  getSelectedCategories() {
    this.selectedCategories = this.form.controls.categories['controls'].map(
      (el, i) => {
        return (
          el.value && {
            _id: this.allCategories[i]._id,
            title: this.allCategories[i].title,
          }
        );
      }
    );
    // Get selected categories NAMES
    this.selectedCategories = this.selectedCategories.filter(
      (name) => name !== false
    );
  }

  edit() {
    if (this.form.valid) {
      console.log(this.form);

      const updatedCourse = {
        // Copy course and update only needed information
        ...this.currentCourse,
        categories: this.selectedCategories,
        imgFile: this.form.value.image || this.currentCourse.imgFile,
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
