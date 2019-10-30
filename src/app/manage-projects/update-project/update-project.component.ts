import { Component, Input,  OnInit, OnChanges } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { RestService } from '../../services/rest/rest.service';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {

  public project$: any;
  public projectData: any;
  public findFormat: any;
  dateToday: Date = new Date();

  @Input() set project(project: any) {
    this.project$ = project;
  }


  constructor(public modalService: ModalService, public restService: RestService) { }

  ngOnInit() {
    this.findFormat = this.dateToday.toISOString().substr(0, 10);
  }

  public update(name, trainsCount, deadline): void {
    this.projectData = {
      name,
      trainsCount,
      deadline,
    };
  }

  public close() {
    this.modalService.destroy();
  }

  updateProjectValues() {
    if (this.projectData) {
      for (const prop in this.projectData) {
        if (!this.projectData[prop] || this.projectData[prop] === '' || this.projectData[prop] == 0 ) {
          this.projectData[prop] = this.project$[prop];
        } else {}
          this.project$[prop] = this.projectData[prop];
        }
      //console.log(this.project$);
      this.restService.updateProjectVal(this.project$);
      this.close();
    } else {
      alert("No data entered. Press Cancel if you want to abandon your changes.")
      //console.log(this.project$);
    }
  }
}
