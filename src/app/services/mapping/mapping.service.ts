import { Injectable } from '@angular/core';
// import * as mapping from './mapping.json';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  constructor() { }

  replaceKeys(obj: object, map?: object): object {
    const _obj = Array.isArray(obj) ?
      JSON.parse(JSON.stringify(obj)) :
      [JSON.parse(JSON.stringify(obj))];

    _obj.forEach(item => {
      for (const key in map) {
        if (item[key]) {
          item[map[key]] = item[key];
          delete item[key];
        }
      }
    });

    return _obj;
  }

  replaceValues(obj: object, map?: object): object {
    const _obj = Array.isArray(obj) ?
      JSON.parse(JSON.stringify(obj)) :
      [JSON.parse(JSON.stringify(obj))];

    _obj.forEach(item => {
      for (const key in item) {
        if (Object.keys(map).includes(item[key])) {
          item[key] = map[item[key]];
        }
      }
    });

    return _obj;
  }
}
