import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { MaterialList } from '../materialListModel';
import { Observable } from 'rxjs';
import { RestService } from '../services/rest/rest.service';
import { LoaderService } from '../services/loader/loader.service';

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent implements OnInit {

  private master: MaterialList;
  private masterId: string;

  public observable;

  constructor(private route: ActivatedRoute, private router: Router, private restService: RestService, private loader: LoaderService) {
    route.params.subscribe(res => {
      this.masterId = res.id;
    });
    this.restService.master.subscribe(res => {
      this.master = res;
      // this.loader.hideLoader();
      console.log(this.master);
    });
  }

  ngOnInit() {
    this.restService.getMasterById(this.masterId);
    // this.loader.showLoader(true);
  }
}
