import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePrintComponent } from './invoice-print.component';

describe('InvoicePrintComponent', () => {
  let component: InvoicePrintComponent;
  let fixture: ComponentFixture<InvoicePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicePrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
