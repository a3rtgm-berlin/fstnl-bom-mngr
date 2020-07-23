import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterlistviewComponent } from './masterlistview.component';

describe('MasterlistviewComponent', () => {
  let component: MasterlistviewComponent;
  let fixture: ComponentFixture<MasterlistviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterlistviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterlistviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
