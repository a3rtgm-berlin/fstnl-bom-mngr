import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest/rest.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
