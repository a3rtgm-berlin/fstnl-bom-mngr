import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ThrowStmt, AstMemoryEfficientTransformer } from '@angular/compiler';
import { RestService } from '../services/rest/rest.service';
import { ConsumptionUploadComponent } from './consumption-upload/consumption-upload.component';
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

  minmax: any;
  storageTime: any;
  perWeek: any;
  processedRPN: any;
  _rpn = {
    parts: [],
    hasConsumption: false
  };

  public get rpn(): any {
    return this._rpn;
  }
  public set rpn(value: any) {
    value.parts.forEach(part => {
      part.phaseOutDate = part.phaseOutDate.length > 0 ?
        new Date(part.phaseOutDate).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) : '';
    });
    this._rpn = value;
    this.processedRPN = value.parts;
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
        this.storageVal(26);
      }
    });
  }

  downloadRPN() {
    this.exportService.xlsxFromJson(this.rpn.parts, `RPN-${this.id}`);
  }

  setStorageVal(event) {
    this.storageVal(event.target.value);
  }

  storageVal(weeks) {
    console.log(weeks);
    this.storageTime = weeks;
    this._rpn.parts.forEach((part) => {
      part.minmax = 0;
      part.min = 0;
      part.max = 0;
    });

    this.projects.forEach((project) => {
      this._rpn.parts.forEach((part, index) => {
        if (index === 1) {
            this.perWeek = part[project];
        } else if (index > 2) {
          const minmax = Math.round((part[project] * this.perWeek) * this.storageTime);
          part.minmax = part.minmax + minmax;
        }
      });
    });

    this._rpn.parts.forEach((part) => {
      part.min = Math.round(part.minmax * 0.9);
      part.max = Math.round(part.minmax * 1.1);
    });
  }

  viewVal(string) {
    console.log(string);
  };


}
