import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percent'
})
export class PercentPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value) {
      return !isNaN(value) ? Math.round(value * 100) + ' %' : value;
    }
    return undefined;
  }

}
