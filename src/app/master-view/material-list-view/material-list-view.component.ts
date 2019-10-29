import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { MaterialList } from '../../materialListModel';
import $ from 'jquery';

@Component({
  selector: 'app-material-list-view',
  templateUrl: './material-list-view.component.html',
  styleUrls: ['./material-list-view.component.scss']
})
export class MaterialListViewComponent implements OnInit, OnChanges {

  public master$: any;
  public tab: any = 'MasterBOM';
  public tabs: string[] = ['MasterBOM', 'Comparison', 'RMN'];

  @ViewChild('tabsPanel', {static: false}) tabsPanel: ElementRef;

  @Input() set master(master: MaterialList) {
    this.master$ = master;
  }

  get master(): MaterialList {
    return this.master$;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.master = changes.master.currentValue;
  }

  selectTab(evt: Event, tab: string) {
    this.tab = tab;
    $(this.tabsPanel.nativeElement).find('button').attr('class', 'btn btn-outline-primary');
    $(evt.target).attr('class', 'btn btn-primary');
  }

}
