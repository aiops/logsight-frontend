import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationAnalyticsComponent } from './verification-analytics.component';

describe('InsightsComponent', () => {
  let component: VerificationAnalyticsComponent;
  let fixture: ComponentFixture<VerificationAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
