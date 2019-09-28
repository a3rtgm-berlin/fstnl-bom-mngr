import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { MaterialList } from '../../materialListModel';

@Component({
  selector: 'app-material-lists-collection-view',
  templateUrl: './material-lists-collection-view.component.html',
  styleUrls: ['./material-lists-collection-view.component.scss']
})
export class MaterialListsCollectionViewComponent implements OnInit, OnChanges {

  isSelected: boolean;

  private materialList$: MaterialList;

  @Output() public selectedMaterialList: EventEmitter<{materialList: MaterialList, status: boolean}> = new EventEmitter();

  @Input() set materialList(materialList: MaterialList) {
    this.materialList$ = materialList;
  }

  get materialLists(): MaterialList {
    return this.materialList$;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.materialList = changes.materialList.currentValue;
  }

  selectList(materialList: MaterialList) {
    this.isSelected = !this.isSelected;
    this.selectedMaterialList.emit({
      materialList: this.materialList$,
      status: this.isSelected
    });
  }

}
