import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const appKey = `kid_rkZRQN7tU`;
const baseUrl = `https://baas.kinvey.com/appdata/${appKey}/`;

@Injectable()
export class CoursesService {
  constructor(private http: HttpClient) {}

  createCourse(model) {
    return this.http.post(`${baseUrl}courses`, JSON.stringify(model));
  }

  listAll() {
    return this.http.get(`${baseUrl}courses`);
  }

  delete(id) {
    return this.http.delete(`${baseUrl}courses/${id}`, {}).pipe((err) => err);
  }

  edit(id, body) {
    return this.http.put(`${baseUrl}courses/${id}`, body).pipe((err) => err);
  }

  get(id) {
    return this.http.get(`${baseUrl}courses/${id}`);
  }
}
