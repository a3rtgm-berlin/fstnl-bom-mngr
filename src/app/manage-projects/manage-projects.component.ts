import { Component, OnInit, Input } from '@angular/core';
import { CreateProjectComponent } from './create-project/create-project.component';
//import { ProjectListViewComponent } from './create-project/project-list-view.component';
import { ModalService } from '../services/modal/modal.service';
import { RestService } from '../services/rest/rest.service';
import { Project } from '../projectModel';

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.scss']
})
export class ManageProjectsComponent implements OnInit {

  allProjects: Project[];

  supers;

  constructor(public modalService: ModalService, public restService: RestService) {
    this.restService.allProjects.subscribe((res) => {
      this.allProjects = res;
    })
  }

  ngOnInit() {
    this.restService.getAllProjects();

    this.supers = [1,2,3];
  }

  openCreateDialog() {
    this.modalService.init(CreateProjectComponent, {title: 'Create new Project'}, {});
  }

}
