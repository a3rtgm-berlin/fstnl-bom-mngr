import { Component, OnInit } from '@angular/core';
import { MaterialList } from './materialListModel';
import { ModalService } from './services/modal/modal.service';
<<<<<<< HEAD
declare var $: any;
=======
import $ from 'jquery';
>>>>>>> 979e70684cb89ff91095a74f080211bfee845e4d

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
