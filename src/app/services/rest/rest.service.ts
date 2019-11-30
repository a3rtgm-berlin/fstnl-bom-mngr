import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { MaterialList } from '../../materialListModel';
import { Project } from '../../projectModel';
import { User } from '../../userModel';
import { Router } from '@angular/router';
import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
import { MasterBom } from 'src/app/masterBom';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { LoaderService } from '../loader/loader.service';

const url = 'http://localhost:8000/api/';
// const url = 'http://91.250.112.78:49160/api/';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  authToken: any;
  user: any;

  constructor(private http: HttpClient, private loader: LoaderService) { }

  public singleList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public allLists: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public projectBomMeta: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public comparison: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public allProjects: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public allMaster: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public master: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public masterId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public excludeList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public arbMatrix: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public rpn: BehaviorSubject<any> = new BehaviorSubject<any>(null);

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

  setProjectBomMeta(val) {
    if (val) {
      this.projectBomMeta.next(val);
    } else {
      this.projectBomMeta.next(null);
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

  setAllMaster(val) {
    if (val) {
      this.allMaster.next(val);
    } else {
      this.allMaster.next(null);
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

  public deleteList(id: string) {
    console.log(id);
    const observable = this.http.delete<string>(url + 'lists/' + id);
    observable.subscribe(
      (val) => console.log('DELETE call successful value returned in body', val),
      err => console.error('DELETE call in error', err),
      () => this.getAllProjects()
    );
  }

  public insertList(materialList: MaterialList): Observable<MaterialList> {
    return this.http.post<MaterialList>(url + 'lists/', materialList);
  }

  public replaceList(materialList: MaterialList): Observable<void> {
    return this.http.put<void>(url + 'lists/' + materialList.id, materialList);
  }

  public updateList(id: string) {
    const observable = this.http.get<string>(url + 'lists/update/' + id);
    observable.subscribe({
      complete() { alert(`${id} has been successfully updated`); }
    });
  }

  public getSingleBomMeta(id: string) {
    return this.http.get(url + 'lists/meta/' + id);
  }

  public async getProjectBomMeta(tag: string) {
    this.loader.showLoader(true);
    const observable = this.http.get(url + 'project/meta/' + tag);
    const meta: any = await observable.toPromise();

    if (meta) {
      meta.forEach(bom => {
        bom.uploadDate =new Date(bom.uploadDate);
      });
      this.setProjectBomMeta(meta);
    }
    this.loader.hideLoader();
  }

  public async createMultiBomFromIds(ids: string[]) {
    const observable = this.http.post(url + 'lists/multibom', {lists: ids});

    observable.subscribe({
      error: err => console.log(err),
      complete: () => console.log('merged'),
    });
  }

  public async compareLists(id1: string, id2: string) {
    this.loader.showLoader(true);
    const observable = this.http.get(`${url}master/compare/${id1}/${id2}`);
    const comparison = await observable.toPromise();

    this.setComparison(comparison);
    this.loader.hideLoader();
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

  public createUser(userData: User) {
    const formData: FormData = new FormData();

    for (const prop in userData) {
      if (userData[prop]) {
        formData.append(prop, userData[prop]);
      }
    }

    const observable = this.http.post<User>(url + 'users/', userData);
    observable.subscribe(
      (val) => console.log('User successfully created'),
      err => console.error('Error in User Creation', err),
      () => console.log('User created')
    );
  }

  public deleteProject(tag: string) {
    const observable = this.http.delete<string>(url + 'projects/' + tag);
    observable.subscribe(
      (val) => console.log('DELETE call successful value returned in body', val),
      err => console.error('DELETE call in error', err),
      () => this.getAllProjects()
    );
  }

  public updateProjectVal(project: any) {
    const observable = this.http.post(url + 'projects/' + project.tag, project);
    observable.subscribe(
      (val) => console.log('Update call successful value', val),
      err => {console.error('Error in Update Call', err); this.getAllProjects()},
      () => this.getAllProjects()
    );
  }

  public async getAllProjects() {
    this.loader.showLoader(true);
    const observable = this.http.get<Project[]>(url + 'projects');
    const projects = await observable.toPromise();

    if (projects) {
      this.setAllProjects(projects);
      console.log(projects);
    }
    this.loader.hideLoader();
  }

  public async createMaster(id: string) {
    this.loader.showLoader(true);

    const observable = this.http.get(url + 'master/create/' + id);
    const masterId = await observable.toPromise();

    if (masterId) {
      this.setMasterId(masterId);
    }
    this.loader.hideLoader();
  }

  public async rebuildMaster(id: string) {
    this.loader.showLoader(true);

    const observable = this.http.get(url + 'master/rebuild/' + id);
    const masterId = await observable.toPromise();

    if (masterId) {
      this.setMasterId(masterId);
      this.getAllProjects();
    }
    this.loader.hideLoader();
  }

  public async getMasterById(id: string) {
    this.loader.showLoader(true, 800);
    const observable = this.http.get<MasterBom>(url + 'master/get/' + id);
    const master = await observable.toPromise();

    if (master) {
      master.uploadDate = new Date(master.uploadDate);
      this.setMaster(master);
    }
    this.loader.hideLoader();
  }


  public async getLatestMaster() {
    this.loader.showLoader(true, 800);
    const observable = this.http.get(url + 'master');
    const master = await observable.toPromise();

    if (master) {
      this.setMaster(master);
    }
    this.loader.hideLoader();
  }

  public async getLatestMasterId() {
    const observable = this.http.get(url + 'master/id');
    const masterId = await observable.toPromise();

    if (masterId) {
      this.setMasterId(masterId);
    }
  }

  public async getAllMaster() {
    this.loader.showLoader(true, 1200);
    const observable = this.http.get<MaterialList[]>(url + 'master/all');
    const masterLists = await observable.toPromise();

    if (masterLists) {
      this.setAllMaster(masterLists);
    }
    this.loader.hideLoader();
  }

  public deleteMaster(id: string) {
    const observable = this.http.delete<string>(url + 'master/delete/' + id);
    observable.subscribe({
      complete() {
        alert(`MasterBOM with ID ${id} has been deleted.`);
        this.getLatestMasterId();
      }
    });
  }

  public async getExclude() {
    const observable = this.http.get(url + 'exclude');

    observable.subscribe(res => {
      this.excludeList.next(res);
    });
  }

  public async getMatrix() {
    const observable = this.http.get(url + 'matrix');

    observable.subscribe(res => {
      this.arbMatrix.next(res);
    });
  }

  public async getRPN(id: string) {
    const observable = this.http.get<string>(url + 'rpn/create/' + id);

    observable.subscribe(res => {
      this.rpn.next(res);
    });
  }
}
