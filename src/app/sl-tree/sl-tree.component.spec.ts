import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlTreeComponent } from './sl-tree.component';

describe('SlTreeComponent', () => {
  let component: SlTreeComponent;
  let fixture: ComponentFixture<SlTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
