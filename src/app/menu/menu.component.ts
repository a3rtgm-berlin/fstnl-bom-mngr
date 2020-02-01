import { Component, OnInit, Input } from '@angular/core';
import $ from 'jquery';
import { RestService } from '../services/rest/rest.service';
import { ModalService } from '../services/modal/modal.service';
import { MatrixFilesComponent } from '../matrix-files/matrix-files.component';
import { AuthserviceService } from '../services/auth/authservice.service';
import { AuthGuardService } from '../services/auth-guard/auth-guard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(
    public restService: RestService,
    public modalService: ModalService,
    public authService: AuthserviceService,
    private authGuard: AuthGuardService,
    private router: Router
  ) {}

  public logged: string;
  public switch: string;
  public activeUser: string;

  ngOnInit() {
    this.authService.loggedIn.subscribe((val) => {
      this.logged = val;
      this.updateLog(this.logged);
      this.activeUser = this.authService.user.username || null;
    });
  }

  uploadMatrixDialog() {
    if (!this.authGuard.canActivate()) {
      return this.router.navigate(['app/login']);
    }
    this.modalService.init(MatrixFilesComponent, {}, {});
  }

  onClick() {
  }

  updateLog(val) {
    if (val) {
      this.switch = 'Log Out';
    } else {
      this.switch = 'Log In';
    }
  }

  logOut() {
    this.authService.logoutUser();
    this.router.navigate(['app/login']);
  }

}
