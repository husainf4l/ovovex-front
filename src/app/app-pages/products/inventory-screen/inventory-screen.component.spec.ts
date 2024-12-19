import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryScreenComponent } from './inventory-screen.component';

describe('InventoryScreenComponent', () => {
  let component: InventoryScreenComponent;
  let fixture: ComponentFixture<InventoryScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
