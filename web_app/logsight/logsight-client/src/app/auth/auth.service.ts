import { Injectable } from '@angular/core';
import { ApiService } from '../@core/service/api.service';
import { Register } from '../@core/common/register';

@Injectable()
export class AuthService {
  constructor(private apiService: ApiService) {
  }

  register(registerForm: Register): any {
    return this.apiService.post('/api/auth/register', registerForm);
  }

  login(login: { email: string, password: string }): any {
    return this.apiService.post('/api/auth/login', login);
  }

}
