import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  xlsxFromJson(json: any, filename: string) {
    if (json[0].lists) {
      json.forEach(p => {
        p.lists.join(', ');
        delete p.Kategorie;
        delete p.KatID;
      });
    }
    const ws = XLSX.utils.json_to_sheet(json);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
  }
}
