import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBooksComponent } from './mybooks.component';

describe('MybooksComponent', () => {
  let component: MyBooksComponent;
  let fixture: ComponentFixture<MyBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyBooksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
