import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardadminestoqueComponent } from './dashboardadminestoque.component';

describe('DashboardadminestoqueComponent', () => {
  let component: DashboardadminestoqueComponent;
  let fixture: ComponentFixture<DashboardadminestoqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardadminestoqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardadminestoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
