import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { CourseModel } from 'src/app/components/courses/course.model';
import { environment } from 'src/environments/environment';
import { CategoryModel } from 'src/app/components/courses/category.model';

const baseUrl = environment.apiUrl + '/courses'; 

@Injectable({ providedIn: 'root' })
export class CoursesService {
  constructor(private http: HttpClient) {}

  createCourse(body) {
    // We create FormData because we need to send a FILE to backend
    let postData = new FormData();
    postData.append('title', body.title);
    postData.append('author', body.author);
    postData.append('description', body.description);
    postData.append('date', body.date);
    postData.append('likes', JSON.stringify(body.likes));
    postData.append('rating', JSON.stringify(body.rating));
    postData.append('categories', JSON.stringify(body.categories));
    postData.append('image', body.imgFile, body.title);

    return this.http.post(`${baseUrl}`, postData);
  }

  listAll() {
    
    return this.http
      .get<{ message: string; courses: Array<CourseModel> }>(`${baseUrl}`)
      .pipe(map((postData) => this.mapId(postData)));
  }

  delete(id) {
    return this.http.delete(`${baseUrl}/${id}`).pipe((err) => err);
  }

  edit(id, body) {
    let postData;
    if (typeof body.imgFile === 'object') {
      // IF THERE IS A NEW UPLOADED IMAGE
      postData = new FormData();
      postData.append('id', body.id);
      postData.append('title', body.title);
      postData.append('author', body.author);
      postData.append('description', body.description);
      postData.append('date', body.date);
      postData.append('likes', JSON.stringify(body.likes));
      postData.append('rating', JSON.stringify(body.rating));
      postData.append('categories', JSON.stringify(body.categories));
      postData.append('image', body.imgFile, body.title);
    } else {
      // IF THERE ISN'T A NEW UPLOADED IMAGE
      postData = {
        id: body.id,
        title: body.title,
        author: body.author,
        description: body.description,
        date: body.date,
        likes: JSON.stringify(body.likes),
        rating: JSON.stringify(body.rating),
        categories: JSON.stringify(body.categories),
        imgFile: body.imgFile,
      };
    }
    return this.http.put(`${baseUrl}/${id}`, postData).pipe((err) => err);
  }

  get(id) {
    return this.http
      .get<{ message: string; courses: Array<CourseModel> }>(`${baseUrl}/${id}`)
      .pipe(map((postData) => this.mapId(postData)));
  }

  mapId(postData) {
    return postData.courses.map((course) => {
      return {
        // Spread operator to make copy of course key:value instead of typing it all
        ...course,
        // Modify _id to be id in our local object
        id: course['_id'],
      };
    });
  }

  getCategories(){
    return this.http.get<{ message: string; categories: [CategoryModel] }>(`${environment.apiUrl}/categories`)
  }
}
