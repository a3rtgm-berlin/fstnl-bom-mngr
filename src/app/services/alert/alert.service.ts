import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() {
  }

  success(message: string, action: string) {
  }

  error(message: string, action: string, time: number) {
    const timer = time ? time : 5000;
  }

  dismiss() {
  }

}