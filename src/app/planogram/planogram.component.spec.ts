import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanogramComponent } from './planogram.component';

describe('PlanogramComponent', () => {
  let component: PlanogramComponent;
  let fixture: ComponentFixture<PlanogramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanogramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
