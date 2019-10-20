import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundDecimals'
})
export class RoundDecimalsPipe implements PipeTransform {

  transform(val: any): string {
    if (isNaN(val) || Number.isInteger(val)) {
      return val.toString();
    }
    return val.toFixed(3).toString();
  }

}
