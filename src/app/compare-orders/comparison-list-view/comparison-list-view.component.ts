import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import $ from 'jquery';
import { ColorCodeService } from 'src/app/services/color-code/color-code.service';

@Component({
  selector: 'app-comparison-list-view',
  templateUrl: './comparison-list-view.component.html',
  styleUrls: ['./comparison-list-view.component.scss']
})
export class ComparisonListViewComponent implements OnInit, OnChanges {

  public bom$: any;
  public processedBom: any;
  public sorted: any;
  //public cols: string[] = [];
  public cols: any;
  public activeCols: any;


  @ViewChild('filterCol', {static: false}) filterCol: any;
  @Output() selection: EventEmitter<any> = new EventEmitter();
  @Input() set bom(bom) {
    this.bom$ = bom;
    this.processedBom = this.bom$;
  }

  get bom(): object {
    return this.bom$;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.bom$ = changes.bom.currentValue;
    this.processedBom = this.bom$;
    this.cols = Object.keys(this.bom$[0]);
   
    this.mapFilters();

  }

  mapFilters() {
    this.cols = this.cols.map((col) => ({
       value: col,
       //name: this.mapColName(col)
       name: this.mapColName(col),
    }));

  }

  mapColName(col) {
    if (col === "ME") {
      col = "Unit"
      return col;
    }
    if (col === "Objektkurztext"){
      col = "Part"
      return col;
    }
    if (col === "id") {
      col = "Part#"
      return col;
    }
    if (col === "Menge") {
      col = "Quantity"
      return col;
    }
    if (col === "Station") {
      return col;
    }
    if (col === "Status") {
      return col;
    } else {
      return false;
    }
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
    var args = arguments;
  
     return function (a,b) {
      var result = a[args[0]] < b[args[0]] ? -1 : a[args[0]] > b[args[0]] ? 1 : 0 || a[args[1]] < b[args[1]] ? -1 : a[args[1]] > b[args[1]] ? 1 : 0 || a[args[2]] < b[args[2]] ? -1 : a[args[2]] > b[args[2]] ? 1 : 0;
      return result;
    }
  }

}
