import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest/rest.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  public observable;

  constructor(public restService: RestService) { }

  ngOnInit() {
    this.getAll();
  }

  private onSubmit() {
    this.getAll();
  }

  private getAll() {
    this.observable = this.restService.getAllLists();
    this.resolveObservable();
  }

  private async resolveObservable() {
    console.log(await this.observable.toPromise());
  }
}
