import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialListViewComponent } from './material-list-view.component';

describe('MaterialListViewComponent', () => {
  let component: MaterialListViewComponent;
  let fixture: ComponentFixture<MaterialListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
