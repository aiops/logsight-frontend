import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {NotificationsService} from "angular2-notifications";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private httpClient: HttpClient, private notificationsService: NotificationsService) {
    }

    get<T>(path: string, options?: any): Observable<any> {
        return this.httpClient.get<T>(path, options)
            .pipe(
                catchError(this.handleError)
            );
    }

    post<T>(path: string, body: any, options?: any): Observable<any> {
        return this.httpClient.post<T>(path, body, options)
            .pipe(
                catchError(this.handleError)
            );
    }

    put<T>(path: string, body: any, options?: any): Observable<any> {
        return this.httpClient.put<T>(path, body, options)
            .pipe(
                catchError(this.handleError)
            );
    }

    delete<T>(path: string, options?: any): Observable<any> {
        return this.httpClient.delete<T>(path, options)
            .pipe(
                catchError(this.handleError)
            );
    }

    getBlob(path: string, params?: HttpParams): Observable<HttpResponse<Blob>> {
        return this.httpClient.get(path, { responseType: 'blob', observe: 'response', params: params })
            .pipe(
                catchError(this.handleError)
            );
    }

    postBlob(path: string, body: any, params?: HttpParams): Observable<HttpResponse<Blob>> {
        return this.httpClient.post(path, body, { responseType: 'blob', observe: 'response', params: params })
            .pipe(
                catchError(this.handleError)
            );
    }


    postForm(url: string, body: { [key: string]: any }): Observable<any> {
        const params: URLSearchParams = new URLSearchParams();
        for (const param of Object.keys(body)) {
            params.append(param, body[param]);
        }

        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded');

        return this.httpClient.post<any>(url, params.toString(), { headers: headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    getClient(): HttpClient {
        return this.httpClient;
    }

    handleErrors(error: any){
      if(error.errors != null){
          this.notificationsService.error(error.error, error.errors[0].defaultMessage, {
      timeOut: 15000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    })
        }else{
          this.notificationsService.error(error.error, error.message, {
      timeOut: 15000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    })
        }
    }

    handleNotification(msg: any){
    this.notificationsService.error("", msg, {
      timeOut: 15000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    })

    }

    getNotificationOpetions(){
      return {
      timeOut: 10000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    }
    }

    private handleError<T>(error: any) {
        return throwError(error.error);
    }
}
