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

    this.domService.appendComponentTo(host ? host.nativeElement : this.modalElementId, component, componentConfig);
    switch (typeof host) {
      case 'string':
        $(host).addClass('show').removeClass('hidden');
        break;
      case 'object':
        $(host.nativeElement).addClass('show').removeClass('hidden');
        break;
      default:
        $(this.modalElementId).addClass('show').removeClass('hidden');
        break;
    }
    if (overlay) { $(this.overlayElementId).addClass('show').removeClass('hidden'); }
  }

  destroy(host?: any) {
    this.domService.removeComponent();
    switch (typeof host) {
      case 'string':
        $(host).addClass('hidden').removeClass('show');
        break;
      case 'object':
        $(host.nativeElement).addClass('hidden').removeClass('show');
        break;
      default:
        $(this.modalElementId).addClass('hidden').removeClass('show');
        break;
    }
    $(this.overlayElementId).addClass('hidden').removeClass('show');
  }
}