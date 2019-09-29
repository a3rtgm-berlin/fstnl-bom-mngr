import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { RestService } from '../rest/rest.service';

const url = 'http://localhost:8000/api/upload';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient, private router: Router, private restService: RestService) {}

  public upload(files: [File], service: string, projectTag?: string): {[key: string]: {progress: Observable<number>}} {

    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      const formData: FormData = new FormData();
      formData.append('field', projectTag);
      formData.append('file', file, file.name);

      const req = new HttpRequest('POST', `${url}/${service}`, formData, {
        reportProgress: true
      });

      const progress = new Subject<number>();

      this.http.request(req).subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);

          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          progress.complete();

          switch (service) {
            case 'bom':
              this.restService.getList(`${event.body}`);
              this.router.navigate([`app/lists/${event.body}`]);
              break;
            case 'matrix':
              break;
            default:
              break;
          }
        }
      });

      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    return status;
  }
}
