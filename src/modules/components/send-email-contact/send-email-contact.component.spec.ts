import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailContactComponent } from './send-email-contact.component';

describe('SendEmailContactComponent', () => {
  let component: SendEmailContactComponent;
  let fixture: ComponentFixture<SendEmailContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendEmailContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendEmailContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
