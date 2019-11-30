import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionUploadComponent } from './consumption-upload.component';

describe('ConsumptionUploadComponent', () => {
  let component: ConsumptionUploadComponent;
  let fixture: ComponentFixture<ConsumptionUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumptionUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumptionUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
