import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload/upload.service';

@Component({
  selector: 'app-matrix-files',
  templateUrl: './matrix-files.component.html',
  styleUrls: ['./matrix-files.component.scss']
})
export class MatrixFilesComponent implements OnInit {

  public data: object;

  private file: File | null = null;
  private acceptedTypes: string[] = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];

  constructor(public uploadService: UploadService) { }

  ngOnInit() {
  }

  // Update UI on input change
  // Migrate to REACTIVE form later?
  private onChange(evt) {
    if (evt.target.files.length) {
      if (this.acceptedTypes.indexOf(evt.target.files[0].type) !== -1) {
        this.file = evt.target.files[0];
      } else {
        alert('No valid file type. Please select another file of type XLS, XLSX or CSV');
      }
    }
  }

  // Submit uploaded file to server as POST request
  private onSubmit() {
    if (this.file) {
      const upload = this.uploadService.upload([this.file], 'matrix');

      upload[this.file.name].progress.subscribe({
        next: v => console.log(`POST ${this.file.name}: ${v}%`),
        error: err => console.error(`POST Error`, err),
        complete: () => console.log(` POST ${this.file.name} has been successfully uploaded and stored in the database.`)
      });
    } else {
      alert('Please select valid file!');
    }
  }
}
