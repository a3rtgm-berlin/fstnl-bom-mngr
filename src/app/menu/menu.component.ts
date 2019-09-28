import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { RestService } from '../services/rest/rest.service';

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

  constructor(restService: RestService) {
  }

  ngOnInit() {

  }

  onClick() {
  }

}
