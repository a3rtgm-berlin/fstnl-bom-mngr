import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-project-list-view',
  templateUrl: './project-list-view.component.html',
  styleUrls: ['./project-list-view.component.scss']
})
export class ProjectListViewComponent implements OnInit, OnChanges {

  private project$: any;

  @Input() set project(project) {
    this.project$ = project;
  };

  constructor() { }

  ngOnInit() {
    console.log(this.project$);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.project$ = changes.project.currentValue;
  }
}
