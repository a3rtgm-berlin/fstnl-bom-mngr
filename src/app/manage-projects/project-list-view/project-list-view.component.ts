import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-project-list-view',
  templateUrl: './project-list-view.component.html',
  styleUrls: ['./project-list-view.component.scss']
})
export class ProjectListViewComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild ('ganzoben', {static: false}) btn: any;

  private project$: any;

  @Input() set project(project) {
    this.project$ = project;
  };

  constructor() { }

  ngOnInit() {
    console.log(this.project$);
  }

  ngAfterViewInit(): void {
    console.log(this.btn);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.project$ = changes.project.currentValue;
  }
}
