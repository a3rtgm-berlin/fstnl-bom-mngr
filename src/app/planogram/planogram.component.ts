import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { RestService } from '../services/rest/rest.service';
import { ColorCodeService } from '../services/color-code/color-code.service';
import { ExportService } from '../services/export/export.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-planogram',
  templateUrl: './planogram.component.html',
  styleUrls: ['./planogram.component.scss']
})
export class PlanogramComponent implements OnInit, OnChanges {

  @Input() id: string | undefined;
  @Input() public set bom(value: any) {
    this._bom = value;
    this.processedBom = value;
  }
  public get bom(): any {
    return this._bom;
  }
  @Input() colors: any;
  @Output() created: EventEmitter<any> = new EventEmitter();

  planogram: any;
  _bom: any;
  processedBom: any;

  displayedColumns: string[] = ['Station', 'Location Wagon', 'Location Bin', 'Location Count', 'Material', 'Objektkurztext', 'ME', 'Menge'];
  dataSource = new MatTableDataSource();
  constructor(public restService: RestService, public exportService: ExportService) {}

  ngOnInit() {
    this.restService.getPlanogram(this.id);
    this.restService.planogram.subscribe(val => {
      this.planogram = val;
      if (this.planogram) {
        this.bom = this.planogram.mapping.map(part => {
          return !part.isNotOnBOM ? {
            ...part,
            ...this.bom.find(item => part.id === item.id)
          } : {...part, Menge: 'Not On MasterBOM'};
        });
      }
      this.dataSource = new MatTableDataSource(this.processedBom);
      console.log(this.dataSource);
      //console.log(this.processedBom.filter(x => x.isNotOnPOG));
      console.log(this.processedBom);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  downloadPlanogram(): void {
    this.exportService.xlsxFromJson(this.planogram.POG, `Planogram-${this.id}`, ['id']);
  }

  addSort(column, event){
    alert("Filter function will be added soon");
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createPlanogram(): void {
    if (confirm(`Create New Planogram from Master? Any existing Planogram with ID ${this.id} will be overwritten!`)) {
      this.restService.createPlanogram(this.id);
      this.created.emit(true);
    }
  }

}
