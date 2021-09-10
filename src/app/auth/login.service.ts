import { Injectable } from '@angular/core';
import { ApiService } from '../@core/service/api.service';
import { UserRegisterForm } from '../@core/common/auth/userRegisterForm';
import { UserActivateForm } from '../@core/common/auth/userActivateForm';
import { LogsightUser } from '../@core/common/logsight-user';
import { Observable } from 'rxjs';
import {UserLoginForm} from "../@core/common/auth/userLoginForm";
import {UserLoginFormId} from "../@core/common/auth/userLoginFormId";

@Injectable()
export class LoginService {
  constructor(private apiService: ApiService) {
  }

  register(registerForm: UserRegisterForm): any {
    return this.apiService.post('/api/auth/register', registerForm);
  }

  login(loginForm: UserLoginForm): any {
    return this.apiService.post('/api/auth/login', loginForm);
  }

  loginId(loginForm: UserLoginFormId): any {
    return this.apiService.post('/api/auth/login_id', loginForm);
  }

  requestLoginLink(email: string): any {
    return this.apiService.post('/api/auth/login/login-link', email);
  }

  activate(activateForm: UserActivateForm ): any {
    return this.apiService.put('/api/auth/activate', activateForm)
  }

  getUser(): Observable<LogsightUser> {
    return this.apiService.get(`/api/users`);
  }
}
