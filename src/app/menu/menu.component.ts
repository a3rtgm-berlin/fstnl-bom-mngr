import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  items = [
    'Nebu',
    'JayJay',
    'Egal'
  ]

  constructor() {
  }

  ngOnInit() {
  }

  onClick() {
    $(this).click(function(e) {
      event.preventDefault();
      alert("little boxes on the hillside");
    });
  }

}
