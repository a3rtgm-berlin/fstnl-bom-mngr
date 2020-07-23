import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Bom } from '../../bomModel';
import $ from 'jquery';
import { ColorCodeService } from '../../services/color-code/color-code.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-material-list-view',
  templateUrl: './material-list-view.component.html',
  styleUrls: ['./material-list-view.component.scss']
})
export class MaterialListViewComponent implements OnInit, OnChanges {

  public master$: any;
  public tab: any = 'MasterBOM';
  public tabs: string[] = ['MasterBOM', 'Moving File', 'RPN', 'Planogram'];
  public colors: object | undefined;

  @ViewChild('tabsPanel', {static: false}) tabsPanel: ElementRef;

  @Input() set master(master: MasterBom) {
    this.master$ = master;
  }

  get master(): MasterBom {
    return this.master$;
  }

  constructor(public colorCodeService: ColorCodeService, public router: Router) {
    if (this.router.url.endsWith('/movingfile')) {
      this.tab = 'Moving File';
    } else if (this.router.url.endsWith('/rpn')) {
      this.tab = 'RPN';
    } else if (this.router.url.endsWith('/planogram')) {
      this.tab = 'Planogram';
    } else {
      this.tab = 'MasterBOM';
    }

   }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.master = changes.master.currentValue;
    this.colorCodeStations();
  }

  selectTab(evt: Event, tab: string) {
    this.tab = tab;
    $(this.tabsPanel.nativeElement).find('button').attr('class', 'btn btn-outline-primary');
    $(evt.target).attr('class', 'btn btn-primary');
  }

  colorCodeStations() {
    this.colors = this.colorCodeService.createColorMapping(this.master$.json, 'Location');
  }

  setLocalStateOnMaster($event: any, attr: string) {
    if ($event) {
      this.master$[attr] = $event;
    }
  }

}
