import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { RestService } from '../rest/rest.service';
import { LoaderService } from '../loader/loader.service';
import { environment } from './../../../environments/environment';

const url = environment.api + 'upload/';

@Injectable({
  providedIn: 'root'
})

export class UploadService {

  constructor(private http: HttpClient, private router: Router, private restService: RestService, private loader: LoaderService) {}

  public upload(files: File[], service: string, projectTag?: string, suffix?: string): {[key: string]: {progress: Observable<number>}} {

    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      const formData: FormData = new FormData();
      formData.append('tag', projectTag);
      formData.append('file', file, file.name);

      if (suffix) {
        formData.append('suffix', suffix);
      }

      const req = new HttpRequest('POST', `${url}${service}`, formData, {
        reportProgress: true
      });

      const progress = new Subject<number>();
      this.loader.showLoader(true);

      this.http.request(req).subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          progress.next(percentDone);

        } else if (event instanceof HttpResponse) {
          progress.complete();

          if (service.includes('consumption')) {
            this.restService.getRPN(service.split('/')[1]);
          } else if (service.includes('planogram')) {
            this.restService.getPlanogram();
            this.restService.getMasterById(service.split('/')[1]);
          } else {
            this.restService.getAllProjects();
          }

          this.loader.hideLoader();
        }
      });

      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    return status;
  }
}
