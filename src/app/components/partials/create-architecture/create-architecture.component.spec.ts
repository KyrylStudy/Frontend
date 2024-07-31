import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArchitectureComponent } from './create-architecture.component';

describe('CreateArchitectureComponent', () => {
  let component: CreateArchitectureComponent;
  let fixture: ComponentFixture<CreateArchitectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateArchitectureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateArchitectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
