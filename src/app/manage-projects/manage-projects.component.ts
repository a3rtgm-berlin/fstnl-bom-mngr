import { Component, OnInit, Input } from '@angular/core';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ModalService } from '../services/modal/modal.service';

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.scss']
})
export class ManageProjectsComponent implements OnInit {

  constructor(public modalService: ModalService) { }

  ngOnInit() {
  }

  openCreateDialog() {
    this.modalService.init(CreateProjectComponent, {title: 'Create new Project'}, {});
  }

}
