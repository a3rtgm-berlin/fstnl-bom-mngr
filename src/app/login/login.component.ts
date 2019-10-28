import { Component, OnInit, Input } from '@angular/core';
import { AuthserviceService} from '../services/auth/authservice.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;

  constructor(private authService: AuthserviceService, public router: Router) { }

  ngOnInit() {
  }

  loginUser() {
    const user = {
      username: this.username,
      password: this.password,
    }
      this.authService.authenticateUser(user);

      if(this.authService.isAuthenticated) {
        this.router.navigate(['app/projects']);
      }
  }

  logOut() {
    this.authService.logoutUser();
  }

}
