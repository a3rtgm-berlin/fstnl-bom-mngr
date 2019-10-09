import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalService } from 'src/app/services/modal/modal.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';

@Component({
  selector: 'app-project-sub-settings',
  templateUrl: './project-sub-settings.component.html',
  styleUrls: ['./project-sub-settings.component.scss']
})
export class ProjectSubSettingsComponent implements OnInit, OnChanges {

  private project$: any;
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
    const val = this.project$.multiBom = !this.project$.multiBom;
    this.restService.updateProjectVal(this.project$);
  }

  toggleActive(){
    this.project$.active = !this.project$.active;
    this.restService.updateProjectVal(this.project$);
  }

  giveMeInfo() {
    console.log(this.project$.tag);
    console.log(this.project$.multiBom);
  }


}
