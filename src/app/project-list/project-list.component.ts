import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialList } from '../materialListModel';
import { RestService } from '../services/rest/rest.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  public materialLists: MaterialList[];
  public selectedMaterialLists: Set<MaterialList> = new Set<MaterialList>();

  constructor(private restService: RestService, private router: Router) {
    this.restService.allMaster.subscribe(res => {
      this.materialLists = res;
      console.log(res);
    });
  }

  ngOnInit() {
    this.restService.getAllMaster();
  }

  setSelectedMaterialLists(event$) {
    if (event$.status) {
      this.selectedMaterialLists.add(event$.materialList);
    } else {
      this.selectedMaterialLists.delete(event$.materialList);
    }
  }

  triggerCompareLists() {
    const arr = Array.from(this.selectedMaterialLists);

    this.router.navigate([`./app/lists/compare/${arr[0].id}/${arr[1].id}`]);
  }
}
