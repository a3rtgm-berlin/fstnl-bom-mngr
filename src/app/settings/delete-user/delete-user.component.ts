import { Component, OnInit, Input } from '@angular/core';
import { RestService } from '../../services/rest/rest.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  @Input() userName: string;

  constructor(public restService: RestService, public modalService: ModalService) { }

  ngOnInit() {
    console.log(this.userName);
  }

  submit() {
    console.log("I wanna delete all night this " + this.userName)
    this.restService.deleteUser(this.userName);
    this.modalService.destroy();
  }

  close() {
    this.modalService.destroy();
  }

}
