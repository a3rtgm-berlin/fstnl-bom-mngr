import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

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
    $(document).click(function(){
      alert("little boxes on the hillside little boxes little boxes");
    })
    
  }

  onClick() {
  }

}
