import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { RestService } from '../services/rest/rest.service';
import { ModalService } from '../services/modal/modal.service';
import { MatrixFilesComponent } from '../matrix-files/matrix-files.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(public restService: RestService, public modalService: ModalService) {
  }

  ngOnInit() {

  }

  uploadMatrixDialog() {
    this.modalService.init(MatrixFilesComponent, {}, {});
  }

  onClick() {
  }

}
