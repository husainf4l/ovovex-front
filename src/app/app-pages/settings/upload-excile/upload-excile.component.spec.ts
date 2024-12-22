import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadExcileComponent } from './upload-excile.component';

describe('UploadExcileComponent', () => {
  let component: UploadExcileComponent;
  let fixture: ComponentFixture<UploadExcileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadExcileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadExcileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
