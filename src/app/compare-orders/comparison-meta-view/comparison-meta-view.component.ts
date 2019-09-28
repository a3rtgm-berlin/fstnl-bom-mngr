import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { MetaData } from '../../metaDataModel';

@Component({
  selector: 'app-comparison-meta-view',
  templateUrl: './comparison-meta-view.component.html',
  styleUrls: ['./comparison-meta-view.component.scss']
})
export class ComparisonMetaViewComponent implements OnInit, OnChanges {

  private metaData$: MetaData;

  @Input() set metaData(metaData: MetaData) {
    this.metaData$ = metaData;
  }

  get metaData(): MetaData {
    return this.metaData$;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.metaData.currentValue);
  }

}
