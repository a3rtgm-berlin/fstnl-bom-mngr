import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from 'src/app/services/modal/modal.service';
import { RestService } from 'src/app/services/rest/rest.service';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss']
})
export class DeleteProjectComponent implements OnInit {

  @Input() projectTag: string;

  constructor(public modalService: ModalService, public restService: RestService) { }

  ngOnInit() {
  }

  public submit() {
    this.restService.deleteProject(this.projectTag);
    this.modalService.destroy();
  }

  public close() {
    this.modalService.destroy();
  }

}
