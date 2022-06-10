import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsInsightsComponent } from './incidents-insights.component';

describe('InsightsComponent', () => {
  let component: IncidentsInsightsComponent;
  let fixture: ComponentFixture<IncidentsInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentsInsightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
