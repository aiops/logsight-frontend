import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationOverviewComponent } from './verification-overview.component';

describe('OverviewComponent', () => {
  let component: VerificationOverviewComponent;
  let fixture: ComponentFixture<VerificationOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
