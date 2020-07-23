import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bom } from '../bomModel';
import { RestService } from '../services/rest/rest.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  public boms: Bom[];
  public selectedBoms: Set<Bom> = new Set<Bom>();

  constructor(private restService: RestService, private router: Router) {
    this.restService.allMaster.subscribe(res => {
      this.boms = res;
    });
  }

  ngOnInit() {
  }

  setSelectedBoms(event$) {
    if (event$.status) {
      this.selectedBoms.add(event$.bom);
    } else {
      this.selectedBoms.delete(event$.bom);
    }
  }

  // triggerCompareLists() {
  //   const arr = Array.from(this.selectedBoms);

  //   this.router.navigate([`./app/lists/compare/${arr[0].id}/${arr[1].id}`]);
  // }
}
