import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ProjectSubSettingsComponent } from '../project-sub-settings/project-sub-settings.component';
import { UpdateProjectComponent } from '../update-project/update-project.component';
import { ModalService } from '../../services/modal/modal.service';
import { RestService } from '../../services/rest/rest.service';
import $ from 'jquery';
import { AlertService } from '../../services/alert/alert.service';
import { BomMetaViewComponent } from '../../bom-meta-view/bom-meta-view.component';

@Component({
  selector: 'app-project-list-view',
  templateUrl: './project-list-view.component.html',
  styleUrls: ['./project-list-view.component.scss']
})

export class ProjectListViewComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild ('prjctsb', {static: false}) injector: any;
  @ViewChild ('selectBom', {static: false}) selectBom: any;

  public project$: any;
  boms$: any;
  totalDiff: any;
  modalController = true;
  multiBom: any;
  mltBmArray = [];
  mltBmToMerge = [];
  tglSwitch: any;
  cSBom: any;
  selectedSingleBom: any;
  state$: any;

  @Input() set project(project) {
    this.project$ = project;
  }

  constructor(public modalService: ModalService, public restService: RestService, public alertService: AlertService) {
  }

  ngOnInit() {
    this.tglSwitch = 'overview';
    this.boms$ = this.project$.boms;
    this.setWeeks(this.project$.deadline);

    for (let i = 0; i < this.project$.multiBom; i++) {
      const count = String.fromCharCode(66 + i);
      this.mltBmArray.push(count);
      this.autoSelectMultiBom();
    }
  }

  ngAfterViewInit(): void {
    this.cSBom = this.selectBom.nativeElement.value;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.project$ = changes.project.currentValue;
    this.boms$ = this.project$.boms;
    this.autoSelectMultiBom();
  }

  setSwitch(targ, evt) {
    this.tglSwitch = targ;
    $(evt.target).addClass('active');
    $(evt.target).siblings().removeClass('active');
  }

  setWeeks(date) {
    const date1 = new Date(date);
    const date2 = new Date();
    let diffInWeeks = (date2.getTime() - date1.getTime()) / 1000;
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
      this.mltBmToMerge.push(this.boms$.find(id => id.includes(i)));
    });
  }

  createComponent() {
    this.modalService.destroy('.prjctsb');
    this.modalService.init(ProjectSubSettingsComponent, {project: this.project$}, {}, this.injector, false);
  }

  updateProject() {
    this.modalService.destroy('.prjctsb');
    this.modalService.init(UpdateProjectComponent, {project: this.project$}, {}, this.injector, false);
  }

  targetSingleBom(event: any) {
    this.cSBom = event.target.value;
  }

  updateSingleBOM() {
    if (confirm(`Recalculate BOM ${this.cSBom} with Project Stats?`)) {
      this.restService.updateList(this.cSBom);
    }
  }

  deleteSingleBOM() {
    if (confirm(`Delete BOM ${this.cSBom}?`)) {
      this.restService.deleteList(this.cSBom);
    }
  }

  getSingleBOMMeta() {
    if (this.cSBom) {
      this.restService.getSingleBomMeta(this.cSBom)
        .toPromise()
        .then((meta: any) => {
          if (meta) {
            meta.uploadDate = new Date(meta.uploadDate);
            this.modalService.init(BomMetaViewComponent, {meta}, {});
          }
      });
    } else {
      alert('no BOM selected');
    }
  }

}
