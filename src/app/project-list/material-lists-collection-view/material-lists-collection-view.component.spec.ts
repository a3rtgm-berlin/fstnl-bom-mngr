import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialListsCollectionViewComponent } from './material-lists-collection-view.component';

describe('MaterialListsCollectionViewComponent', () => {
  let component: MaterialListsCollectionViewComponent;
  let fixture: ComponentFixture<MaterialListsCollectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialListsCollectionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialListsCollectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
