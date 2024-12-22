import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadJournalComponent } from './upload-journal.component';

describe('UploadJournalComponent', () => {
  let component: UploadJournalComponent;
  let fixture: ComponentFixture<UploadJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadJournalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
