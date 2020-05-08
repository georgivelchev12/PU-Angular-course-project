import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { LoginModel } from "./models/login.model";

const appKey = `kid_rkZRQN7tU`;
const appSecret = `da1610108229464ea57a6d73b5f490d7`;
const registerUrl = `https://baas.kinvey.com/user/${appKey}`;
const loginUrl = `https://baas.kinvey.com/user/${appKey}/login`;
const logoutUrl = `https://baas.kinvey.com/user/${appKey}/_logout`;

@Injectable()
export class AuthService {
  private currentAuthToken: string;
  constructor(private http: HttpClient) {}

  login(model) {
    //: LoginModel
    return this.http.post(loginUrl, JSON.stringify(model));
  }

  register(model) {
    //: LoginModel
    return this.http.post(registerUrl, JSON.stringify(model));
  }

  logout() {
    return this.http.post(logoutUrl, {});
  }
  assignRole(userID) {
    const roleUrl = `https://baas.kinvey.com/user/${appKey}/${userID}/roles/a9e711ad-d0ef-466f-b700-3495cd188ddf`;
    return this.http.put(roleUrl, {});
  }

  checkIfLogged() {
    // return this.currentAuthToken === localStorage.getItem("authtoken");
    return localStorage.getItem("authtoken") !== null;
  }
  checkIfSubscriber() {
    return localStorage.getItem("isSubscriber") == 'undefined'; // if its not subscriber
  }

  get authtoken() {
    return this.currentAuthToken;
  }
  set authtoken(value: string) {
    this.currentAuthToken = value;
  }

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
