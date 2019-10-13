import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UploadService } from '../services/upload/upload.service';
import { RestService } from '../services/rest/rest.service';
import { forkJoin } from 'rxjs';

// Component to upload and interpret the BOM-xls file
// and pass the object on to the related project.

@Component({
  selector: 'app-xls-loader',
  templateUrl: './xls-loader.component.html',
  styleUrls: ['./xls-loader.component.scss']
})
export class XlsLoaderComponent implements OnInit {

  @Input() projectTag: string;

  public data: object;

  private files: File[] | null = null;
  private acceptedTypes: string[] = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    '',
  ];
  private isFocused = false;

  constructor(public uploadService: UploadService, public restService: RestService) { }

  ngOnInit() {
    console.log(this.projectTag);
  }

  // Update UI on input change
  // Migrate to REACTIVE form later?
  private onChange(evt) {
    this.files = [];

    if (evt.target.files.length) {
      for (const file in evt.target.files) {
        if (evt.target.files[file] instanceof File) {
          this.files.push(evt.target.files[file]);
        }
      }
      } else {
        alert('No valid file type. Please select another file of type XLS, XLSX or CSV');
      }
  }

  // Submit uploaded file to server as POST request
  private onSubmit() {

    if (this.files) {
      const upload = this.uploadService.upload(this.files, 'bom', this.projectTag);
      const allProgressObservables = [];

      for (const key in upload) {
        if (upload[key]) {
          allProgressObservables.push(upload[key].progress);
        }
      }

      forkJoin(allProgressObservables).subscribe({
        next: v => console.log(`POST: ${v}%`),
        error: err => console.error(`POST Error`, err),
        complete: () => console.log(`Successfully uploaded`)
      });
    } else {
      alert('Please select valid file!');
    }
  }
}
