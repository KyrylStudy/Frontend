import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataStreamDialogComponent } from './data-stream-dialog.component';

describe('DataStreamDialogComponent', () => {
  let component: DataStreamDialogComponent;
  let fixture: ComponentFixture<DataStreamDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataStreamDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataStreamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
