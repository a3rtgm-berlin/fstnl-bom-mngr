import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

//const url = 'http://localhost:8000/api/';
//const url = 'http://91.250.112.78:49160/api/';
//const url = 'https://api.creative-collective.de/api/';
const url = 'https://btbom.creative-collective.de/api/';

@Injectable({
  providedIn: 'root'
})

export class AuthserviceService {
  authToken: any;
  user: any = {};

  loggedIn: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  setLoginState(val) {
    if (val) {
      this.loggedIn.next(val);
    } else {
      this.loggedIn.next(null);
    }
  }

  constructor(private http: HttpClient) {
    if (localStorage.getItem('id_token') && localStorage.getItem('user')) {
      this.authToken = localStorage.getItem('id_token');
      this.user = JSON.parse(localStorage.getItem('user'));
      this.setLoginState(true);
    }
  }

  public async isAuthenticated() {
    const logToken = localStorage.getItem('id_token');
    const req = this.http.post(url + 'token/verify', {token: logToken ? logToken : null});
    const verified = req.toPromise();
    return await verified;
  }

  public authenticateUser(user) {
    const observable = this.http.post(url + 'users/authenticate', user);
    observable.subscribe(
      (userData) => {
        this.storeUserData(userData);
        this.setLoginState(true);
      },
      err => { console.error('Userdata is incorrect: ', err); }
    );
  }

  public storeUserData(userData) {
    localStorage.setItem('id_token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    this.authToken = userData.token;
    this.user = userData.user;
  }

  logoutUser() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
    this.setLoginState(false);
  }
}
