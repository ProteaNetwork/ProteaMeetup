import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrManagerComponent } from './qr-manager.component';

describe('QrManagerComponent', () => {
  let component: QrManagerComponent;
  let fixture: ComponentFixture<QrManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
