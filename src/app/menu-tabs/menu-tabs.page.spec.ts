import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTabsPage } from './menu-tabs.page';

describe('MenuTabsPage', () => {
  let component: MenuTabsPage;
  let fixture: ComponentFixture<MenuTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuTabsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
