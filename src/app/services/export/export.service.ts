import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  xlsxFromJson(json, tag) {
    json.forEach(p => p.lists.join(', '));
    const ws = XLSX.utils.json_to_sheet(json);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tag);
    XLSX.writeFile(wb, `BOM-${tag}.xlsx`);
  }
}
