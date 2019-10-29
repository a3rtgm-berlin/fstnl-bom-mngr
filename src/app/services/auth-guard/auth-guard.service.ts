import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import { AuthserviceService } from '../auth/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    public auth: AuthserviceService,
    public router: Router
  ) {}

  async canActivate() {
    if (!await this.auth.isAuthenticated()) {
      return false;
    }
    return true;
  }
}
