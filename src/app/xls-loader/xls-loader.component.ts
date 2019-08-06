import { Component, OnInit } from '@angular/core';
import { UploadService } from '../upload/upload.service';

// Component to upload and interpret the BOM-xls file
// and pass the object on to the related project.

@Component({
  selector: 'app-xls-loader',
  templateUrl: './xls-loader.component.html',
  styleUrls: ['./xls-loader.component.scss']
})
export class XlsLoaderComponent implements OnInit {

  public data: object;

  private reader = new FileReader();
  private file: File | null = null;
  private acceptedTypes: string[] = ['application/vnd.ms-excel', 'text/csv'];

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
      this.uploadService.upload([this.file]);

      // this.reader.readAsDataURL(this.file);

      // this.reader.onload = () => {
      //   this.parseXls(this.reader.result);
      // };
    } else {
      alert('Please select valid file!');
    }
  }

  public parseXls(d: string | ArrayBuffer) {
    const input: any = d;
    console.log(input);
  }

}
