import { Injectable } from '@angular/core';
import { ApiService } from '../@core/service/api.service';
import { Register } from '../@core/common/register';
import { LogsightUser } from '../@core/common/logsight-user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoginService {
  constructor(private apiService: ApiService) {
  }

  register(registerForm: Register): any {
    return this.apiService.post('/api/auth/register', registerForm);
  }

  login(login: { email: string, password: string }): any {
    return this.apiService.post('/api/auth/login', login);
  }

  loginLink(login: { email: string, password: string }): any {
    return this.apiService.post('/api/auth/login/login-link', login);
  }

  userLoginLink(key: string): any {
    var userDetails = key.split("_")
    return this.apiService.post('/api/auth/activate/login-link', { "loginID": userDetails[0],
      "key":userDetails[1] });
  }

  getUser(): Observable<LogsightUser> {
    return this.apiService.get(`/api/users`);
  }

  activateUser(key: string) {
    return this.apiService.post(`/api/auth/activate`, { key });
  }
}
