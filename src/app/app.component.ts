import { Component } from '@angular/core';
import { MaterialList } from './materialListModel';
import { ModalService } from './services/modal/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BOM Supply Manager';
  modalService: ModalService;

  constructor(modalService: ModalService) {
    this.modalService = modalService;
  }

  removeModal() {
    this.modalService.destroy();
  }
}
