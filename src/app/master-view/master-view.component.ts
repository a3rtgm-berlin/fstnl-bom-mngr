import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { Bom } from '../bomModel';
import { RestService } from '../services/rest/rest.service';
import { LoaderService } from '../services/loader/loader.service';

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent implements OnInit {

  public master: Bom;
  public masterId: string;

  constructor(private route: ActivatedRoute, private router: Router, private restService: RestService, private loader: LoaderService) {
    route.params.subscribe(res => {
      this.masterId = res.id;
    });
    this.restService.master.subscribe(res => {
      this.master = res;
    });
  }

  ngOnInit() {
    this.restService.getMasterById(this.masterId);
  }
}
