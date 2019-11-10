import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  xlsxFromJson(json: any, filename: string) {
    const exportJson = JSON.parse(JSON.stringify(json));

    if (exportJson[0].lists) {
      exportJson.map(p => {
        p.lists = p.lists.join(', ');

        delete p.Kategorie;
        delete p.KatID;

        return p;
      });
    }

    const ws = XLSX.utils.json_to_sheet(exportJson);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
  }
}
