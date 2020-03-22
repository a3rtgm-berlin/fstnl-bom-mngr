import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { ThrowStmt, AstMemoryEfficientTransformer } from '@angular/compiler';
import { RestService } from '../services/rest/rest.service';
import { ConsumptionUploadComponent } from './consumption-upload/consumption-upload.component';
import { Project } from '../projectModel';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import $ from 'jquery';
import { ExportService } from '../services/export/export.service';

@Component({
  selector: 'app-project-remain-need',
  templateUrl: './project-remain-need.component.html',
  styleUrls: ['./project-remain-need.component.scss']
})

export class ProjectRemainNeedComponent implements OnInit, AfterViewInit {

  minmax: any;
  storageTime: any;
  perWeek: any;
  processedRPN: any;
  thisCount: any;
  thisFilter: any;
  displayedColumns: any[];
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


  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('filterCol', {static: false}) filterCol: any;
  @Input() projects: any[] | null;
  @Input() id: string | null;
  @Output() created: EventEmitter<boolean> = new EventEmitter();


  dataSource = new MatTableDataSource();
  constructor( public restService: RestService, public exportService: ExportService) {
  }

  ngOnInit() {
    this.restService.getRPN(this.id);
    this.restService.rpn.subscribe(res => {
      if (res) {
        this.rpn = res;
        this.storageVal(26);

        console.log(this.rpn);
        this.displayedColumns = [
          'Part',
          'Description',
          'Unit',
          'Overall Need',
          ...this.projects,
          'MonNeed',
          'Usage',
          'Consumption',
          'MinMax',
          'Phase Out Date'];
        this.dataSource = new MatTableDataSource(this.processedRPN);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.thisCount = this.dataSource.data.length;
        this.thisFilter = this.dataSource.data.length;
      }
    });

    this.created.emit(true);
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {

    this.dataSource = new MatTableDataSource(this.processedRPN);
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

  viewVal(val: string) {
    console.log(val);
  }

  scrollTop() {
    $('body,html').animate({
      scrollTop: 0
    }, 800);
    return false;
  }


}
