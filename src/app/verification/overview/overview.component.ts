import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { OverviewItem } from '../models/overview.model';
import { Severity } from '../models/severity.enum';
import { Status } from '../models/status.enum';
import { VerificationService } from '../services/verification.service';

interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit {
  items: OverviewItem[] = []; 
  @ViewChild('overviewTable') tableRef: Table;

  selectedItems: OverviewItem[] = [];


  rowsPerPageOptions: number[] = [20, 50, 100];

  Severity = Severity;
  Status = Status;

  severityOptions: DropdownOption[] = [
    { value: Severity.Low, label: Severity[Severity.Low] },
    { value: Severity.Medium, label: Severity[Severity.Medium] },
    { value: Severity.High, label: Severity[Severity.High] }
  ];

  statusOptions: DropdownOption[] = [
    { value: Status.Raised, label: Status[Status.Raised] },
    { value: Status.Assigned, label: Status[Status.Assigned] },
    { value: Status.Resolved, label: Status[Status.Resolved] }
  ];

  tagOptions: DropdownOption[] = [];

  constructor(private verificationService: VerificationService) { }
  
  ngOnInit(): void {
    this.verificationService.getOverview().subscribe(res => { 
      this.items = res;
      this.getTags();
    });
  }

  ngAfterViewInit(): void {
    this.tableRef.filterService.register('includesTags', (tags: string[], filterArray: string[]): boolean => {
      if (filterArray === undefined || filterArray === null || filterArray.length === 0) {
          return true;
      }
  
      if (tags === undefined || tags === null || tags.length === 0) {
          return false;
      }
      
      for (const filter of filterArray) {
        if (!tags.includes(filter))
          return false;
      }

      return true;
    });
  }

  statusChanged(event: { value: DropdownOption }, item: OverviewItem) {
    this.verificationService
      .changeStatus(item.verificationId, event.value.value)
      .subscribe(res => item.status = event.value.value);
  }

  deleteItems() {
    //TODO: Think about what will happen if all elements get deleted on the page? How will the app know it has to load additional records?
    console.log(this.selectedItems);

    let itemIds: string[] = this.selectedItems.map(item => item.verificationId);

    this.verificationService
      .delete(itemIds)
      .subscribe(res => this.tableRef.value = this.tableRef.value.filter(item => !itemIds.includes(item.verificationId)));
  }
  
  filterByDate(event) {
    //TODO: Discuss if the filter should be range or equals.
    this.tableRef.filter(event, 'date', 'equals');
  }

  filterByApplicationName(event) {
    this.tableRef.filter(event.target.value, 'applicationName', 'startsWith');
  }

  filterByVerificationId(event) {
    this.tableRef.filter(event.target.value, 'verificationId', 'startsWith');
  }

  filterByBaselineTags(event) {
    this.tableRef.filter(event.value, 'baselineTags', 'includesTags');
  }

  filterByCandidateTags(event) {
    this.tableRef.filter(event.value, 'candidateTags', 'includesTags');
  }

  filterByRisk(event) {
    this.tableRef.filter(event.values, 'risk', 'between');
  }

  filterBySeverity(event) {
    this.tableRef.filter(event.value, 'severity', 'equals');
  }

  filterByStatus(event) {
    this.tableRef.filter(event.value, 'status', 'equals');
  }

  // Discuss in detail how the tags will be extracted - from the back-end through an endpoint or through iterating over all records?
  private getTags() {
    let tags = this.items.map(item => item.baselineTags).reduce((a, b) => a.concat(b), []);
    let uniqueTags = [...new Set(tags)].sort();
    this.tagOptions = uniqueTags.map(tag => { return { label: tag, value: tag } });
  }
}
