import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialList } from '../materialListModel';
import { RestService } from '../rest/rest.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  public materialLists: MaterialList[];
  public selectedMaterialLists: Set<MaterialList> = new Set<MaterialList>();
  private observable;

  constructor(private route: ActivatedRoute, private restService: RestService) {
  }

  ngOnInit() {
    this.getAllLists();
  }

  async getAllLists() {
    this.observable = this.restService.getAllLists();

    const materialLists$ = await this.observable.toPromise();

    this.materialLists = materialLists$.map((el) => {
      el.uploadDate = new Date(el.uploadDate);
      return el;
    });
  }

  setSelectedMaterialLists(lists) {
    this.selectedMaterialLists = lists;
  }

  triggerCompareLists() {
    console.log(this.selectedMaterialLists);
  }
}
