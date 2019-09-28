import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comparison-list-view',
  templateUrl: './comparison-list-view.component.html',
  styleUrls: ['./comparison-list-view.component.scss']
})
export class ComparisonListViewComponent implements OnInit, OnChanges {

  public bom$: any;

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

}
