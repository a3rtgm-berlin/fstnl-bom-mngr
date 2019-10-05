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
        $(evt.target).addClass("filter-3");
      } else {
        let cat1 = $(evt.target).siblings(".filter").data("sort");
        $(evt.target).addClass("filter-2");
        this.bom$.sort(this.dynamicSortMultiple(cat1, cat));
        
      }
    } else {
      $(evt.target).addClass("filter");
      $(evt.target).data("sort", cat);
      this.bom$.sort(this.dynamicSort(cat));
    }
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

dynamicSortMultiple() {
  /*
   * save the arguments object as it will be overwritten
   * note that arguments object is an array-like object
   * consisting of the names of the properties to sort by
   */
  var props = arguments;
  return function (obj1, obj2) {
      var i = 0, result = 0, numberOfProperties = props.length;
      /* try getting a different result from 0 (equal)
       * as long as we have extra properties to compare
       */
      while(result === 0 && i < numberOfProperties) {
        result = this.dynamicSort(props[i])(obj1, obj2);
          i++;
      }
      return result;
  }
}

}
