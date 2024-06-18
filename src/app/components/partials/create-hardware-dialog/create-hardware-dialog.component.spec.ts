import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHardwareDialogComponent } from './create-hardware-dialog.component';

describe('CreateHardwareDialogComponent', () => {
  let component: CreateHardwareDialogComponent;
  let fixture: ComponentFixture<CreateHardwareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateHardwareDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateHardwareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
