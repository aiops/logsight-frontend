import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVerificationComponent } from './create-verification.component';

describe('CreateVerificationComponent', () => {
  let component: CreateVerificationComponent;
  let fixture: ComponentFixture<CreateVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
