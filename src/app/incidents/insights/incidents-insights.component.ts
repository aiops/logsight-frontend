import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {VerificationStateItem} from '../models/verification_state.model';
import {Severity} from '../models/severity.enum';
import {Status} from '../models/status.enum';
import {IncidentsService} from '../services/incidents.service';
import {VerificationData} from "../../@core/common/verification-data";
import {verificationData} from "../fake-data/incident_data";
import {ActivatedRoute} from "@angular/router";

interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'verification-insights',
  templateUrl: './incidents-insights.component.html',
  styleUrls: ['./incidents-insights.component.scss']
})
export class IncidentsInsightsComponent implements OnInit {
  @ViewChild('statesTable') tableRef: Table;
  rowsPerPageOptions: number[] = [20, 50, 100];

  tableDataUnified: VerificationData = verificationData
  tableRows: VerificationStateItem[]
  verificationId = [];
  verificationIdList = [];

  baselineTagMap = new Map<string, string>();
  baselineTagMapKeys = [];

  candidateTagMap = new Map<string, string>();
  candidateTagMapKeys = [];

  baselinePercentageSliderValues = [0, 100];
  candidatePercentageSliderValues = [0, 100];
  baselineCountSliderValues = [0, 100];
  candidateCountSliderValues = [0, 100];
  changeSliderValues = [0, 100];
  coverageSliderValues = [0, 100];

  Severity = Severity;
  Status = Status;

  baselineTags = []
  candidateTags = []
  verificationShortId = ""

  @Output() onInsightsActivated = new EventEmitter<void>();
  severityOptions: DropdownOption[] = [{value: Severity.Low, label: Severity[Severity.Low]}, {
    value: Severity.Medium, label: Severity[Severity.Medium]
  }, {value: Severity.High, label: Severity[Severity.High]}];


  constructor(private verificationService: IncidentsService, private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      let verificationId = queryParams.get("compareId")
      if (verificationId) {
        this.verificationService.loadVerificationByID(verificationId).subscribe(resp => {
          this.onInsightsActivated.emit()
          this.verificationIdList = resp.listCompare
          this.verificationId = this.verificationIdList[0]
          this.verificationShortId = this.verificationId["_id"]
          let event = {"value": this.verificationIdList[0]}
          this.onVerificationSelect(event)
        })
      }
    });

  }


  onVerificationSelect(event) {
    if (event.value) {
      this.tableDataUnified = event.value._source
      this.tableRows = event.value._source.rows
      this.baselineTagMapKeys = Object.keys(event.value._source['baseline_tags'])
      this.baselineTagMap = new Map(Object.entries(event.value._source['baseline_tags']));
      this.candidateTagMapKeys = Object.keys(event.value._source['candidate_tags'])
      this.candidateTagMap = new Map(Object.entries(event.value._source['candidate_tags']));
    } else {
      this.tableDataUnified = verificationData
      this.baselineTagMapKeys = []
      this.tableRows = []
      this.baselineTagMap = new Map<string, string>();
      this.candidateTagMapKeys = []
      this.candidateTagMap = new Map<string, string>();
    }
  }


  // Table Filters

  filterBySeverity(event) {
    this.tableRef.filter(event.value, 'risk_severity', 'equals');
  }

  filterByDescription(event) {
    this.tableRef.filter(event.target.value, 'risk_description', 'startsWith');
  }

  filterByState(event) {
    this.tableRef.filter(event.target.value, 'template', 'contains');
  }

  filterByLevel(event) {
    this.tableRef.filter(event.target.value, 'level', 'contains');
  }

  filterBySemantics(event) {
    this.tableRef.filter(event.target.value, 'semantics', 'contains');
  }

  filterByBaselinePercentage(event) {
    this.tableRef.filter(event.values, 'perc_baseline', 'between');
  }

  filterByCandidatePercentage(event) {
    this.tableRef.filter(event.values, 'perc_candidate', 'between');
  }

  filterByCountBaseline(event) {
    this.tableRef.filter(event.values, 'count_base', 'between');
  }

  filterByCountCandidate(event) {
    this.tableRef.filter(event.values, 'count_cand', 'between');
  }

  filterByChange(event) {
    this.tableRef.filter(event.values, 'change_perc', 'between');
  }

  filterByCoverage(event) {
    this.tableRef.filter(event.values, 'coverage', 'between');
  }

}
