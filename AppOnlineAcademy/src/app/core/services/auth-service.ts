import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { LoginModel } from "./models/login.model";

const appKey = ``;
const appSecret = ``;
const registerUrl = `https://baas.kinvey.com/user/${appKey}`;
const loginUrl = `https://baas.kinvey.com/user/${appKey}/login`;
const logoutUrl = `https://baas.kinvey.com/user/${appKey}/_logout`;

@Injectable()
export class AuthService {
  private currentAuthToken: string;
  constructor(private http: HttpClient) {}

  login(model) { //: LoginModel
    return this.http.post(loginUrl, JSON.stringify(model));
  }

  register(model) { //: LoginModel
    return this.http.post(registerUrl, JSON.stringify(model));
  }

  logout() {
    return this.http.post(
      logoutUrl,
      {}
    );
  }

  checkIfLogged() {
    // return this.currentAuthToken === localStorage.getItem("authtoken");
    return localStorage.getItem("authtoken") !== null;
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
