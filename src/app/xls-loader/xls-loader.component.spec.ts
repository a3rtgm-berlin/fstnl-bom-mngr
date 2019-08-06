import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XlsLoaderComponent } from './xls-loader.component';

describe('XlsLoaderComponent', () => {
  let component: XlsLoaderComponent;
  let fixture: ComponentFixture<XlsLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XlsLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XlsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
