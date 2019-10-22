import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-project-remain-need',
  templateUrl: './project-remain-need.component.html',
  styleUrls: ['./project-remain-need.component.scss']
})
export class ProjectRemainNeedComponent implements OnInit {

  @Input() bom: any[] | null;
  constructor() { }

  ngOnInit() {
    if (this.bom) {
    const allParts = this.bom
      .map(d => d.Material)
      .reduce((res, part) => {
        return res.includes(part) ? res : [...res, part];
      }, []);
    }
  }

}
