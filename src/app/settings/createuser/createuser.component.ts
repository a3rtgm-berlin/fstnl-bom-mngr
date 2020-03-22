import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest/rest.service';
import { User } from '../../userModel';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})
export class CreateuserComponent implements OnInit {
  userData: User = {
    mail: '',
    username: '',
    password: '',
    role: '',
  };

  constructor(public restService: RestService) { }

  ngOnInit() {
  }

  public updateUser(mail, username, password): void {
    this.userData.mail = mail;
    this.userData.username = username;
    this.userData.password = password;

    console.log(this.userData);
  }

  public updateUserRole(mail, username, password, event: any): void {
    const role = event.target.value;
    this.userData.role = role;

    console.log(this.userData);
  }

  submitUser() {
    if (this.userData) {
      for (const prop in this.userData) {
        if (!this.userData[prop] || this.userData[prop] === '') {
          alert(`please enter a valid ${prop}`);
          return;
        }
      }

      this.restService.createUser(this.userData);

    } else {
      alert(`please enter valid user information`);
    }
  }
}
