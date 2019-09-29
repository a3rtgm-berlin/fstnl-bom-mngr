import { Injectable } from '@angular/core';
import { DomService } from '../dom/dom.service';

@Injectable()
export class ModalService {

  constructor(private domService: DomService) { }

  private modalElementId = 'modal-container';
  private overlayElementId = 'overlay';

  init(component: any, inputs: object, outputs: object, id = 'modal-container', overlay = true) {
    const componentConfig = {
      inputs: inputs,
      outputs: outputs
    };

    this.domService.appendComponentTo(id, component, componentConfig);
    document.getElementById(id).className = 'show';

    if (overlay)
      document.getElementById(this.overlayElementId).className = 'show';
  }

  destroy(id = 'modal-container') {
    this.domService.removeComponent();
    document.getElementById(id).className = 'hidden';
    document.getElementById(this.overlayElementId).className = 'hidden';
  }
}