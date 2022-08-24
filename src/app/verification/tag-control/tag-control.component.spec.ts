import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbFocusMonitor, NbTagModule, NbThemeModule } from '@nebular/theme';
import { MockModule, MockProvider } from 'ng-mocks';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { of } from 'rxjs';
import { ApiService } from '../../@core/service/api.service';
import { TagType } from '../models/tag.model';
import { VerificationService } from '../services/verification.service';

import { TagControlComponent } from './tag-control.component';

describe('TagControlComponent', () => {
  let component: TagControlComponent;
  let fixture: ComponentFixture<TagControlComponent>;
  let template: DebugElement;

  let apiServiceSpy = jasmine.createSpyObj('ApiService', ['handleNotification']);

  let availableTagKeys = { tagKeys: [
    {
        tagName: "applicationName",
        tagCount: 33
    },
    {
        tagName: "version",
        tagCount: 44
    }
  ]};

  let availableTagValues = { tagValues: [
    {
        tagName: "applicationName",
        tagValue: "hdfs_node",
        tagCount: 22
    },
    {
        tagName: "applicationName",
        tagValue: "name_node",
        tagCount: 11
    }
  ]};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DropdownModule,
        NbTagModule,
        NbThemeModule.forRoot({ name: 'default' }),
        MockModule(FormsModule),
        MockModule(TooltipModule),
        MockModule(BrowserAnimationsModule)
      ],
      declarations: [ TagControlComponent ],
      providers: [
        MockProvider(VerificationService, {
          loadAvailableTagKeys: () => of(availableTagKeys),
          loadTagValueForKey: () => of(availableTagValues)
        }),
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagControlComponent);
    component = fixture.componentInstance;
    template = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display tag type', () => {
    component.tagType = TagType.Baseline;
    fixture.detectChanges();

    let tagTypeText = template.query(By.css('.tag-type')).nativeElement.textContent as string;
    expect(tagTypeText.trim()).toBe('Baseline tags');
  });

  it('selecting a value from the dropdowns adds a new tag', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    
    let tagNameDropdown = template.query(By.css('p-dropdown[optionlabel="tagName"] div'));
    tagNameDropdown.nativeElement.click();

    fixture.detectChanges();
    tick();

    let tagNameOption = template.query(By.css('p-dropdown[optionlabel="tagName"] p-dropdownitem li'));
    tagNameOption.nativeElement.click();

    fixture.detectChanges();
    tick();
    
    fixture.detectChanges();
    tick();

    let tagValueDropdown = template.query(By.css('p-dropdown[optionlabel="tagValue"] div'));
    tagValueDropdown.nativeElement.click();

    fixture.detectChanges();
    tick();

    let tagValueOption = template.query(By.css('p-dropdown[optionlabel="tagValue"] p-dropdownitem li'));
    tagValueOption.nativeElement.click();

    let addBtn = template.query(By.css('.add-tag'));
    addBtn.nativeElement.click();

    fixture.detectChanges();
    tick();

    let tag = template.query(By.css('nb-tag'));
    expect((tag.nativeElement.textContent as string).trim())
      .toBe(`${availableTagKeys.tagKeys[0].tagName}:${availableTagValues.tagValues[0].tagValue}`);

    flush();
  }));

  it('calling #setKeyValue adds a new tag', fakeAsync(() => {
    component.tagKey = 'key';
    component.tagId = 'value';

    component.setTagKeyValue();
    
    fixture.detectChanges();
    tick();

    let tag = template.query(By.css('nb-tag'));
    expect((tag.nativeElement.textContent as string).trim())
      .toBe('key:value');
    expect(component.tagMap.size).toBe(1);
  }));

  it('clicking on the X button removes the tag', fakeAsync(() => {
    component.tagKey = 'key';
    component.tagId = 'value';

    component.setTagKeyValue();

    fixture.detectChanges();
    tick();

    let removeBtn = template.query(By.css('.nb-tag-remove'));
    removeBtn.nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(component.tagMap.size).toBe(0);
  }));
});
