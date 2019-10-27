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
  mltBmToMerge = [];
  tglSwitch: any;

  @Input() set project(project) {
    this.project$ = project;
  }

  constructor(public modalService: ModalService, public restService: RestService) {
  }

  ngOnInit() {
    this.tglSwitch = 'overview';
    this.bomList$ = this.project$.bomLists;

    this.setWeeks(this.project$.deadline);

    let i;
    for (i = 0; i < this.project$.multiBom; i++) {
      let count = String.fromCharCode(66 + i);
      this.mltBmArray.push(count);
      this.autoSelectMultiBom();
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.project$ = changes.project.currentValue;
    this.bomList$ = this.project$.bomLists;
    this.autoSelectMultiBom();
  }

  createComponent() {
    this.modalService.init(ProjectSubSettingsComponent, {project: this.project$}, {}, this.injector, false);
  }

  setSwitch(targ, evt) {
    this.tglSwitch = targ;
    $(evt.target).addClass("active");
    $(evt.target).siblings().removeClass("active");
  }

  setWeeks(date) {
    let date1 = new Date(date);
    let date2 = new Date();
    let diffInWeeks =(date2.getTime() - date1.getTime()) / 1000;
    diffInWeeks /= (60 * 60 * 24 * 7);
    this.totalDiff = Math.abs(Math.round(diffInWeeks));
  }

  increaseMultiBom() {
    this.project$.multiBom += 1;
    this.restService.updateProjectVal(this.project$);
  }

  decreaseMultiBom() {
    this.project$.multiBom -= 1;
    this.restService.updateProjectVal(this.project$);
  }

  mergeMultiBoms() {
    alert(`Creating new MultiBom File from ${this.mltBmToMerge}`);
    this.restService.createMultiBomFromIds(this.mltBmToMerge);
  }

  selectMultiBoms(evt: any, i: any) {
    this.mltBmToMerge[i] = evt.target.value;
  }

  autoSelectMultiBom() {
    this.mltBmToMerge = [];
    ['A', ...this.mltBmArray].forEach(i => {
      this.mltBmToMerge.push(this.bomList$.find(id => id.includes(i)));
    });
  }

  updateTrains() {
    alert("this shall be eu");
  }

  updateDeadline() {

  }
}
