import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

const url = 'http://localhost:8000/api/upload';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient, private router: Router) {}

  public upload(files: [File]) {
    files.forEach(file => {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      const req = new HttpRequest('POST', url, formData, {
        reportProgress: true
      });

      this.http.request(req).subscribe((event) => {
        if (event instanceof HttpResponse) {
          console.log(`Success! ${file.name} uploaded.`);
          this.router.navigate([`/projects/:${event.body}`]);
        }
      });
    });
  }
}
