import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAndEditTypePeopleComponent } from './create-and-edit-type-people.component';

describe('CreateAndEditTypePeopleComponent', () => {
  let component: CreateAndEditTypePeopleComponent;
  let fixture: ComponentFixture<CreateAndEditTypePeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAndEditTypePeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAndEditTypePeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
