import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixFilesComponent } from './matrix-files.component';

describe('MatrixFilesComponent', () => {
  let component: MatrixFilesComponent;
  let fixture: ComponentFixture<MatrixFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
