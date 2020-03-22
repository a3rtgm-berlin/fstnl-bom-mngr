import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../services/rest/rest.service';
import { MetaData } from '../metaDataModel';
import { LoaderService } from '../services/loader/loader.service';

@Component({
  selector: 'app-compare-orders',
  templateUrl: './compare-orders.component.html',
  styleUrls: ['./compare-orders.component.scss']
})
export class CompareOrdersComponent implements OnInit, OnChanges {

  @Input() set movingFile(movingFile: any) {
    this.movingFile$ = movingFile;
  }

  get movingFile(): any {
    return this.movingFile$;
  }

  public movingFile$: any;

  private ids: string[2];

  constructor(private restService: RestService, private activatedRoute: ActivatedRoute) {

    // this.activatedRoute.params.subscribe(param => {
    //   if (param.id1 && param.id2) {
    //     this.restService.compareLists(param.id1, param.id2);

    //     this.restService.movingFile.subscribe(res => {
    //       this.movingFile(res);
    //     });
    //   }
    // });
  }

  ngOnInit() {
    console.log(this.movingFile);
  }

  ngOnChanges(changes: SimpleChanges) {
  }

}
