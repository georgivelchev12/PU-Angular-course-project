import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const appKey = `kid_rkZRQN7tU`;
const appSecret = `da1610108229464ea57a6d73b5f490d7`;
const listCourses = `https://baas.kinvey.com/appdata/${appKey}/courses`;
const createCourse = `https://baas.kinvey.com/appdata/${appKey}/courses`;
const baseCrudUrl = `https://baas.kinvey.com/appdata/${appKey}/courses/`; // concat id

@Injectable()
export class CoursesService {
  constructor(private http: HttpClient) {}

  createCourse(model) {
    return this.http.post(createCourse, JSON.stringify(model));
  }
  listAll() {
    return this.http.get(listCourses);
  }
  delete(id) {
    return this.http.delete(baseCrudUrl + id, {}).pipe((err) => err);
  }
  edit(id, body) {
    return this.http.put(baseCrudUrl + id, body).pipe((err) => err);
  }
  get(id) {
    return this.http.get(baseCrudUrl + id);
  }
}
