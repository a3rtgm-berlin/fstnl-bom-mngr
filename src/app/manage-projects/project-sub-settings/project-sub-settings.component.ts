import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { RestService } from '../../services/rest/rest.service';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';

@Component({
  selector: 'app-project-sub-settings',
  templateUrl: './project-sub-settings.component.html',
  styleUrls: ['./project-sub-settings.component.scss']
})
export class ProjectSubSettingsComponent implements OnInit, OnChanges {

  public project$: any;
  multiBom: any;

  @Input() set project(project: any) {
    this.project$ = project;
  }

  constructor(public modalService: ModalService, public restService: RestService) { }

  ngOnInit() {
    console.log(this.project$);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.project$ = changes.project.currentValue;
  }

  deleteProject() {
    this.modalService.init(DeleteProjectComponent, {projectTag: this.project$.tag}, {});
  }

  close() {
    this.modalService.destroy('.prjctsb');
  }

  toggleMultiBom() {
    if (this.project$.multiBom === 0) {
    this.project$.multiBom += 1;
    console.log("I was 0 and now I am 1");
    this.restService.updateProjectVal(this.project$);
    } else {
      this.project$.multiBom = 0;
      console.log("I was something and now I am 0");
      this.restService.updateProjectVal(this.project$);
    }
  }

  toggleActive(){
    this.project$.active = !this.project$.active;
    this.restService.updateProjectVal(this.project$);
  }

  giveMeInfo() {
    alert("Project: [" + this.project$.tag + "] - " + this.project$.name + "\ncreated: " + this.project$.created + "\ntrains: " + this.project$.trainsCount + "\ndeadline: " + this.project$.deadline);
    console.log(this.project$.multiBom);
    console.log(this.project$.isArchived);
    console.log(this.project$.active);
    console.log(this.project$.created);
    console.log(this.project$);
  }

  updateProject() {
    alert("Function not available yet!");
  }


}
