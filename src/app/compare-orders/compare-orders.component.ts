import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../services/rest/rest.service';
import { MetaData } from '../metaDataModel';

@Component({
  selector: 'app-compare-orders',
  templateUrl: './compare-orders.component.html',
  styleUrls: ['./compare-orders.component.scss']
})
export class CompareOrdersComponent implements OnInit, OnChanges {

  public comparison: any;

  private ids: string[2];

  constructor(private restService: RestService, private activatedRoute: ActivatedRoute) {
    this.restService.comparison.subscribe(res => {
      this.comparison = res;
      console.log(res);
    });

    this.activatedRoute.params.subscribe(res => {
      this.restService.compareLists(res.id1, res.id2);
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

}
