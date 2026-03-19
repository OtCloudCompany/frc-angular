import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrcSummaryComponent } from './frc-summary.component';

describe('FrcSummaryComponent', () => {
  let component: FrcSummaryComponent;
  let fixture: ComponentFixture<FrcSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrcSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrcSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
