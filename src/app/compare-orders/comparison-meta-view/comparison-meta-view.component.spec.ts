import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonMetaViewComponent } from './comparison-meta-view.component';

describe('ComparisonMetaViewComponent', () => {
  let component: ComparisonMetaViewComponent;
  let fixture: ComponentFixture<ComparisonMetaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonMetaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonMetaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
