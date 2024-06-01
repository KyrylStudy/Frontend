import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusDialogComponent } from './bus-dialog.component';

describe('BusDialogComponent', () => {
  let component: BusDialogComponent;
  let fixture: ComponentFixture<BusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
