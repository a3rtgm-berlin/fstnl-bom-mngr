import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { MaterialList } from '../../materialListModel';
import { Project } from '../../projectModel';
import { Router } from '@angular/router';

const url = 'http://localhost:8000/api/';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  public singleList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public allLists: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public comparison: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public allProjects: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public master: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public masterId: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  setSingleList(val) {
    if (val) {
      this.singleList.next(val);
    } else {
      this.singleList.next(null);
    }
  }

  setAllLists(val) {
    if (val) {
      this.allLists.next(val);
    } else {
      this.allLists.next(null);
    }
  }

  setComparison(val) {
    if (val) {
      this.comparison.next(val);
    } else {
      this.comparison.next(null);
    }
  }

  setAllProjects(val) {
    if (val) {
      this.allProjects.next(val);
    } else {
      this.allProjects.next(null);
    }
  }

  setMaster(val) {
    if (val) {
      this.master.next(val);
    } else {
      this.master.next(null);
    }
  }

  setMasterId(val) {
    if (val) {
      this.masterId.next(val);
    } else {
      this.masterId.next(null);
    }
  }

  public async getAllLists() {
    const observable = this.http.get<MaterialList[]>(url + 'lists');
    const materialLists = await observable.toPromise();

    if (materialLists) {
      this.setAllLists(materialLists.map((el) => {
          el.uploadDate = new Date(el.uploadDate);
          return el;
        })
      );
    }
  }

  public async getList(id: string) {
    const observable = this.http.get<MaterialList>(url + 'lists/' + id);
    const materialList = await observable.toPromise();

    if (materialList) {
      materialList.uploadDate = new Date(materialList.uploadDate);
    }

    this.setSingleList(materialList);
  }

  public deleteList(id: string): Observable<string> {
    return this.http.delete<string>(url + 'lists/' + id);
  }

  public insertList(materialList: MaterialList): Observable<MaterialList> {
    return this.http.post<MaterialList>(url + 'lists/', materialList);
  }

  public updateList(materialList: MaterialList): Observable<void> {
    return this.http.put<void>(url + 'lists/' + materialList.id, materialList);
  }

  public async compareLists(id1: string, id2: string) {
    const observable = this.http.get(`${url}lists/compare/${id1}/${id2}`);
    const comparison = await observable.toPromise();

    this.setComparison(comparison);
  }

  public createProject(projectData: Project) {
    const formData: FormData = new FormData();

    for (const prop in projectData) {
      if (prop !== 'bomLists') {
        formData.append(prop, projectData[prop]);
      }
    }

    const req = new HttpRequest('POST', url + 'projects', formData, {
      reportProgress: true
    });

    this.http.request(req).subscribe({
      error: err => console.error(`POST Error`, err),
      complete: () => {
        console.log(` POST new Project ${projectData.name} has been created`);
        this.getAllProjects();
      }
    });
  }

  public async getAllProjects() {
    const observable = this.http.get<Project[]>(url + 'projects');
    const projects = await observable.toPromise();

    if (projects) {
      this.setAllProjects(projects);
    }
  }

  public async createMaster(id: string) {
    const observable = this.http.get<string>(url + 'lists/create-master/' + id);
    const master = await observable.toPromise();

    if (master) {
      console.log(master);
    }
  }

  public async getLatestMaster() {
    const observable = this.http.get(url + 'lists/master');
    const master = await observable.toPromise();

    if (master) {
      this.setMaster(master);
    }
  }

  public async getLatestMasterId() {
    const observable = this.http.get(url + 'lists/master-id');
    const masterId = await observable.toPromise();

    if (masterId) {
      this.setMasterId(masterId);
    }
  }
}
