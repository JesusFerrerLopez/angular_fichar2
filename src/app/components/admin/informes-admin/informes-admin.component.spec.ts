import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesAdminComponent } from './informes-admin.component';

describe('InformesAdminComponent', () => {
  let component: InformesAdminComponent;
  let fixture: ComponentFixture<InformesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
