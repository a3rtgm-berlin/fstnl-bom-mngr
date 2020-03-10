import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { RestService } from '../services/rest/rest.service';
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
  $rpn = {
    parts: [],
    hasConsumption: false
  };

  public get rpn(): any {
    return this.$rpn;
  }
  public set rpn(value: any) {
    value.parts.forEach(part => {
      part.phaseOutDate = part.phaseOutDate.length > 0 ?
        new Date(part.phaseOutDate).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) : '';
    });
    this.$rpn = value;
    this.processedRPN = value.parts;
  }


  @ViewChild('filterCol', {static: false}) filterCol: any;
  @Input() projects: string[] | null;
  @Input() id: string | null;
  @Output() created: EventEmitter<boolean> = new EventEmitter();

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
    this.created.emit(true);
  }

  downloadRPN() {
    this.exportService.xlsxFromJson(this.rpn.parts, `RPN-${this.id}`);
  }

  setStorageVal(event) {
    this.storageVal(event.target.value);
  }

  storageVal(weeks: number) {
    this.storageTime = weeks;

    this.rpn.parts.forEach((part, i) => {
      if (i > 2) {
        part.minmax = 0;
        this.projects.forEach(project => {
          const storageTime = this.rpn.parts[0][project] < this.storageTime ? this.rpn.parts[0][project] : this.storageTime;

          part.minmax += Math.round(((part[project] / this.rpn.parts[2][project])) * this.rpn.parts[1][project] * storageTime);
          part.min = Math.round(part.minmax * 0.9);
          part.max = Math.round(part.minmax * 1.1);
        });
      }
    });
  }
}
