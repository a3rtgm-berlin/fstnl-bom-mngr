import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { RestService } from '../services/rest/rest.service';
import { MaterialList } from '../materialListModel';
import { Project } from '../projectModel'
import $ from 'jquery';
import { ExportService } from '../services/export/export.service';

@Component({
  selector: 'app-project-remain-need',
  templateUrl: './project-remain-need.component.html',
  styleUrls: ['./project-remain-need.component.scss']
})
export class ProjectRemainNeedComponent implements OnInit {

  getLists: any[];
  allLists: any[];
  allPartLists: any[];
  tryList: MaterialList[] = [];
  tryList$: MaterialList[] = [];
  projectList: Project[] = [];
  projectList$: Project[] = [];
  projectValues: Project[];
  inWeeks: any;
  bom$: any;
  processedBom: any;


  @ViewChild('filterCol', {static: false}) filterCol: any;
  @Input() bom: any[] | null;
  @Input() projects: any[] | null;
  @Input() id: string | null;
  @Input() allParts: any[];

  constructor( public restService: RestService, public exportService: ExportService) {
    this.restService.allProjects.subscribe(async res => {
      if (res) {
        this.projectList = res;
        await this.setMetaValues(this.projectList);
      }
    });

    this.restService.singleList.subscribe(async res => {
      if (res) {
        this.tryList.push(res);
        await this.createRPNTable(res);
      } 
    });
  }

  ngOnInit() {
    this.loadBomList();
    this.restService.getAllProjects();
    //this.setMetaValues(this.projectList);
    //this.createRMNTable(this.tryList);
  }

  loadBomList() {
    if (this.bom) {
      this.bom$ = this.bom;
      this.allParts = this.bom
        .map(d => d.Material)
        .reduce((res, part) => {
          return res.includes(part) ? res : [...res, part];
          }, []);

      this.allParts = this.allParts.map((str) => ({
        id: str,
        name: '',
        ovCount: 0,
        projects: {},
      }));

      this.getLists = this.bom.map(d => d.lists);
      const mergeLists =  [].concat.apply([], this.getLists);
      this.allPartLists = mergeLists.reduce((res, list) => {
        return res.includes(list) ? res : [...res, list];
      }, []);

      this.allPartLists.forEach(function(list) {
        // let matchList = list.substr(0, list.indexOf('-'));
        this.getListfromServer(list);
      }, this);
    }
  }

    getListfromServer(listId) {
      this.restService.getList(listId);
    }

    createRPNTable(list) {
      const target = list.project;
      const singleList = list.json;

      singleList.forEach(item => {
            const match = this.allParts.find(part => part.id === item.Material);
            if (match) {
              match.ovCount += item.Menge;
              match.name = item.Objektkurztext;
              match.projects[target] = match.projects[target] ? match.projects[target] + item.Menge : item.Menge;
            }

      });
    }

    setMetaValues(incProjects) {

        this.projects = this.projects.map((str) => ({
          id: str,
          deadline: '',
          trainCount: 0,
          created: '',
          trainsPerWeek: 0,
          trainsLeft: '',
          overallWeeks: 0,
          weeksLeft: '',
        }));

        incProjects.forEach(function(project){

          const match = this.projects.find(proj => proj.id === project.tag);

          if (match) {
            match.trainCount = project.trainsCount;
            match.deadline = project.deadline;
            match.created = project.created;
            match.overallWeeks = this.setMetaWeeks(project.created, project.deadline);
            match.weeksLeft = this.setWeeks(project.deadline);
            match.trainsPerWeek = Math.round((match.trainCount / match.overallWeeks) * 100) / 100;

            const helpWeeksDone = match.overallWeeks - match.weeksLeft;

            match.trainsLeft = project.trainsCount - (helpWeeksDone * match.trainsPerWeek);
          }

          console.log(match);
        }, this);
      }

      setWeeks(date) {
        const date1 = new Date(date);
        const date2 = new Date();

        let diffInWeeks = (date2.getTime() - date1.getTime()) / 1000;
        diffInWeeks /= (60 * 60 * 24 * 7);
        this.inWeeks = Math.abs(Math.round(diffInWeeks));

        return this.inWeeks;
      }

      setMetaWeeks(dateA, dateB) {
        const date1 = new Date(dateA);
        const date2 = new Date(dateB);

        let diffInWeeks = (date2.getTime() - date1.getTime()) / 1000;
        diffInWeeks /= (60 * 60 * 24 * 7);

        const totalWeeks = Math.abs(Math.round(diffInWeeks));

        return totalWeeks;
      }

      downloadRPN() {
        this.exportService.xlsxFromJson(this.allParts, `RPN-${this.id}`);
      }

      filterBom(val) {
        if (val !== '' && this.bom$) {
          this.processedBom = this.bom$.filter((row) => {
            return row[this.filterCol.nativeElement.value].toString().includes(val);
          });
        } else {
          this.processedBom = this.bom$;
        }
      }

      addSort(cat, evt) {
        if ($(evt.target).siblings().hasClass('filter')) {
          if ($(evt.target).siblings().hasClass('filter2')) {
            const cat1 = $(evt.target).siblings('.filter').data('sort');
            const cat2 = $(evt.target).siblings('.filter2').data('sort');

            $(evt.target).addClass('filter3');
            this.bom$.sort(this.dynamicSort(cat1, cat2, cat));

          } else {
            const cat1 = $(evt.target).siblings('.filter').data('sort');
            $(evt.target).addClass('filter2');
            $(evt.target).data('sort', cat);
            this.bom$.sort(this.dynamicSort(cat1, cat));

          }
        } else if ($(evt.target).hasClass('filter2') || $(evt.target).hasClass('filter') || $(evt.target).hasClass('filter3')) {
            if ($(evt.target).hasClass('filter')) {
              $(evt.target).removeClass('filter');
              $(evt.target).siblings('.filter2').addClass('filter').removeClass('filter2');
              $(evt.target).siblings('.filter3').addClass('filter2').removeClass('filter3');

              const cat1 = $(evt.target).siblings('filter').data('sort');
              const cat2 = $(evt.target).siblings('filter2').data('sort');
              this.bom$.sort(this.dynamicSort(cat1, cat2));

            } else if ($(evt.target).hasClass('filter2')) {
                $(evt.target).removeClass('filter2');
                $(evt.target).siblings('.filter3').addClass('filter2').removeClass('filter3');
                const cat1 = $(evt.target).siblings('filter').data('sort');
                const cat2 = $(evt.target).siblings('filter2').data('sort');
                this.bom$.sort(this.dynamicSort(cat1, cat2));

            } else if ($(evt.target).hasClass('filter3')) {
                $(evt.target).removeClass('filter3');
                const cat1 = $(evt.target).siblings('filter').data('sort');
                const cat2 = $(evt.target).siblings('filter2').data('sort');
                this.bom$.sort(this.dynamicSort(cat1, cat2));
            }

        } else {
          $(evt.target).addClass('filter');
          $(evt.target).data('sort', cat);
          this.bom$.sort(this.dynamicSort(cat));
        }

        this.processedBom = this.bom$;
      }

      dynamicSort(...props) {
        const args = arguments;

        return (a, b) => {
          const result = a[args[0]] < b[args[0]] ? -1 : a[args[0]] > b[args[0]] ? 1 : 0 || a[args[1]] < b[args[1]] ? -1 : a[args[1]] > b[args[1]] ? 1 : 0 || a[args[2]] < b[args[2]] ? -1 : a[args[2]] > b[args[2]] ? 1 : 0;

          return result;
        }
      }
}
