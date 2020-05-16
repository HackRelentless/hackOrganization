import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveLogoComponent } from './interactive-logo.component';

describe('InteractiveLogoComponent', () => {
  let component: InteractiveLogoComponent;
  let fixture: ComponentFixture<InteractiveLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
