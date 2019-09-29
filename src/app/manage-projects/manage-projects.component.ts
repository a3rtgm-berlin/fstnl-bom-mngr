import { Component, OnInit, Input, ViewChild, Directive, AfterViewInit } from '@angular/core';
import { CreateProjectComponent } from './create-project/create-project.component';
//import { ProjectListViewComponent } from './create-project/project-list-view.component';
import { ModalService } from '../services/modal/modal.service';
import { RestService } from '../services/rest/rest.service';
import { Project } from '../projectModel';
import { Month } from '../dateModel';


@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.scss']
})
export class ManageProjectsComponent implements OnInit, AfterViewInit {

  @ViewChild('brb', {static: false}) popup: any;

  allProjects: Project[];
  date: Date = new Date();
  todayMonth: any;

  private upToDate = false;
  private currentMonth: string;

  constructor(public modalService: ModalService, public restService: RestService) {
    this.restService.allProjects.subscribe((res) => {
      this.allProjects = res;
      this.updateBrb();
    });
  }

  ngOnInit() {
    const dateToday = new Date();

    this.restService.getAllProjects();
    this.currentMonth = dateToday.getFullYear() + '-' + (dateToday.getMonth() + 1);

    this.todayMonth = Month[this.date.getMonth()] + ' ' + this.date.getFullYear();
    console.log(this.todayMonth);
  }

  ngAfterViewInit(): void {
  }

  openCreateDialog() {
    this.modalService.init(CreateProjectComponent, {title: 'Create new Project'}, {});
  }

  updateBrb() {
    let listCount = 0;

    if (this.allProjects) {
      this.allProjects.forEach((project) => {
        if (project.bomLists.length > 0) {
          const latestBom = project.bomLists[project.bomLists.length - 1];
          console.log(latestBom.slice(latestBom.indexOf('-') + 1), this.currentMonth);
        }
      });
    }
  }

}
