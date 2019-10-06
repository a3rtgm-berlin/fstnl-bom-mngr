import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UploadService } from '../services/upload/upload.service';
import { RestService } from '../services/rest/rest.service';

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

  private file: File | null = null;
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
    console.log(evt.target.files[0].type);
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
      const upload = this.uploadService.upload([this.file], 'bom', this.projectTag);

      upload[this.file.name].progress.subscribe({
        next: v => console.log(`POST ${this.file.name}: ${v}%`),
        error: err => console.error(`POST Error`, err),
        complete: () => console.log(`Successfully uploaded`)
      });
    } else {
      alert('Please select valid file!');
    }
  }
}
