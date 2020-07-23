import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localeNumber'
})
export class LocaleNumberPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return !isNaN(value) ? value.toLocaleString('en-US') : value;
  }

}
