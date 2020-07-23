import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRemainNeedComponent } from './project-remain-need.component';

describe('ProjectRemainNeedComponent', () => {
  let component: ProjectRemainNeedComponent;
  let fixture: ComponentFixture<ProjectRemainNeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRemainNeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRemainNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
