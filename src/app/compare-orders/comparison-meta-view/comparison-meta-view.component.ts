import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { MetaData } from '../../metaDataModel';
import { ExportService } from '../../services/export/export.service';

@Component({
  selector: 'app-comparison-meta-view',
  templateUrl: './comparison-meta-view.component.html',
  styleUrls: ['./comparison-meta-view.component.scss']
})
export class ComparisonMetaViewComponent implements OnInit, OnChanges {

  public metaData$: MetaData;
  public bom$: any;
  public processedBom: any;

  @Input() id: string;
  @Input() set metaData(metaData: MetaData) {
    this.metaData$ = metaData;
  }
  @Input() set bom(bom) {
    this.bom$ = bom;
    this.processedBom = this.bom$;
  }
  
  get bom(): object {
    return this.bom$;
  }

  get metaData(): MetaData {
    return this.metaData$;
  }

  constructor(public exportService: ExportService) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.metaData.currentValue);
  }

  downloadBom(type) {
    this.exportService.xlsxFromJson(
      type === 'filtered' ? this.processedBom : this.bom,
      type === 'filtered' ? this.id + '(filtered)' : this.id
    );
  }

}
