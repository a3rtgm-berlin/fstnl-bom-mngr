import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnChanges {

  @Input() isVisible: boolean;
  @Input() dialog: any;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dialog = changes.dialog.currentValue;
  }

  cancel() {
    this.isVisible = false;
  }

}
