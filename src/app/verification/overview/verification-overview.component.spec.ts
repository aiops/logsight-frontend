import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { VerificationOverviewComponent } from './verification-overview.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { VerificationService } from '../services/verification.service';
import { Router } from '@angular/router';
import { VerificationSharingService } from '../services/verification-sharing.service';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { NbTagModule, NbThemeModule } from '@nebular/theme';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';
import { PagesModule } from '../../pages/pages.module';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Status } from '../../incidents/models/status.enum';
import { MockModule, MockProvider } from 'ng-mocks';

describe('OverviewComponent', () => {
  let component: VerificationOverviewComponent;
  let fixture: ComponentFixture<VerificationOverviewComponent>;
  let template: DebugElement;
  let verificationServiceSpy = jasmine.createSpyObj('VerificationService', ['getOverview', 'delete', 'changeStatus']);
  // let confirmationServiceSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,                                                                                                                 
        FormsModule,
        BrowserAnimationsModule,
        CardModule,
        TableModule, 
        CheckboxModule,
        MultiSelectModule,
        ConfirmDialogModule,
        DropdownModule,
        SliderModule,
        OverlayPanelModule,
        // RouterTestingModule
        NbTagModule,  
        NbThemeModule.forRoot({ name: 'default' }),
      ],
      declarations: [ VerificationOverviewComponent, Table ],
      providers: [
        { provide: VerificationService, useValue: verificationServiceSpy },
        { provide: Router, useValue: null },
        { 
          provide: VerificationSharingService, 
          useValue: { currentData: of(''), setData: () => { return; } }
        },
        ConfirmationService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationOverviewComponent);
    component = fixture.componentInstance;
    template = fixture.debugElement;

    let getOverviewResponse = of([
      {
        compareId: "111",
        baselineTags: [
            "version:v1.0.0",
            "applicationName:resource_manager"
        ],
        candidateTags: [
            "version:v1.1.0",
            "applicationName:resource_manager"
        ],
        risk: 85,
        severity: 3,
        status: 1,
        timestamp: "2022-06-13T00:00:00.000Z",
        selected: false
      },
      {
        compareId: "222",
        baselineTags: [
          "applicationName:hdfs_node"
        ],
        candidateTags: [
          "version:v1.1.0",
          "applicationName:name_node"
        ],
        risk: 88,
        severity: 3,
        status: 1,
        timestamp: "2022-07-12T16:07:07.376Z",
        selected: false
      },
    ])

    verificationServiceSpy.getOverview.and.returnValue(getOverviewResponse);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#statusChanged changes the selected item status', fakeAsync(() => {
    verificationServiceSpy.changeStatus.and.returnValue(of(null));

    fixture.detectChanges();
    tick();

    fixture.componentInstance.ngAfterViewInit();
    tick();

    fixture.detectChanges();

    let compareIdTrimmed = template.query(By.css('.compare-id p')).nativeElement.textContent as string;
    let item = component.items.find(item => item.compareId.startsWith(compareIdTrimmed));

    expect(item.status).toBe(Status.Raised);

    let statusSelect = template.query(By.css('tbody .p-dropdown div'));
    statusSelect.nativeElement.click();

    fixture.detectChanges();
    tick();

    let assignedStatusDropdownItem = template.query(By.css('p-dropdownitem li[aria-label="Assigned"]'));
    assignedStatusDropdownItem.nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(verificationServiceSpy.changeStatus).toHaveBeenCalled();
    expect(item.status).toBe(Status.Assigned);

    flush();
  }));

  it('#getOverview adds records to the table', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    fixture.componentInstance.ngAfterViewInit();
    tick();

    fixture.detectChanges();

    let rows = template.queryAll(By.css('tbody tr'));

    expect(verificationServiceSpy.getOverview).toHaveBeenCalled();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBe(component.items.length);
    expect(component.items[0].compareId).toBe('111');
  }));

  it('selecting table elements works', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    fixture.componentInstance.ngAfterViewInit();
    tick();

    fixture.detectChanges();

    let firstItemCheckbox = template.query(By.css('p-checkbox input'));
    firstItemCheckbox.nativeElement.click();

    fixture.detectChanges();
    tick();
    
    expect(fixture.componentInstance.selectedItems.length).toBeGreaterThan(0);
  }));

  it('delete button can\'t be pressed when there are no selected items', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    fixture.componentInstance.ngAfterViewInit();
    tick();

    fixture.detectChanges();

    spyOn(component, 'deleteItems');
    let deleteBtn = template.query(By.css('#delete-btn'));

    expect(deleteBtn.nativeElement.click).toThrowError();
    expect(deleteBtn.nativeElement.getAttribute('disabled')).toBe('');
    expect(component.deleteItems).not.toHaveBeenCalled();
  }));

  it('pressing delete button calls deleteItems() when there are selected elements', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    fixture.componentInstance.ngAfterViewInit();
    tick();

    fixture.detectChanges();
    
    spyOn(component, 'deleteItems');

    let firstItemCheckbox = template.query(By.css('p-checkbox input'));
    firstItemCheckbox.nativeElement.click();
    
    fixture.detectChanges();
    tick();
    
    let deleteBtn = template.query(By.css('#delete-btn'));
    expect(deleteBtn.nativeElement.getAttribute('disabled')).toBeNull();

    deleteBtn.nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(component.deleteItems).toHaveBeenCalled();
  }));

  it('pressing delete button deletes an item', fakeAsync(() => {
    // Arrange
    fixture.detectChanges();
    tick();

    verificationServiceSpy.delete.and.returnValue(of(null));

    let initialItemsLength = component.items.length;
    let selectedItem = component.items[0];

    component.selectedItems.push(selectedItem);

    fixture.detectChanges();
    tick();
    
    // Act
    let deleteBtn = template.query(By.css('#delete-btn'));
    deleteBtn.nativeElement.click();

    fixture.detectChanges();
    tick();

    let acceptButton = template.query(By.css('.p-confirm-dialog-accept'));
    acceptButton.nativeElement.click();

    fixture.detectChanges();
    tick();

    // Assert
    expect(verificationServiceSpy.delete).toHaveBeenCalled();
    
    expect(component.items).not.toContain(selectedItem);
    expect(component.items.length).toBe(initialItemsLength - 1);
  }));
});
