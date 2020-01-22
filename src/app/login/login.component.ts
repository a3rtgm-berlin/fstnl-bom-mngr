import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { AuthserviceService} from '../services/auth/authservice.service';
import { RestService } from '../services/rest/rest.service'
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
  masterId: string; 

  constructor(public authService: AuthserviceService, public restService: RestService, public router: Router) { }

  ngOnInit() {
    this.restService.getLatestMasterId();
    this.restService.masterId.subscribe(res => {
      if (res) {
        this.masterId = res;
      }
    });

    this.authService.loggedIn.subscribe(async res => {
      if (res) {
        console.log(this.authService.user.username);
          if (this.authService.user.role == "3") {
            this.router.navigate(['app/master/view/' + this.masterId]);
            return;
          }

        this.router.navigate(['app/projects']);
        
        return;
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
