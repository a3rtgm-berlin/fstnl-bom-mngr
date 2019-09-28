import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { MaterialList } from '../materialListModel';
import { Observable } from 'rxjs';
import { RestService } from '../services/rest/rest.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  materialList: MaterialList;

  public observable;

  constructor(private route: ActivatedRoute, private router: Router, private restService: RestService) {

    this.restService.singleList.subscribe(res => {
      this.materialList = res;
    });
  }

  ngOnInit() {
  }
}
