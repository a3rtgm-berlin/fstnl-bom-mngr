import { Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RestService } from '../services/rest/rest.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-query-form',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.scss']
})
export class QueryFormComponent implements OnInit {

  private observable;
  private deleteDialog = {
    title: 'Delete BOM File',
    text: 'Are you sure you want to delete the selected File from the Database and remove it from the Collection of that month?',
    option1: {
      text: 'Delete',
      function: this.onDeleteList,
      arg: ''
    }
  };

  public dialog: any;
  public dialogVisible = false;

  constructor(public restService: RestService, private router: Router, private location: Location) { }

  ngOnInit() {
  }

  public async getAll() {
    this.restService.getAllLists();
    this.router.navigate([`app/lists`]);
  }

  public async onGetList(id) {
    this.restService.getList(id);
    this.router.navigate([`app/lists/${id}`]);
  }

  public onGetAllLists() {
    this.getAll();
  }

  public onDeleteList(id) {
    this.restService.deleteList(id);
  }

  public onInsertList(materialList) {
    this.restService.insertList(materialList);
  }

  public onUpdateList(materialList) {
    this.restService.updateList(materialList);
  }

}
