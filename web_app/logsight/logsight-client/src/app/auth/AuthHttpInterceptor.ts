import { Injectable } from '@angular/core';
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs-compat/add/observable/fromPromise';
import { AuthenticationService } from './authentication.service';
import { of } from 'rxjs';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = this.auth.getAuthToken();
    if (!token) {
      return next.handle(req).do(this.handleResponse).catch(this.handleError);
    }

    if (req.headers.has('Authorization')) {
      return next.handle(req).do(this.handleResponse).catch(this.handleError);
    }

    const update = { headers: req.headers.set('Authorization', 'Bearer ' + token) };
    req = req.clone(update);
    return next.handle(req).do(this.handleResponse).catch(this.handleError);

  }

  handleResponse(event: HttpEvent<any>) {
    if (event instanceof HttpResponse) {
    }
  }

  private handleError(event: HttpErrorResponse) {
    const contentType = event.headers.get('content-type');
    if ((contentType === 'application/json' || contentType === null) && event.error.text === '') {
      return of(null);
    }

    return Observable.throw(event);
  }
}
