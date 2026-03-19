import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrcLawTextComponent } from './frc-law-text.component';

describe('FrcLawTextComponent', () => {
  let component: FrcLawTextComponent;
  let fixture: ComponentFixture<FrcLawTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrcLawTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrcLawTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
