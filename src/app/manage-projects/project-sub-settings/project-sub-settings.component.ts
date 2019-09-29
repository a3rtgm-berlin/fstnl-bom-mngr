import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-project-sub-settings',
  templateUrl: './project-sub-settings.component.html',
  styleUrls: ['./project-sub-settings.component.scss']
})
export class ProjectSubSettingsComponent implements OnInit {

  private project$: any;
  bomLists: any;

  @Input() set project(project: any) {
    this.project$ = project;
  }
  
  constructor() { }

  ngOnInit() {
    console.log(this.project$);
    console.log(this.project$.bomLists);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.project$ = changes.project.currentValue;
  }


}
