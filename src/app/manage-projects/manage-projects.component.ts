import { Component, OnInit, Input, ViewChild, Directive, AfterViewInit } from '@angular/core';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ModalService } from '../services/modal/modal.service';
import { RestService } from '../services/rest/rest.service';
import { Month } from '../dateModel';
import { Router } from '@angular/router';


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

  public upToDate = true;
  public listsToCombine: string[] = [];
  public masterId: string;
  public latestId: string;
  public crossId: string;
  public state = '';
  public count: any;
  public crossIdCheck: string;
  public crossStateCheck: string;

  constructor(public modalService: ModalService, public restService: RestService, public router: Router) {
    this.restService.allProjects.subscribe((res) => {
      this.allProjects = [];
      this.allProjects = res;
      this.updateBrb();
      this.updateProjectCount();
    });

    this.restService.masterId.subscribe((res) => {
      this.masterId = res ? res[0] : null;
      this.updateBrb();
    });
  }

  ngOnInit() {
    const dateToday = new Date();
    this.restService.getAllProjects();
    this.restService.getLatestMasterId();

    this.todayMonth = Month[this.date.getMonth()] + ' ' + this.date.getFullYear();
  }

  ngAfterViewInit(): void {
  }

  openCreateDialog() {
    this.modalService.init(CreateProjectComponent, {title: 'Create new Project'}, {});
  }

  bigRedButton() {
    if (this.listsToCombine.length > 0) {
      alert(`Creating new Master File from Month ${this.latestId}`);
      this.restService.createMaster(this.latestId);
    }
  }

  updateProjectCount() {
    this.count = 0;
    if (this.allProjects) {
      this.allProjects.forEach((el) => {
        if (el.active !== false) {
          this.count += 1;
        }
      });
    }
  }

  showBom() {
    this.router.navigate([`/app/master/view/${this.masterId}`]);
  }

  updateBrb() {
    this.listsToCombine = [];
    this.latestId = this.masterId;

    if (this.allProjects) {
      this.allProjects.forEach((project) => {
        if (project.boms.length > 0) {
          const thisId = project.boms[0];
          const thisId$ = thisId.substring(thisId.indexOf('-') + 1);

          if (thisId$.includes('-M')) {
            const thisId$$ = thisId$.substring(0, thisId$.lastIndexOf('-'));
            this.crossIdCheck = thisId$$;
          } else {
            this.crossIdCheck = thisId$;
          }

          if (this.crossIdCheck > this.masterId) {
            this.latestId = this.crossIdCheck;
            this.listsToCombine.push(thisId);
          }
        }
      });

      // console.log(this.upToDate, this.listsToCombine.length, this.allProjects.length);
      this.upToDate = this.listsToCombine.length >= this.allProjects.length ? false : true;
    }
    this.projectStates();
  }

  deleteMasterBom() {
    if (confirm(`Delete current Master ${this.latestId}?`)) {
      this.restService.deleteMaster(this.masterId);
    }
  }

  recalculateMasterBom() {
    if (confirm(`Recalculate current Master ${this.latestId}?`)) {
      this.restService.rebuildMaster(this.masterId);
    }
  }

  projectStates() {
    this.crossId = this.masterId;

    if (this.allProjects && this.masterId) {
      this.allProjects.forEach((project) => {
        if (project.boms.length > 0) {
          const thisId = project.boms[0];
          const thisId$ = thisId.substring(thisId.indexOf('-') + 1);

          if (thisId$.includes('-M')) {
            const thisId$$ = thisId$.substring(0, thisId$.lastIndexOf('-'));
            this.crossStateCheck = thisId$$;
          } else {
            this.crossStateCheck = thisId$;
          }

          const masterDate = new Date(this.crossId);
          const projectDate =  new Date(this.crossStateCheck);

          if (projectDate < masterDate) {
            project.state = ' deprecated';
          } else if (projectDate > masterDate) {
            project.state += ' ahead';

            this.allProjects.forEach(($project) => {
              $project.state += ' sub';
            });

          } else {
            project.state += ' sync';
          }

        } else {
          project.state += ' empty';
        }

      });
    }
  }

}
