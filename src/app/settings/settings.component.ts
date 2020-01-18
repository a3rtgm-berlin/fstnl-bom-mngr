import { Component, OnInit } from '@angular/core';
import { CreateuserComponent} from './createuser/createuser.component';
import { UserListComponent } from './user-list/user-list.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
