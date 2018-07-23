import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BufferingComponent } from './buffering.component';

describe('BufferingComponent', () => {
  let component: BufferingComponent;
  let fixture: ComponentFixture<BufferingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BufferingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BufferingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
