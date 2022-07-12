import {
  AfterViewInit,
  Component,
  EventEmitter, 
  OnInit,
  Output, 
  ViewChild
} from '@angular/core';
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { Table } from 'primeng/table';
import { VerificationData } from "../../@core/common/verification-data";
import { UpdateVerificationStatusRequest } from "../../@core/common/verification-request";
import { DropdownOption } from '../models/dropdown-option.model';
import { OverviewItem } from '../models/overview.model';
import { Severity } from '../models/severity.enum';
import { Status } from '../models/status.enum';
import { VerificationSharingService } from "../services/verification-sharing.service";
import { VerificationService } from '../services/verification.service';

@Component({
  selector: 'verification-overview',
  templateUrl: './verification-overview.component.html',
  styleUrls: ['./verification-overview.component.scss']
})
export class VerificationOverviewComponent implements OnInit, AfterViewInit{

  @Output() onInsightsActivated = new EventEmitter<void>();
  items: OverviewItem[] = [];
  @ViewChild('overviewTable') tableRef: Table;
  selectedItems: OverviewItem[] = [];

  rowsPerPageOptions: number[] = [20, 50, 100];

  Severity = Severity;
  Status = Status;

  severityOptions: DropdownOption[] = [
    {value: Severity.Low, label: Severity[Severity.Low]},
    {value: Severity.Medium, label: Severity[Severity.Medium]},
    {value: Severity.High, label: Severity[Severity.High]}
  ];

  statusOptions: DropdownOption[] = [
    {value: Status.Raised, label: Status[Status.Raised]},
    {value: Status.Assigned, label: Status[Status.Assigned]},
    {value: Status.Resolved, label: Status[Status.Resolved]}
  ];

  tagOptionsCandidate = [];
  tagOptionsBaseline = [];
  riskSlider = [0,100]
  riskSliderValues = [0, 100]

  constructor(private verificationService: VerificationService, private router: Router, private verificationSharingService: VerificationSharingService, private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.verificationSharingService.currentData.subscribe(data => {
      this.getOverview()
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

  getOverview(){
    this.items = [];
    this.verificationService.getOverview().subscribe(res => {
      this.items = res;
      this.getTags();
    });
  }

  statusChanged(event: { value: DropdownOption }, item: VerificationData) {
    let request = new UpdateVerificationStatusRequest(item.compareId, event.value.value)
    this.verificationService
      .changeStatus(request)
      .subscribe(res => {
        item.status = event.value.value
      });
  }

  viewInsights(verificationId) {
    this.router.navigate(['/pages', 'compare', 'insights'], {
      queryParams: {
        compareId: verificationId
      }
    })
    this.onInsightsActivated.emit();
  }

  deleteItems() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        for (let i of this.selectedItems) {
          this.verificationService.delete(i.compareId).subscribe(res => {
            this.tableRef.value = this.tableRef.value.filter(item => i.compareId != item.compareId)
          })
        }
      }
    });
  }

  filterByDate(event) {
    //TODO: Discuss if the filter should be range or equals.
    this.tableRef.filter(event, 'timestamp', 'equals');
  }

  filterByVerificationId(event) {
    this.tableRef.filter(event.target.value, 'compareId', 'startsWith');
  }

  filterByBaselineTags(event) {
    this.tableRef.filter(event.value, 'baselineTags', 'includesTags');
  }

  filterByCandidateTags(event) {
    this.tableRef.filter(event.value, 'candidateTags', 'includesTags');
  }

  filterByRisk(event) {
    this.riskSliderValues = event.values
    this.tableRef.filter(event.values, 'risk', 'between');
  }

  filterBySeverity(event) {
    this.tableRef.filter(event.value, 'severity', 'equals');
  }

  filterByStatus(event) {
    this.tableRef.filter(event.value, 'status', 'equals');
  }

  private getTags() {
    let baselineTags = this.items.map(item => item.baselineTags).reduce((a, b) => a.concat(b), []);
    this.tagOptionsBaseline = [...new Set(baselineTags)].sort();

    let candidateTags = this.items.map(item => item.candidateTags).reduce((a, b) => a.concat(b), []);
    this.tagOptionsCandidate = [...new Set(candidateTags)].sort();
  }
}
