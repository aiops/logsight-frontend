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

  registerDemo(registerForm: { email: string }): any {
    return this.apiService.post('/api/auth/register/demo', registerForm);
  }

  login(login: { email: string, password: string }): any {
    return this.apiService.post('/api/auth/login', login);
  }

  getUser(key: string): Observable<LogsightUser> {
    return this.apiService.get(`/api/users/${key}`);
  }

  activateUser(key: string) {
    return this.apiService.post(`/api/users/activate`, { key });
  }
}
