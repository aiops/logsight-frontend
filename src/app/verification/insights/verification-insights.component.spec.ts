import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationInsightsComponent } from './verification-insights.component';

describe('InsightsComponent', () => {
  let component: VerificationInsightsComponent;
  let fixture: ComponentFixture<VerificationInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationInsightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
