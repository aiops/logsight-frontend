import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Table} from 'primeng/table';
import {Severity} from '../models/severity.enum';
import {Status} from '../models/status.enum';
import {VerificationService} from '../services/verification.service';
import {VerificationData} from "../../@core/common/verification-data";
import {Router} from "@angular/router";
import {UpdateVerificationStatusRequest} from "../../@core/common/verification-request";
import {VerificationSharingService} from "../services/verification-sharing.service";

interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit{

  @Output() onInsightsActivated = new EventEmitter<void>();
  items: VerificationData[] = [];
  @ViewChild('overviewTable') tableRef: Table;
  selectedItems: VerificationData[] = [];

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

  constructor(private verificationService: VerificationService, private router: Router, private verificationSharingService: VerificationSharingService) {
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
    this.verificationService.getOverview().subscribe(resp => {
      for (let i of resp) {
        i._source["compareId"] = i._id
        i._source["baseline_tags_keys"] = Object.keys(i._source['baseline_tags'])
        i._source["baseline_tags_map"] = new Map(Object.entries(i._source['baseline_tags']));
        let tagList = []
        for (let j of i._source["baseline_tags_keys"]) {
          tagList.push(`${j}:${i._source["baseline_tags_map"].get(j)}`)
        }
        i._source["baseline_tags_keys"] = tagList

        i._source["candidate_tags_keys"] = Object.keys(i._source['candidate_tags'])
        i._source["candidate_tags_map"] = new Map(Object.entries(i._source['candidate_tags']));
        tagList = []
        for (let j of i._source["candidate_tags_keys"]) {
          tagList.push(`${j}:${i._source["candidate_tags_map"].get(j)}`)
        }
        i._source["candidate_tags_keys"] = tagList
        this.items.push(i._source)
      }
      this.getTags()
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
    for (let i of this.selectedItems) {
      this.verificationService.delete(i.compareId).subscribe(res => {
        this.tableRef.value = this.tableRef.value.filter(item => i.compareId != item.compareId)
      })
    }
  }

  filterByDate(event) {
    //TODO: Discuss if the filter should be range or equals.
    this.tableRef.filter(event, 'timestamp', 'equals');
  }

  filterByVerificationId(event) {
    this.tableRef.filter(event.target.value, 'compareId', 'startsWith');
  }

  filterByBaselineTags(event) {
    this.tableRef.filter(event.value, 'baseline_tags_keys', 'includesTags');
  }

  filterByCandidateTags(event) {
    this.tableRef.filter(event.value, 'candidate_tags_keys', 'includesTags');
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

  private getTags() {
    let tags = this.items.map(item => item.baseline_tags_keys).reduce((a, b) => a.concat(b), []);
    let uniqueTags = [...new Set(tags)].sort();
    this.tagOptionsBaseline = uniqueTags.map(tag => {
      return {label: tag, value: tag}
    });

    tags = this.items.map(item => item.candidate_tags_keys).reduce((a, b) => a.concat(b), []);
    uniqueTags = [...new Set(tags)].sort();
    this.tagOptionsCandidate = uniqueTags.map(tag => {
      return {label: tag, value: tag}
    });
  }
}
