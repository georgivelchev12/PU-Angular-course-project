import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// import { LoginModel } from "./models/login.model";

// const appSecret = `da1610108229464ea57a6d73b5f490d7`;
const appKey = `kid_rkZRQN7tU`;
const baseUrl = `https://baas.kinvey.com/user/${appKey}`;

@Injectable()
export class AuthService {
  // private currentAuthToken: string;
  constructor(private http: HttpClient) {}

  login(model) {
    return this.http.post(`${baseUrl}/login`, JSON.stringify(model));
  }

  register(model) {
    return this.http.post(baseUrl, JSON.stringify(model));
  }
  logout() {
    return this.http.post(`${baseUrl}/_logout`, {});
  }

  myProfile(id) {
    return this.http.get(`${baseUrl}/${id}`, {});
  }

  assignRole(userID) {
    const roleUrl = `${baseUrl}/${userID}/roles/a9e711ad-d0ef-466f-b700-3495cd188ddf`;
    return this.http.put(roleUrl, {});
  }

  getUsers(){
    return this.http.get(baseUrl);
  }

  changeNames(userID, model) {
    return this.http.put(`${baseUrl}/${userID}`, JSON.stringify(model));
  }

  deleteOrBlockUser(userID, softOrHard) {
    return this.http.delete(`${baseUrl}/${userID}/${softOrHard}`);
  }

  restoreProfile(userID){
    return this.http.post(`${baseUrl}/${userID}/_restore`, {});
  }

  checkIfLogged() {
    // return this.currentAuthToken === localStorage.getItem("authtoken");
    return localStorage.getItem("authtoken") !== null;
  }
  checkIfSubscriber() {
    return localStorage.getItem("isSubscriber") == "undefined"; // if its not subscriber
  }

  // get authtoken() {
  //   return this.currentAuthToken;
  // }

  // set authtoken(value: string) {
  //   this.currentAuthToken = value;
  // }

  // private createAuthHeader(type: string) {
  //   if (type === "Basic") {
  //     return new HttpHeaders({
  //       Authorization: `Basic ${btoa(`${appKey}:${appSecret}`)}`,
  //       "Content-Type": "application/json",
  //     });
  //   } else {
  //     return new HttpHeaders({
  //       Authorization: `Kinvey ${localStorage.getItem("authtoken")}`,
  //       "Content-Type": "application/json",
  //     });
  //   }
  // }
}
