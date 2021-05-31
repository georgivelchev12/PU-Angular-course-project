import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { LoginModel } from 'src/app/components/authentication/models/login.model';
import { RegisterModel } from 'src/app/components/authentication/models/register.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/user" 


@Injectable({ providedIn: 'root' })
export class AuthService {
  token: string;
  isAuthenticated: boolean;
  tokenTimer: NodeJS.Timer;
  userPermissions: string;
  userEmail: string;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  register(user: RegisterModel) {
    return this.http.post(
      `${BACKEND_URL}/signup`,
      user
    );
  }

  // Login / Logout functions
  getUserPermissions() {
    return this.userPermissions;
  }
  getUserEmail() {
    return this.userEmail;
  }
  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  login(user: LoginModel) {
    return this.http
      .post<{
        token: string;
        expiresIn: number;
        currentUserRole: string;
        userEmail: string;
      }>(`${BACKEND_URL}/login`, user)
      .subscribe(
        (data) => {
          if (data.token) {
            this.token = data.token;
            const expiresInDuration = data.expiresIn;
            this.userPermissions = data.currentUserRole;
            this.userEmail = data.userEmail;

            this.tokenTimer = setTimeout(() => {
              this.logout();
            }, expiresInDuration * 1000);

            this.isAuthenticated = true;

            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );

            this.saveAuthData(this.token, expirationDate, this.userPermissions, this.userEmail);
            this.toastr.success('You logged in successfully', 'Success!');
            this.router.navigate(['/']);
          }

          //you can set this object as value
          //, {
          //  disableTimeOut: true
          //}
          // if (data["_kmd"]["roles"] !== undefined) {
          //   console.log("trueee");
          // } else {
          //   console.log("falseeee");
          // }
        },
        (err) => {
          this.toastr.error(err.error.description, 'Error!');
        }
      );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/login']);
    this.toastr.success('You logout successfully!', 'Success!');
  }

  isUserLogged() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.userPermissions = authInfo.userPermissions;
      this.userEmail = authInfo.userEmail;
      this.isAuthenticated = true;
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, expiresIn);
    }
  }

  // localStorage functions
  private saveAuthData(
    token: string,
    expirationDate: Date,
    userPermissions: string,
    userEmail: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('permissions', userPermissions);
    localStorage.setItem('email', userEmail);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('permissions');
    localStorage.removeItem('email');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userPermissions = localStorage.getItem('permissions');
    const userEmail = localStorage.getItem('email')
    if (!token || !expirationDate || !userPermissions || !userEmail) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userPermissions,
      userEmail
    };
  }

  // Login / Logout functions / END

  myProfile(){
    return this.http.get<{ message: string; users: Array<Object> }>(`${BACKEND_URL}/my-profile`).pipe(map((userData) => this.mapId(userData)));
  }

  getUsers(){
    return this.http
    .get<{ message: string; users: Array<Object> }>(`${BACKEND_URL}/list`)
    .pipe(map((userData) => this.mapId(userData)));
  }

  disableUser(userId, body){
    return this.http.put<{ message: string }>(`${BACKEND_URL}/${userId}`, body).pipe((err) => err);
  }

  restoreUser(userId, body){
    return this.http.put<{ message: string }>(`${BACKEND_URL}/restore-user/${userId}`, body).pipe((err) => err);
  }

  deleteUser(userId){
    return this.http.delete<{ message: string }>(`${BACKEND_URL}/${userId}`).pipe((err) => err);
  }

  changeNames(model){
    // Send only form model, because we store current user id in our req as userId - see ./backend/middleware/check-auth.js
    return this.http.put<{ message: string }>(`${BACKEND_URL}/my-profile/change-names`, model);

  }

  mapId(userData) {
    
    return userData.users.map((user) => {
      return {
        // Spread operator to make copy of user key:value instead of typing it all
        ...user,
        // Modify _id to be id in our local object
        id: user['_id'],
      };
    });
  }

}
