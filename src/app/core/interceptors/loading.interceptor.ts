import { Injectable } from "@angular/core";
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { LoaderService } from "../services/loading-service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService, private router: Router) {}

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    // if (this.router.url.includes("details")) {
    //   this.loaderService.isLoadingFullSpinner.next(this.requests.length > 0);
    // } else {
    //   this.loaderService.isLoading.next(this.requests.length > 0);
    // }
    this.loaderService.isLoading.next(this.requests.length > 0);

  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requests.push(req);

    // if (this.router.url.includes("details")) {
    //   this.loaderService.isLoadingFullSpinner.next(true);
    // } else {
    //     this.loaderService.isLoading.next(true);
    // }
    this.loaderService.isLoading.next(true);

    return Observable.create((observer) => {
      const subscription = next.handle(req).subscribe(
        (event) => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req);
            observer.next(event);
          }
        },
        (err) => {
          this.removeRequest(req);
          observer.error(err);
        },
        () => {
          this.removeRequest(req);
          observer.complete();
        }
      );
      // teardown logic in case of cancelled requests
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
