import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCheckTicketComponent } from './user-check-ticket.component';

describe('UserCheckTicketComponent', () => {
  let component: UserCheckTicketComponent;
  let fixture: ComponentFixture<UserCheckTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCheckTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCheckTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
