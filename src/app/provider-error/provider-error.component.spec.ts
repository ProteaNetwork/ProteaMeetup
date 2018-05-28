import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderErrorComponent } from './provider-error.component';

describe('ProviderErrorComponent', () => {
  let component: ProviderErrorComponent;
  let fixture: ComponentFixture<ProviderErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
