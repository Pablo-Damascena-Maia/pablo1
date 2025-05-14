import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitacaoComponent } from './visitacao.component';

describe('VisitacaoComponent', () => {
  let component: VisitacaoComponent;
  let fixture: ComponentFixture<VisitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
