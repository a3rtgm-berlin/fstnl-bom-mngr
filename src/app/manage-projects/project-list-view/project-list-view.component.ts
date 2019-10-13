import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ProjectSubSettingsComponent } from '../project-sub-settings/project-sub-settings.component';
import { XlsLoaderComponent } from '../../xls-loader/xls-loader.component';
import { ModalService } from '../../services/modal/modal.service';
import { RestService } from '../../services/rest/rest.service';
import $ from 'jquery';

@Component({
  selector: 'app-project-list-view',
  templateUrl: './project-list-view.component.html',
  styleUrls: ['./project-list-view.component.scss']
})
export class ProjectListViewComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild ('prjctsb', {static: false}) injector: any;

  private project$: any;
  bomList$: any;
  totalDiff: any;
  modalController = true;
  multiBom: any;
  mltBmArray = [];
  tglSwitch: any;

  @Input() set project(project) {
    this.project$ = project;
  }

  constructor(public modalService: ModalService, public restService: RestService) {
  }

  ngOnInit() {
    this.tglSwitch = 'overview';
    this.bomList$ = this.project$.bomLists;

    let date1 = new Date(this.project$.deadline);
    let date2 = new Date();
    let diffInWeeks =(date2.getTime() - date1.getTime()) / 1000;
    diffInWeeks /= (60 * 60 * 24 * 7);
    console.log(diffInWeeks);
    this.totalDiff = Math.abs(Math.round(diffInWeeks));

    let i;
    for (i = 0; i < this.project$.multiBom; i++) {
      let count = String.fromCharCode(66 + i);
      this.mltBmArray.push(count);
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.project$ = changes.project.currentValue;
  }

  createComponent() {
    this.modalService.init(ProjectSubSettingsComponent, {project: this.project$}, {}, this.injector, false);
  }

  setSwitch(targ, evt) {
    this.tglSwitch = targ;
    $(evt.target).addClass("active");
    $(evt.target).siblings().removeClass("active");
  }


  increaseMultiBom() {
    this.project$.multiBom += 1;
    this.restService.updateProjectVal(this.project$);
  }

  decreaseMultiBom() {
    this.project$.multiBom -= 1;
    this.restService.updateProjectVal(this.project$);
  }

  consoleLog() { 
    console.log(this.mltBmArray);
  }
}
