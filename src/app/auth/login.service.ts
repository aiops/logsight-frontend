import {Injectable} from '@angular/core';
import {ApiService} from '../@core/service/api.service';
import {UserRegisterForm} from '../@core/common/auth/userRegisterForm';
import {ResendActivationForm} from '../@core/common/auth/resendActivationForm';
import {ResetPasswordForm} from '../@core/common/auth/resetPasswordForm'
import {UserActivateForm} from '../@core/common/auth/userActivateForm';
import {LogsightUser} from '../@core/common/logsight-user';
import {Observable} from 'rxjs';
import {UserLoginForm} from "../@core/common/auth/userLoginForm";
import {ChangePasswordForm} from "../@core/common/auth/changePasswordForm";

@Injectable()
export class LoginService {
  constructor(private apiService: ApiService) {
  }

  register(registerForm: UserRegisterForm): any {
    return this.apiService.post('/api/v1/users/register', registerForm);
  }

  login(loginForm: UserLoginForm): any {
    return this.apiService.post('/api/v1/auth/login', loginForm);
  }

  resetPassword(resetPasswordForm: ResetPasswordForm): any {
    return this.apiService.post('/api/v1/users/reset_password', resetPasswordForm);
  }

  changePassword(changePasswordForm: ChangePasswordForm): any {
    return this.apiService.post('/api/v1/users/change_password', changePasswordForm);
  }

  resendActivation(resendActivationForm: ResendActivationForm): any {
    return this.apiService.post('/api/v1/users/resend_activation', resendActivationForm);
  }

  onForgotPassword(email: string): any {
    return this.apiService.post('/api/v1/users/forgot_password', {"email": email});
  }


  activate(activateForm: UserActivateForm): any {
    return this.apiService.post('/api/v1/users/activate', activateForm)
  }

  getUser(): Observable<LogsightUser> {
    return this.apiService.get(`/api/v1/users/user`);
  }
}
