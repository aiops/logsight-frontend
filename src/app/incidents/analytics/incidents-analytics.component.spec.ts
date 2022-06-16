import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsAnalyticsComponent } from './incidents-analytics.component';

describe('InsightsComponent', () => {
  let component: IncidentsAnalyticsComponent;
  let fixture: ComponentFixture<IncidentsAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentsAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
