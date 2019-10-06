import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-comparison-list-view',
  templateUrl: './comparison-list-view.component.html',
  styleUrls: ['./comparison-list-view.component.scss']
})
export class ComparisonListViewComponent implements OnInit, OnChanges {

  public bom$: any;
  public sorted: any;

  @Output() selection: EventEmitter<any> = new EventEmitter();

  @Input() set bom(bom) {
    this.bom$ = bom;
  }

  get bom(): object {
    return this.bom$;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.bom$ = changes.bom.currentValue;
  }

  addSort(cat, evt) {
   if($(evt.target).siblings().hasClass("filter")) {
      if($(evt.target).siblings().hasClass("filter-2")) {
        let cat1 = $(evt.target).siblings(".filter").data("sort");
        let cat2 = $(evt.target).siblings(".filter-2").data("sort");
        $(evt.target).addClass("filter-3");
        this.bom$.sort(this.dynamicSort(cat1, cat2, cat));

      } else {
        let cat1 = $(evt.target).siblings(".filter").data("sort");
        $(evt.target).addClass("filter-2");
        $(evt.target).data("sort", cat);
        this.bom$.sort(this.dynamicSort(cat1, cat));

      }
    } else if ($(evt.target).hasClass("filter") || $(evt.target).hasClass("filter-2") || $(evt.target).hasClass("filter-3")) {
        if ($(evt.target).hasClass("filter")) {
          $(evt.target).removeClass("filter");
          $(evt.target).siblings(".filter-2").addClass("filter").removeClass("filter-2");
          $(evt.target).siblings(".filter-3").addClass("filter-2").removeClass("filter-3");
          let cat1 = $(evt.target).siblings("filter").data("sort");
          let cat = $(evt.target).siblings("filter-2").data("sort");
          this.bom$.sort(this.dynamicSort(cat1, cat));
        } if ($(evt.target).hasClass("filter-2")) {
            $(evt.target).removeClass("filter-2");
            $(evt.target).siblings(".filter-3").addClass("filter-2").removeClass("filter-3");
            let cat1 = $(evt.target).siblings("filter").data("sort");
            let cat = $(evt.target).siblings("filter-2").data("sort");
            this.bom$.sort(this.dynamicSort(cat1, cat));
        } if($(evt.target).hasClass("filter-3")) {
            $(evt.target).removeClass("filter-3");
            let cat1 = $(evt.target).siblings("filter").data("sort");
            let cat = $(evt.target).siblings("filter-2").data("sort");
            this.bom$.sort(this.dynamicSort(cat1, cat));
        }

    } else {
      $(evt.target).addClass("filter");
      $(evt.target).data("sort", cat);
      this.bom$.sort(this.dynamicSort(cat));
    } 
  }

  dynamicSort(...props) {
    var args = arguments;
  
     return function (a,b) {
      var result = a[args[0]] < b[args[0]] ? -1 : a[args[0]] > b[args[0]] ? 1 : 0 || a[args[1]] < b[args[1]] ? -1 : a[args[1]] > b[args[1]] ? 1 : 0 || a[args[2]] < b[args[2]] ? -1 : a[args[2]] > b[args[2]] ? 1 : 0;
      return result;
    }
  }

}
