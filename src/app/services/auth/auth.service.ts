import { Injectable } from '@angular/core';
import { RestService } from "../rest/rest.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private Rest: RestService) { }

  getUserDetails() {
    //post to api server
    //return user information
  }
}
