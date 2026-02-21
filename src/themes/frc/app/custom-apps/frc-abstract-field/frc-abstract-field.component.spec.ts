import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrcAbstractFieldComponent } from './frc-abstract-field.component';

describe('FrcAbstractFieldComponent', () => {
  let component: FrcAbstractFieldComponent;
  let fixture: ComponentFixture<FrcAbstractFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrcAbstractFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrcAbstractFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
