import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterMapComponent } from './chapter-map.component';

describe('ChapterMapComponent', () => {
  let component: ChapterMapComponent;
  let fixture: ComponentFixture<ChapterMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChapterMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
