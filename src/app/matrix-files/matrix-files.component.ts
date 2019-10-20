import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from '../services/upload/upload.service';
import { ModalService } from '../services/modal/modal.service';

@Component({
  selector: 'app-matrix-files',
  templateUrl: './matrix-files.component.html',
  styleUrls: ['./matrix-files.component.scss']
})
export class MatrixFilesComponent implements OnInit {

  public data: object;
  
  private title: string;

  private file = {
    matrix: null,
    exclude: null
  };
  private acceptedTypes: string[] = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];

  constructor(public uploadService: UploadService, public modalService: ModalService) { }

  ngOnInit() {
  }

  // Update UI on input change
  // Migrate to REACTIVE form later?
  private onChange(evt, type) {
    if (evt.target.files.length) {
      if (this.acceptedTypes.indexOf(evt.target.files[0].type) !== -1) {
        this.file[type] = evt.target.files[0];
      } else {
        alert('No valid file type. Please select another file of type XLS, XLSX or CSV');
      }
    }
  }

  // Submit uploaded file to server as POST request
  private onSubmit(type) {
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
}
