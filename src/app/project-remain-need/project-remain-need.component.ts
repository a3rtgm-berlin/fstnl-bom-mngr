import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { RestService } from '../services/rest/rest.service';
import { MaterialList } from '../materialListModel';
import { Project } from '../projectModel'
import $ from 'jquery';
import { ExportService } from '../services/export/export.service';

@Component({
  selector: 'app-project-remain-need',
  templateUrl: './project-remain-need.component.html',
  styleUrls: ['./project-remain-need.component.scss']
})
export class ProjectRemainNeedComponent implements OnInit {

  storageTime: any;
  private _rpn = {
    parts: [],
  };

  public get rpn(): any {
    return this._rpn;
  }
  public set rpn(value: any) {
    value.parts.forEach(part => {
      part.phaseOutDate = part.phaseOutDate.length > 0 ?
        new Date(part.phaseOutDate).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) : '';
    });
    console.log(value);
    this._rpn = value;
  }


  @ViewChild('filterCol', {static: false}) filterCol: any;
  @Input() projects: string[] | null;
  @Input() id: string | null;

  constructor( public restService: RestService, public exportService: ExportService) {
  }

  ngOnInit() {
    this.restService.getRPN(this.id);
    this.restService.rpn.subscribe(res => {
      if (res) {
        this.rpn = res;
      }
    });
  }

  downloadRPN() {
    this.exportService.xlsxFromJson(this.rpn, `RPN-${this.id}`);
  }

  storageVal(event) {
    this.storageTime = event.target.value;
    console.log(this.storageTime);
  }
}
