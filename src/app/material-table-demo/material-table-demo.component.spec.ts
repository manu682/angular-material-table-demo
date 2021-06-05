import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTableDemoComponent } from './material-table-demo.component';

describe('MaterialTableDemoComponent', () => {
  let component: MaterialTableDemoComponent;
  let fixture: ComponentFixture<MaterialTableDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTableDemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTableDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
