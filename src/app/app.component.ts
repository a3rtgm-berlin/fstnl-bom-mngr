import { Component, OnInit } from '@angular/core';
import { MaterialList } from './materialListModel';
import { ModalService } from './services/modal/modal.service';
import $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'BOM Supply Manager';
  modalService: ModalService;

  constructor(modalService: ModalService) {
    this.modalService = modalService;
  }

  ngOnInit(): void {
  }

  removeModal() {
    this.modalService.destroy();
  }
}
