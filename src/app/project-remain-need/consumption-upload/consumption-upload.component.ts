import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-consumption-upload',
  templateUrl: './consumption-upload.component.html',
  styleUrls: ['./consumption-upload.component.scss']
})
export class ConsumptionUploadComponent implements OnInit {

  file: File;
  acceptedTypes: string[] = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    '',
  ];

  @Input() id: string;

  constructor(private uploadService: UploadService) { }

  ngOnInit() {
  }

  // Submit uploaded file to server as POST request
  public onSubmit() {
    if (this.file) {
      const upload = this.uploadService.upload([this.file], `consumption/${this.id}`);

      upload[this.file.name].progress.subscribe({
        next: v => console.log(`POST ${this.file.name}: ${v}%`),
        error: err => console.error(`POST Error`, err),
        complete: () => console.log(` POST ${this.file.name} has been successfully uploaded and stored in the database.`)
      });
    } else {
      alert('Please select valid file!');
    }
  }

  public onChange(evt) {
    if (evt.target.files.length && this.acceptedTypes.includes(evt.target.files[0].type)) {
      this.file = evt.target.files[0];
    } else {
      alert('No valid file type. Please select another file of type XLSX or CSV');
    }
  }

}
