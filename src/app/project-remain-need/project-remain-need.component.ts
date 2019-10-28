import { Component, OnInit, Input } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { RestService } from '../services/rest/rest.service';
import { MaterialList } from '../materialListModel';
import { Project } from '../projectModel'
import $ from 'jquery';

@Component({
  selector: 'app-project-remain-need',
  templateUrl: './project-remain-need.component.html',
  styleUrls: ['./project-remain-need.component.scss']
})
export class ProjectRemainNeedComponent implements OnInit {

  allParts: any[];
  getLists: any[];
  allLists: any[];
  //public allPartLists: MaterialList[];
  allPartLists: any[];
  tryList: MaterialList[] = [];
  projectList: Project[] = [];
  projectValues: Project[];
  inWeeks: any;


  @Input() bom: any[] | null;
  @Input() projects: any[] | null;
  @Input() id: string | null;

  constructor( public restService: RestService) {
    this.restService.allProjects.subscribe((res) => {
      if (res) {
        this.projectList = res;
        this.setMetaValues(this.projectList);
      }
    });

    this.restService.singleList.subscribe((res) => {
      if (res) {
        this.tryList.push(res);
        this.createRMNTable(res);
      } 
    });
  }

  ngOnInit() {
    this.restService.getAllProjects();
    this.loadBomList();
  }

  loadBomList() {
    if (this.bom) {
      this.allParts = this.bom
      .map(d => d.Material)
      .reduce((res, part) => {
        return res.includes(part) ? res : [...res, part];
        }, []);
        
        this.allParts = this.allParts.map((str) => ({
          id: str,
          ovCount: 0,
          projects: {},
        }));

        this.getLists = this.bom.map(d => d.lists);
        const mergeLists =  [].concat.apply([], this.getLists);
        this.allPartLists = mergeLists.reduce((res, list) => {
          return res.includes(list) ? res : [...res, list];
        }, []);

        this.allPartLists.forEach(function (list) {
            //let matchList = list.substr(0, list.indexOf('-'));
            this.getListfromServer(list);
        }, this);
      }
    }

    getListfromServer(listId) {
      this.restService.getList(listId);
    }

    createRMNTable(list) {
      var target = list.project;
      var singleList = list.json;
        singleList.forEach(item => {
              let match = this.allParts.find(part => part.id === item.Material);
              if (match) {
                match.ovCount += item.Menge; 
                match.projects[target] = match.projects[target] ? match.projects[target] + item.Menge : item.Menge;
              }

        });
    }

    setMetaValues(incProjects) {

        this.projects = this.projects.map((str) => ({
          id: str,
          deadline: '',
          trainCount: 0,
          created:'',
          trainsPerWeek:0,
          trainsLeft:'',
          overallWeeks:0,
          weeksLeft:'',
        }));

        incProjects.forEach(function(project){
                  
          let match = this.projects.find(proj => proj.id === project.tag);
          
          if (match) {
            match.trainCount = project.trainsCount;
            match.deadline = project.deadline;
            match.created = project.created;
            match.overallWeeks = this.setMetaWeeks(project.created, project.deadline);
            match.weeksLeft = this.setWeeks(project.deadline);
            match.trainsPerWeek = Math.round((match.trainCount / match.overallWeeks) * 100) / 100;
            let helpWeeksDone = match.overallWeeks - match.weeksLeft;
            match.trainsLeft = project.trainsCount - (helpWeeksDone * match.trainsPerWeek);
          }

          console.log(match);
        }, this);
      }

      setWeeks(date) {
        let date1 = new Date(date);
        let date2 = new Date();
        let diffInWeeks =(date2.getTime() - date1.getTime()) / 1000;
        diffInWeeks /= (60 * 60 * 24 * 7);
        this.inWeeks = Math.abs(Math.round(diffInWeeks));
        return this.inWeeks;
      }

      setMetaWeeks(dateA, dateB) {
        let date1 = new Date(dateA);
        let date2 = new Date(dateB);
        let diffInWeeks =(date2.getTime() - date1.getTime()) / 1000;
        diffInWeeks /= (60 * 60 * 24 * 7);
        let totalWeeks = Math.abs(Math.round(diffInWeeks));
        return totalWeeks;
      }
}
