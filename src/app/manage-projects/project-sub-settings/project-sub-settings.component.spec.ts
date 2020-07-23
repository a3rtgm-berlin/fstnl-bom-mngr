import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSubSettingsComponent } from './project-sub-settings.component';

describe('ProjectSubSettingsComponent', () => {
  let component: ProjectSubSettingsComponent;
  let fixture: ComponentFixture<ProjectSubSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSubSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSubSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
