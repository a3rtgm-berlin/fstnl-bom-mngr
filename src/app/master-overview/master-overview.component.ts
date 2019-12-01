import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest/rest.service';
import { all } from 'q';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master-overview',
  templateUrl: './master-overview.component.html',
  styleUrls: ['./master-overview.component.scss']
})
export class MasterOverviewComponent implements OnInit {

  allMaster: any[];

  constructor(public restService: RestService, public router: Router) {
    this.restService.allMaster.subscribe(res => {
      this.allMaster = res;
    });
  }

  ngOnInit() {
    this.restService.getAllMaster();
  }

  navigate(evt: any) {
    this.router.navigate([`app/master/view/${evt.target.parentNode.id}`]);
  }

}
