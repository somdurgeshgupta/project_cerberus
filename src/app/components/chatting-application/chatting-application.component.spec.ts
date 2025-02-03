import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattingApplicationComponent } from './chatting-application.component';

describe('ChattingApplicationComponent', () => {
  let component: ChattingApplicationComponent;
  let fixture: ComponentFixture<ChattingApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChattingApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChattingApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
