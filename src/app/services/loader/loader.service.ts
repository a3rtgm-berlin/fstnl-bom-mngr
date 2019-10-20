import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private overlayElementId = '#overlay';
  private loaderElementId = '#loader';

  constructor() { }

  showLoader(auto?: boolean, interval: number = 500) {
    $(this.loaderElementId).addClass('show').removeClass('hidden').text('0%');

    if (auto) {
      let p = 0;
      const fakeProgress = setInterval(() => {
        this.updateLoader(p);
        p += 20;

        if (p > 100) {
          clearInterval(fakeProgress);
        }
      }, interval);
    }
  }

  updateLoader(v) {
    $(this.loaderElementId).text(`${v}%`);
  }

  hideLoader() {
    $(this.loaderElementId).addClass('hidden').removeClass('show');
  }

  loaderFromObservable(observable: Observable<any>) {
    this.showLoader();
    observable.subscribe({
      next: v => {
        this.updateLoader(v);
        console.log(v);
      },
      error: err => {
        this.hideLoader();
        console.error(err);
      },
      complete: () => {
        console.log('loaded');
        this.hideLoader();
      }
    });
  }
}
