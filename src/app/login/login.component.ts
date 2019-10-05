import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private Auth: AuthService) { }

  ngOnInit() {
  }

  loginUser(event) {
    event.preventDefault();
    const target = event.target;
    const username = target.querySelector("#user").value;
    const password = target.querySelector("pass").value;

    //this.Auth.getUserDetails(username, password);

  }

}
