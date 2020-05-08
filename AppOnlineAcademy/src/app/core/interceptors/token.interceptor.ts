import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth-service";
import { Router } from "@angular/router";

const appKey = `kid_rkZRQN7tU`;
const appSecret = `da1610108229464ea57a6d73b5f490d7`;

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.endsWith("login") || request.url.endsWith(appKey)) {
      console.log('in basic auth ');

      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${btoa(`${appKey}:${appSecret}`)}`,
          "Content-Type": "application/json",
        },
      });
    } else {
      console.log('in kinvey auth ');
      
      request = request.clone({  
        setHeaders: {
          Authorization: `Kinvey ${localStorage.getItem("authtoken")}`,
          "Content-Type": "application/json",
        },
      });
    }
    if (request.url.includes("a9e711ad-d0ef-466f-b700-3495cd188ddf")) {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic a2lkX3JrWlJRTjd0VTpkODY5NWI4ZmJhYWE0N2E5YWQxNGU4Mzc3MWJmYmU3Mg==`,
          "Content-Type": "application/json",
        },
      });
    }
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && request.url.endsWith("login")) {
            this.successfullLogin(event.body);
          }
        },
        (err: HttpErrorResponse) => {
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 401:
                this.router.navigate(["/login"]);
                break;
              case 404:
                this.router.navigate(["/not-found"]);
                break;
              case 500:
                this.router.navigate(["/server-error"]);
                break;

              default:
                break;
            }
          }
        }
      )
    )
  }
  successfullLogin(data) {
    //   this.authService.authtoken = data["_kmd"]["authtoken"];
    localStorage.setItem("authtoken", data["_kmd"]["authtoken"]);
    localStorage.setItem("email", data["username"]);
    localStorage.setItem("name", `${data["firstName"]} ${data["lastName"]}`);
    localStorage.setItem("isSubscriber", data["_kmd"]["roles"]);

    this.router.navigateByUrl("/home");
  }
}
