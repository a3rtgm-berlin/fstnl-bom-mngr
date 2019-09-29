import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ProjectSubSettingsComponent } from '../project-sub-settings/project-sub-settings.component';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-project-list-view',
  templateUrl: './project-list-view.component.html',
  styleUrls: ['./project-list-view.component.scss']
})
export class ProjectListViewComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild ('ganzoben', {static: false}) btn: any;

  private project$: any;
  modalController = true;

  @Input() set project(project) {
    this.project$ = project;
  }

  constructor(public modalService: ModalService) {
  }

  ngOnInit() {
    console.log(this.project$);
  }

  ngAfterViewInit(): void {
    console.log(this.btn);
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
