import { Component, OnInit, Input, OnChanges, EventEmitter, ViewChild, Output, SimpleChanges } from '@angular/core';
import $ from 'jquery';
import { ColorCodeService } from '../services/color-code/color-code.service';
import { ExportService } from '../services/export/export.service';

@Component({
  selector: 'app-masterlistview',
  templateUrl: './masterlistview.component.html',
  styleUrls: ['./masterlistview.component.scss']
})
export class MasterlistviewComponent implements OnInit, OnChanges {

  public bom$: any;
  public processedBom: any;
  public allBomProjects: any;
  public sorted: any;
  public cols: string[] = [];
  public colors: object = {};


  @ViewChild('filterCol', {static: false}) filterCol: any;
  @Output() selection: EventEmitter<any> = new EventEmitter();
  @Input() id: string;
  @Input() set bom(bom) {
    this.bom$ = bom;
    this.processedBom = this.bom$;
    this.colorCodeStations();
  }
  get bom(): object {
    return this.bom$;
  }

  constructor(public colorCodeService: ColorCodeService, public exportService: ExportService) { }

  ngOnInit() {
    console.log(this.processedBom.lists);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.bom$ = changes.bom.currentValue;
    this.processedBom = this.bom$;
    this.cols = Object.keys(this.bom$[0]);
    this.colorCodeStations();
  }

  colorCodeStations() {
    const stations = this.bom$
      .map(part => part.Station)
      .reduce((allStations, station) => {
        return allStations.includes(station) ? allStations : [...allStations, station];
      }, []);

    this.colors = {};
    stations.forEach(station => {
      let color = this.colorCodeService.pickColorFromArray();
      let unique = false;

      while (!unique) {
        if (Object.values(this.colors).length >= (this.colorCodeService.colorArray.length - 1) ||
          !Object.values(this.colors).includes(color)) {
            this.colors[station] = color;
            unique = true;
        } else {
          color = this.colorCodeService.pickColorFromArray();
        }
      }
    });
  }

  filterBom(val) {
    if (val !== '' && this.bom$) {
      this.processedBom = this.bom$.filter((row) => {
        return row[this.filterCol.nativeElement.value].toString().includes(val);
      });
    } else {
      this.processedBom = this.bom$;
    }
  }

  addSort(cat, evt) {
    if ($(evt.target).siblings().hasClass('filter')) {
      if ($(evt.target).siblings().hasClass('filter2')) {
        const cat1 = $(evt.target).siblings('.filter').data('sort');
        const cat2 = $(evt.target).siblings('.filter2').data('sort');

        $(evt.target).addClass('filter3');
        this.bom$.sort(this.dynamicSort(cat1, cat2, cat));

      } else {
        const cat1 = $(evt.target).siblings('.filter').data('sort');
        $(evt.target).addClass('filter2');
        $(evt.target).data('sort', cat);
        this.bom$.sort(this.dynamicSort(cat1, cat));

      }
    } else if ($(evt.target).hasClass('filter2') || $(evt.target).hasClass('filter') || $(evt.target).hasClass('filter3')) {
        alert('I Have alrey a filter class');
        if ($(evt.target).hasClass('filter')) {
          $(evt.target).removeClass('filter');
          $(evt.target).siblings('.filter2').addClass('filter').removeClass('filter2');
          $(evt.target).siblings('.filter3').addClass('filter2').removeClass('filter3');

          const cat1 = $(evt.target).siblings('filter').data('sort');
          const cat2 = $(evt.target).siblings('filter2').data('sort');
          this.bom$.sort(this.dynamicSort(cat1, cat2));

        } else if ($(evt.target).hasClass('filter2')) {
            $(evt.target).removeClass('filter2');
            $(evt.target).siblings('.filter3').addClass('filter2').removeClass('filter3');
            const cat1 = $(evt.target).siblings('filter').data('sort');
            const cat2 = $(evt.target).siblings('filter2').data('sort');
            this.bom$.sort(this.dynamicSort(cat1, cat2));

        } else if ($(evt.target).hasClass('filter3')) {
            $(evt.target).removeClass('filter3');
            const cat1 = $(evt.target).siblings('filter').data('sort');
            const cat2 = $(evt.target).siblings('filter2').data('sort');
            this.bom$.sort(this.dynamicSort(cat1, cat2));
        }

    } else {
      $(evt.target).addClass('filter');
      $(evt.target).data('sort', cat);
      this.bom$.sort(this.dynamicSort(cat));
    }

    this.processedBom = this.bom$;
  }

  dynamicSort(...props) {
    const args = arguments;

    return (a, b) => {
      const result = a[args[0]] < b[args[0]] ? -1 : a[args[0]] > b[args[0]] ? 1 : 0 || a[args[1]] < b[args[1]] ? -1 : a[args[1]] > b[args[1]] ? 1 : 0 || a[args[2]] < b[args[2]] ? -1 : a[args[2]] > b[args[2]] ? 1 : 0;

      return result;
    }
  }

  downloadBom(type) {
    this.exportService.xlsxFromJson(
      type === 'filtered' ? this.processedBom : this.bom,
      type === 'filtered' ? this.id + '(filtered)' : this.id
    );
  }

}
