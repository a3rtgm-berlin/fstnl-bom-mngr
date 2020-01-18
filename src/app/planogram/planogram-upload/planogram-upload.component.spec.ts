import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanogramUploadComponent } from './planogram-upload.component';

describe('PlanogramUploadComponent', () => {
  let component: PlanogramUploadComponent;
  let fixture: ComponentFixture<PlanogramUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanogramUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanogramUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
