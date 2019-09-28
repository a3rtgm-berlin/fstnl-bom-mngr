import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonRowViewComponent } from './comparison-row-view.component';

describe('ComparisonRowViewComponent', () => {
  let component: ComparisonRowViewComponent;
  let fixture: ComponentFixture<ComparisonRowViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonRowViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonRowViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
