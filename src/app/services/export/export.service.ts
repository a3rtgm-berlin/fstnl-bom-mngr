import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { MappingService } from '../mapping/mapping.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(public mappingService: MappingService) { }

  xlsxFromJson(json: any, filename: string, exclude?: any[]) {
    let exportJson = JSON.parse(JSON.stringify(json));

    console.log(json);

    if (!Array.isArray(exportJson)) {
      exportJson = Object.entries(exportJson)
        .map(pair => {
          return {
            Field: pair[0],
            Value: pair[1]
          };
        });
    }

    if (exclude) {
      exportJson.map(p => {
        exclude.forEach(key => {
          delete p[key];
        });
        return p;
      });
    }

    for (const key in exportJson[0]) {
      if (Array.isArray(exportJson[0][key])) {
        exportJson.map(item => {
          if (item[key]) {
            item[key] = item[key].join(', ');
          }

          return item;
        });
      }
    }

    const ws = XLSX.utils.json_to_sheet(exportJson);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
  }
}
