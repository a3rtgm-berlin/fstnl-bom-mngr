import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { RestService } from '../../services/rest/rest.service';
import { Project } from '../../projectModel';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
  host: {'class': 'modalparts'}
})
export class CreateProjectComponent implements OnInit {

  public projectData: Project;
  dateToday: Date = new Date();
  findFormat: any;

  constructor(public modalService: ModalService, public restService: RestService, public router: Router) { }

  ngOnInit() {
    this.findFormat = this.dateToday.toISOString().substr(0, 10);
  }

  public update(name, tag, description, trainsCount, deadline): void {
    this.projectData = {
      name,
      tag,
      description,
      trainsCount,
      deadline,
      bomLists: [],
      active: true,
      createdBy: 'dev',
      state: 'empty',
      created:this.dateToday,
      multiBom: 1,
      isArchived: true,
    };
  }

  public submit() {
    if (this.projectData) {
      for (const prop in this.projectData) {
        if (!this.projectData[prop] || this.projectData[prop] === '') {
            alert(`please enter a valid ${prop}`);
            return;
        }
      }

      this.projectData.multiBom = 0;
      this.projectData.isArchived = false;
      this.restService.createProject(this.projectData);
      
      this.close();
    } else {
      alert(`please enter project information`);
    }
  }

  public close() {
    this.modalService.destroy();
  }

}
