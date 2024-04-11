import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcuComponent } from './ecu.component';

describe('EcuComponent', () => {
  let component: EcuComponent;
  let fixture: ComponentFixture<EcuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EcuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
