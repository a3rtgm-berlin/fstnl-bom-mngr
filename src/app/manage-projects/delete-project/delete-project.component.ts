import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { RestService } from '../../services/rest/rest.service';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss'],
  host: {'class': 'modalparts'}
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
