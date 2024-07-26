import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureDetailsDialogComponent } from './architecture-details-dialog.component';

describe('ArchitectureDetailsDialogComponent', () => {
  let component: ArchitectureDetailsDialogComponent;
  let fixture: ComponentFixture<ArchitectureDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArchitectureDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchitectureDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
