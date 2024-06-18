import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServiceInfrastructureDialogComponent } from './create-service-infrastructure-dialog.component';

describe('CreateServiceInfrastructureDialogComponent', () => {
  let component: CreateServiceInfrastructureDialogComponent;
  let fixture: ComponentFixture<CreateServiceInfrastructureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateServiceInfrastructureDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateServiceInfrastructureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
