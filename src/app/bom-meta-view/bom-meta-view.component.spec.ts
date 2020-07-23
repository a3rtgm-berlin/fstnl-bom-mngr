import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BomMetaViewComponent } from './bom-meta-view.component';

describe('BomMetaViewComponent', () => {
  let component: BomMetaViewComponent;
  let fixture: ComponentFixture<BomMetaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomMetaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomMetaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
