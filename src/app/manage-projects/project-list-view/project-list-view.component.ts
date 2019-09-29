import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectSubSettingsComponent } from '../project-sub-settings/project-sub-settings.component';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-project-list-view',
  templateUrl: './project-list-view.component.html',
  styleUrls: ['./project-list-view.component.scss']
})
export class ProjectListViewComponent implements OnInit, OnChanges {

  private project$: any;
  modalController = true;

  @Input() set project(project) {
    this.project$ = project;
  };

  constructor(public modalService: ModalService) {
  }

  ngOnInit() {
    console.log(this.project$);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.project$ = changes.project.currentValue;
  }

  createComponent() {
    if (this.modalController) {
      this.modalService.init(ProjectSubSettingsComponent, {title: 'Vorerst Banane'}, {}, 'prjctsb', false);
    } else {
      this.modalService.destroy('prjctsb');
    }

    this.modalController = !this.modalController;
  }

  removeModal() {
    this.modalService.destroy('prjctsb');
  }

}
