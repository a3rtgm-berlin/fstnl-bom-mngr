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

  private upToDate = true;
  private listsToCombine: string[] = [];
  private masterId: string;

  constructor(public modalService: ModalService, public restService: RestService) {
    this.restService.allProjects.subscribe((res) => {
      this.allProjects = res;
      this.updateBrb();
    });

    this.restService.masterId.subscribe((res) => {
      this.masterId = res ? res : '00-0000';
      this.updateBrb();
    });
  }

  ngOnInit() {
    const dateToday = new Date();

    this.restService.getAllProjects();
    this.restService.getLatestMasterId();

    this.todayMonth = Month[this.date.getMonth()] + ' ' + this.date.getFullYear();
    console.log(this.todayMonth);
  }

  ngAfterViewInit(): void {
  }

  openCreateDialog() {
    this.modalService.init(CreateProjectComponent, {title: 'Create new Project'}, {});
  }

  updateBrb() {
    const listsToCombine = [];
    let latestId = this.masterId;

    if (this.allProjects) {
      this.allProjects.forEach((project) => {
        if (project.bomLists.length > 0) {
          const thisId = project.bomLists[project.bomLists.length - 1];
          const thisId$ = thisId.substring(thisId.indexOf('-') + 1);

          if (thisId$ > this.masterId) {
            latestId = thisId$;
            listsToCombine.push(thisId);
          }
        }
      });

      if (listsToCombine.length >= this.allProjects.length) {
        this.upToDate = false;
      }
    }
  }

}
