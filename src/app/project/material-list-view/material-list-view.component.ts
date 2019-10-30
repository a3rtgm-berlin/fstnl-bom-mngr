import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MaterialList } from '../../materialListModel';

@Component({
  selector: 'app-material-list-view',
  templateUrl: './material-list-view.component.html',
  styleUrls: ['./material-list-view.component.scss']
})
export class MaterialListViewComponent implements OnInit, OnChanges {

  private materialList$: MaterialList;

  @Input() set materialList(materialList: MaterialList) {
    this.materialList$ = materialList;
  }

  get materialList(): MaterialList {
    return this.materialList$;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.materialList = changes.materialList.currentValue;
  }

}
