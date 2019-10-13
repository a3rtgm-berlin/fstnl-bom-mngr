import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest/rest.service';
import { User } from 'src/app/userModel';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})
export class CreateuserComponent implements OnInit {

  private userData: User;
  restService: RestService;

  constructor() { }

  ngOnInit() {
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
      alert(`please enter project information`);
    }
  }
}
