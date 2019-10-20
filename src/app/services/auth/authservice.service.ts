import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

const url = 'http://localhost:8000/api/';

@Injectable({
  providedIn: 'root'
})

export class AuthserviceService {
  authToken: any;
  user: any;

  loggedIn: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  
  setLoginState(val) {
    if (val) {
      this.loggedIn.next(val);
    } else {
      this.loggedIn.next(null);
    }
  }

  constructor(private http: HttpClient) {

   }

  public async isAuthenticated() {
    const logToken = localStorage.getItem('id_token');
    const req = this.http.post(url + 'token/verify', {token: logToken ? logToken : null});
    const verified = req.toPromise();

    console.log(await verified);
    
    return await verified;
  }

  public authenticateUser(user) {
    const observable = this.http.post(url + 'users/authenticate', user);
    observable.subscribe(
      (userData) => {
        this.storeUserData(userData);
        this.setLoginState(true);
      },
      err => {console.error('Userdata is incorrect', user, err)},
      () => console.log(user)
    );
  }

  public storeUserData(userData) {
    localStorage.setItem('id_token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    this.authToken = userData.token;
    this.user = userData.username;
    console.log(userData, localStorage);
  }

  logoutUser() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
    this.setLoginState(false);
  }
}
