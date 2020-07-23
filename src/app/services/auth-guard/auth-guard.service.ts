import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import { AuthserviceService } from '../auth/authservice.service';
import { RestService } from '../rest/rest.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {

  constructor(
    public auth: AuthserviceService,
    public router: Router,
    public rest: RestService
  ) {}

  async canActivate() {
    if (!await this.auth.isAuthenticated()) {
      this.router.navigate(['/app/login']);
      return false;
    }

    /*if(this.auth.user.role == "3") {
      this.router.navigate(['/app/master/view/2019-11']);
      return true;
    }*/

    return true;
  }
}
