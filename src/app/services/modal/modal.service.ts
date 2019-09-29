import { Injectable } from '@angular/core';
import { DomService } from '../dom/dom.service';
import $ from 'jquery';

@Injectable()
export class ModalService {

  constructor(private domService: DomService) { }

  private modalElementId = '#modal-container';
  private overlayElementId = '#overlay';

  init(component: any, inputs: object, outputs: object, host?: any, overlay: boolean = true) {
    const componentConfig = {
      inputs: inputs,
      outputs: outputs
    };

    this.domService.appendComponentTo(this.modalElementId, component, componentConfig);
    $(host ? host.nativeElement : this.modalElementId).addClass('show').removeClass('hidden');
    if (overlay) { $(this.overlayElementId).addClass('show').removeClass('hidden'); }
  }

  destroy(host?: any) {
    this.domService.removeComponent();
    $(host ? host.nativeElement : this.modalElementId).addClass('hidden');
    $(this.overlayElementId).addClass('hidden').removeClass('show');
  }
}