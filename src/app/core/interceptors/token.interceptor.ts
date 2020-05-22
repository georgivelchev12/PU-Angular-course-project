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
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

const appKey = `kid_rkZRQN7tU`;
const appSecret = `da1610108229464ea57a6d73b5f490d7`;

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.endsWith("login") || request.url.endsWith(appKey)) {
      console.log(' here in first if');
      
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${btoa(`${appKey}:${appSecret}`)}`,
          "Content-Type": "application/json",
        },
      });
    } else {
      request = request.clone({  
        setHeaders: {
          Authorization: `Kinvey ${localStorage.getItem("authtoken")}`,
          "Content-Type": "application/json",
        },
      });
    }
   
    if(this.router.url == '/users-profiles'){
      request = request.clone({  
        setHeaders: {
          Authorization: `Kinvey ${localStorage.getItem("authtoken")}`,
          "Content-Type": "application/json",
        },
      });
    }
    if (request.url.includes("a9e711ad-d0ef-466f-b700-3495cd188ddf") || request.url.endsWith('_restore')) {
      //Master credentials
      request = request.clone({
        setHeaders: {
          Authorization: `Basic a2lkX3JrWlJRTjd0VTpkODY5NWI4ZmJhYWE0N2E5YWQxNGU4Mzc3MWJmYmU3Mg==`,
          "Content-Type": "application/json",
          'X-Kinvey-API-Version': '3'
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
    localStorage.setItem('id', data['_id'])
    this.router.navigateByUrl("/home");
  }
}
