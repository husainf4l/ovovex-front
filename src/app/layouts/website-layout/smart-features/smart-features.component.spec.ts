import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartFeaturesComponent } from './smart-features.component';

describe('SmartFeaturesComponent', () => {
  let component: SmartFeaturesComponent;
  let fixture: ComponentFixture<SmartFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
