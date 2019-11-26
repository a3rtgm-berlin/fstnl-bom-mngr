import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../services/modal/modal.service';
import { ExportService } from '../services/export/export.service';

@Component({
  selector: 'app-bom-meta-view',
  templateUrl: './bom-meta-view.component.html',
  styleUrls: ['./bom-meta-view.component.scss'],
  host: {'class': 'modalparts'}
})
export class BomMetaViewComponent implements OnInit {

  @Input() meta: any;

  constructor(
    public modalService: ModalService,
    public exportService: ExportService,
  ) { }

  ngOnInit() {
  }

  public close() {
    this.modalService.destroy();
  }

  public download() {
    this.exportService.xlsxFromJson(this.meta, `${this.meta.id}-Meta`);
    this.modalService.destroy();
  }

}
