import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySelectDialogComponent } from './company-select-dialog.component';

describe('CompanySelectDialogComponent', () => {
  let component: CompanySelectDialogComponent;
  let fixture: ComponentFixture<CompanySelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySelectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
