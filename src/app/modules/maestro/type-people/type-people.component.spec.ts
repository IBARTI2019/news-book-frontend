import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePeopleComponent } from './type-people.component';

describe('TypePeopleComponent', () => {
  let component: TypePeopleComponent;
  let fixture: ComponentFixture<TypePeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypePeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypePeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
