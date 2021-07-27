import { Injectable } from '@angular/core';
import { ApiService } from '../@core/service/api.service';
import { Observable, of, throwError } from 'rxjs';
import { LogsightUser } from '../@core/common/logsight-user';
import { catchError, map, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private userChecked = false;
  private loggedUser: LogsightUser | null;

  constructor(private apiService: ApiService) {
    this.getLoggedUser();
  }

  getLoggedUser(): Observable<LogsightUser | null> {
    const token = localStorage.getItem('token');
    if (token) {
      if (!this.userChecked) {
        return this.apiService.get(`/api/users`).pipe(
          map(user => {
            this.userChecked = true;
            this.loggedUser = user
            return user;
          }),
          catchError((error: any) => {
            this.userChecked = true;
            this.loggedUser = null
            return throwError(error);
          }),
          share()
        );
      } else {
        return of(this.loggedUser)
      }
    } else {
      return of(null)
    }
  }

  isUserLoggedIn() {
    return this.getLoggedUser()
      .pipe(
        map(user => !!user),
        catchError(error => {
          console.log('error', error);
          localStorage.removeItem('token')
          return of(false);
        })
      );
  }
}
