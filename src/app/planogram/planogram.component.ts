import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RestService } from '../services/rest/rest.service';
import { ExportService } from '../services/export/export.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import $ from 'jquery';

@Component({
  selector: 'app-planogram',
  templateUrl: './planogram.component.html',
  styleUrls: ['./planogram.component.scss']
})
export class PlanogramComponent implements OnInit, AfterViewInit {

  @Input() id: string | undefined;
  @Input() public set bom(value: any) {
    this.$bom = value;
    this.processedBom = value;
  }
  public get bom(): any {
    return this.$bom;
  }
  @Input() colors: any;
  @Output() created: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  planogram: any;
  $bom: any;
  processedBom: any;
  newSource: any;
  thisCount: any;
  thisFilter: any;

  displayedColumns: string[] = [
    'Location',
    'Wagon',
    'Bin',
    'Bin Count',
    'Part',
    'Description',
    'Unit',
    'Quantity Total'
  ];
  dataSource = new MatTableDataSource();
  constructor(public restService: RestService, public exportService: ExportService, public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.restService.getPlanogram();
    this.restService.planogram.subscribe(val => {
      this.planogram = val;
      console.log(val);
      if (this.planogram) {
        this.bom = this.planogram.mapping.map(part => {
          return !part.isNotOnBOM ? {
            ...part,
            ...this.bom.find(item => part['Location Index'] === item['Location Index'])
          } : {...part, ['Quantity Total']: 'Not On MasterBOM'};
        });
      }

      this.dataSource = new MatTableDataSource(this.bom);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.thisCount = this.dataSource.data.length;
      this.thisFilter = this.dataSource.data.length;

      // Was genau macht das???
      // this.changeDetectorRef.detectChanges();
    });
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  downloadPlanogram(): void {
    this.exportService.xlsxFromJson(this.planogram.planogram, `Planogram-${this.id}`, ['id']);
  }

  addSort(column, event) {
    alert('Filter function will be added soon');
  }

  applyFilter(filterValue: string) {

    this.dataSource = new MatTableDataSource(this.processedBom);
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (filterValue !== '' && this.dataSource.filteredData.length >= 2) {
      $('#filter2').addClass('active');
      this.thisFilter = this.dataSource.filteredData.length;
      this.dataSource = new MatTableDataSource(this.dataSource.filteredData);
      this.dataSource.paginator = this.paginator;
    } else {

      this.thisFilter = this.dataSource.filteredData.length;
      $('#filter2').removeClass('active');
    }
  }

  applyFilterSnd(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.thisFilter = this.dataSource.filteredData.length;
    this.dataSource.paginator = this.paginator;
  }


  createPlanogram(): void {
    if (confirm(`Create New Planogram from Master? Any existing Planogram with ID ${this.id} will be overwritten!`)) {
      this.restService.createPlanogram(this.id);
      this.created.emit(true);
    }
  }

  scrollTop() {
    $('body,html').animate({
      scrollTop: 0
    }, 800);
    return false;
  }
}


