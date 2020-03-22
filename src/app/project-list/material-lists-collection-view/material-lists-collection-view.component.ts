import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { Bom } from '../../bomModel';

@Component({
  selector: 'app-material-lists-collection-view',
  templateUrl: './material-lists-collection-view.component.html',
  styleUrls: ['./material-lists-collection-view.component.scss']
})
export class MaterialListsCollectionViewComponent implements OnInit, OnChanges {

  isSelected: boolean;

  public bom$: Bom;

  @Output() public selectedBom: EventEmitter<{bom: Bom, status: boolean}> = new EventEmitter();

  @Input() set bom(bom: Bom) {
    this.bom$ = bom;
  }

  get boms(): Bom {
    return this.bom$;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.bom = changes.bom.currentValue;
  }

  selectList() {
    this.isSelected = !this.isSelected;
    this.selectedBom.emit({
      bom: this.bom$,
      status: this.isSelected
    });
  }

}
