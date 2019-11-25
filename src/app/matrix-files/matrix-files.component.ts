import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from '../services/upload/upload.service';
import { ModalService } from '../services/modal/modal.service';
import { RestService } from '../services/rest/rest.service';
import { ExportService } from '../services/export/export.service';

@Component({
  selector: 'app-matrix-files',
  templateUrl: './matrix-files.component.html',
  styleUrls: ['./matrix-files.component.scss'],
  host: {'class': 'modalparts'}
})
export class MatrixFilesComponent implements OnInit {

  public arbMatrix: object;
  public excludeList: string[];

  public data: object;
  public title: string;

  public file = {
    matrix: null,
    exclude: null
  };

  public acceptedTypes: string[] = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];

  constructor(
    public uploadService: UploadService,
    public modalService: ModalService,
    public restService: RestService,
    public exportService: ExportService
  ) { }

  ngOnInit() {
    this.restService.getExclude();
    this.restService.getMatrix();

    this.restService.excludeList.subscribe(res => {
      if (res) {
        this.excludeList = res.exclude.map(part => {
          return {exclude: part};
        });
      }
    });
    this.restService.arbMatrix.subscribe(res => {
      if (res) {
        this.arbMatrix = res.json;
      }
    });
  }

  // Update UI on input change
  // Migrate to REACTIVE form later?
public onChange(evt, type) {
    if (evt.target.files.length) {
      if (this.acceptedTypes.indexOf(evt.target.files[0].type) !== -1) {
        this.file[type] = evt.target.files[0];
      } else {
        alert('No valid file type. Please select another file of type XLS, XLSX or CSV');
      }
    }
  }

  // Submit uploaded file to server as POST request
  public onSubmit(type) {
    if (this.file[type]) {
      const upload = this.uploadService.upload([this.file[type]], type);

      this.close();

      upload[this.file[type].name].progress.subscribe({
        next: v => console.log(`POST ${this.file[type].name}: ${v}%`),
        error: err => console.error(`POST Error`, err),
        complete: () => console.log(` POST ${this.file[type].name} has been successfully uploaded and stored in the database.`)
      });
    } else {
      alert('Please select valid file!');
    }
  }

  public close() {
    this.modalService.destroy();
  }

  public download(type) {
    switch (type) {
      case 'matrix':
        this.exportService.xlsxFromJson(this.arbMatrix, 'BOM_ArbMatrix');
        break;
      case 'exclude':
        this.exportService.xlsxFromJson(this.excludeList, 'BOM_excludeList');
        break;
      default:
        break;
    }
  }
}
