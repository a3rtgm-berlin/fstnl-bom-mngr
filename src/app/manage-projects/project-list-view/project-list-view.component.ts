import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ProjectSubSettingsComponent } from '../project-sub-settings/project-sub-settings.component';
import { XlsLoaderComponent } from '../../xls-loader/xls-loader.component';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-project-list-view',
  templateUrl: './project-list-view.component.html',
  styleUrls: ['./project-list-view.component.scss']
})
export class ProjectListViewComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild ('prjctsb', {static: false}) injector: any;

  private project$: any;
  bomList$: any;
  modalController = true;

  @Input() set project(project) {
    this.project$ = project;
  }

  constructor(public modalService: ModalService) {
  }

  ngOnInit() {
    this.bomList$ = this.project$.bomLists;
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.project$ = changes.project.currentValue;
  }

  createComponent() {
    this.modalService.init(ProjectSubSettingsComponent, {project: this.project$}, {}, this.injector, false);
  }
}
