import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { AuthserviceService} from '../services/auth/authservice.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private authService: AuthserviceService, public router: Router) { }

  ngOnInit() {
    this.authService.loggedIn.subscribe(res => {
      if (res) {
        this.router.navigate(['app/projects']);
      }
    });
  }

  async loginUser() {
    const user = {
      username: this.username,
      password: this.password,
    };

    this.authService.authenticateUser(user);
  }

  logOut() {
    this.authService.logoutUser();
  }

}
