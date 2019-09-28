import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareOrdersComponent } from './compare-orders.component';

describe('CompareOrdersComponent', () => {
  let component: CompareOrdersComponent;
  let fixture: ComponentFixture<CompareOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
