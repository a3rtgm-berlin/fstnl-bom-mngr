import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comparison-row-view',
  templateUrl: './comparison-row-view.component.html',
  styleUrls: ['./comparison-row-view.component.scss']
})
export class ComparisonRowViewComponent implements OnInit, OnChanges {

  private listRow$;

  @Output() public listRowState: EventEmitter<any> = new EventEmitter();

  @Input() set listRow(listRow) {
    this.listRow$ = listRow;
  }

  get listRow() {
    return this.listRow$;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.listRow$ = changes.listRow.currentValue;
  }

}
