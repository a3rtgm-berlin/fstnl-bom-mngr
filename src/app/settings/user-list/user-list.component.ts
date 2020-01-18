import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest/rest.service';
import { ModalService } from '../../services/modal/modal.service';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { User } from 'src/app/userModel';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  constructor(public restService: RestService, public modalService: ModalService) { }

  allusers: any[] = [];

  ngOnInit() {

    this.restService.getAllUsers();
    this.restService.allUsers.subscribe((val) => {
      if (val) {
        this.allusers = val;
        console.log(this.allusers);
      }
    });
  }

  deleteUser(username) {
    this.modalService.init(DeleteUserComponent, {userName: username}, {});
  }

}
