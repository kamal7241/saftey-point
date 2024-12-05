import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeSecondaryStateStandardSizeXlComponent } from './type-secondary-state-standard-size-xl.component';

describe('TypeSecondaryStateStandardSizeXlComponent', () => {
  let component: TypeSecondaryStateStandardSizeXlComponent;
  let fixture: ComponentFixture<TypeSecondaryStateStandardSizeXlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeSecondaryStateStandardSizeXlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeSecondaryStateStandardSizeXlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
