import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef
} from '@angular/core';
import $ from 'jquery';

@Injectable()
export class DomService {

  private childComponentRef: any;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  public appendComponentTo(parent: any, child: any, childConfig?: ChildConfig) {
    // Create a component reference from the component
    const childComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(child)
      .create(this.injector);

    // Attach the config to the child (inputs and outputs)
    this.attachConfig(childConfig, childComponentRef);

    this.childComponentRef = childComponentRef;
    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(childComponentRef.hostView);

    // Get DOM element from component
    const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // Append DOM element to the body
    $(parent).append($(childDomElem));

  }

  public removeComponent() {
    if (this.childComponentRef) {
      this.appRef.detachView(this.childComponentRef.hostView);
      this.childComponentRef.destroy();
    }
  }


  private attachConfig(config, componentRef) {
    const inputs = config.inputs;
    const outputs = config.outputs;

    for (const key in inputs) {
      if (inputs[key]) {
        componentRef.instance[key] = inputs[key];
      }
    }
    for (const key in outputs) {
      if (outputs[key]) {
        componentRef.instance[key] = outputs[key];
      }
    }
  }
}

interface ChildConfig {
  inputs: object;
  outputs: object;
}
