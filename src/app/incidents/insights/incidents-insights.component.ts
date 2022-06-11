import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {Severity} from '../models/severity.enum';
import {Status} from '../models/status.enum';
import {IncidentsService} from '../services/incidents.service';
import {incidentData} from "../fake-data/data";
import {ActivatedRoute} from "@angular/router";
import {IncidentData} from "../../@core/common/incident-data";
import {IncidentStateItem} from "../models/incident_state.model";

interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'incidents-insights',
  templateUrl: './incidents-insights.component.html',
  styleUrls: ['./incidents-insights.component.scss']
})
export class IncidentsInsightsComponent implements OnInit {
  @ViewChild('statesTable') tableRef: Table;
  rowsPerPageOptions: number[] = [20, 50, 100];

  tableDataUnified: IncidentData = incidentData
  tableRows: IncidentStateItem[]
  incidentId = [];

  baselineTagMap = new Map<string, string>();
  baselineTagMapKeys = [];

  Severity = Severity;
  Status = Status;

  baselineTags = []
  candidateTags = []
  incidentShortId = ""

  @Output() onInsightsActivated = new EventEmitter<void>();
  severityOptions: DropdownOption[] = [{value: Severity.Low, label: Severity[Severity.Low]}, {
    value: Severity.Medium, label: Severity[Severity.Medium]
  }, {value: Severity.High, label: Severity[Severity.High]}];


  constructor(private incidentsService: IncidentsService, private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      let incidentId = queryParams.get("incidentId")
      if (incidentId) {
        this.incidentsService.loadIncidentByID(incidentId).subscribe(resp => {
          this.onInsightsActivated.emit()
          this.incidentId = resp.listIncident[0]
          this.incidentShortId = this.incidentId["_id"]
          let event = {"value": this.incidentId}
          this.onIncidentSelect(event)
        })
      }
    });

  }


  onIncidentSelect(event) {
    if (event.value) {
      this.tableDataUnified = event.value._source
      this.tableRows = event.value._source.data
      console.log(this.tableRows)
      this.baselineTagMapKeys = Object.keys(event.value._source['tags'])
      this.baselineTagMap = new Map(Object.entries(event.value._source['tags']));
    } else {
      this.tableDataUnified = incidentData
      this.baselineTagMapKeys = []
      this.tableRows = []
      this.baselineTagMap = new Map<string, string>();
    }
  }

  // Table Filters

  decimalToIntCeil(num) {
    return Math.ceil(num)
  }

  semanticAnomalyToText(num) {
    if (num == 0) {
      return "REPORT"
    } else {
      return "FAULT"
    }
  }

  addedStateToText(num) {
    if (num == 1) {
      return "ADDED"
    } else {
      return ""
    }
  }

  addedToColor(num) {
    if (num == 0) {
      return "#495057"
    } else {
      return "#00a800"
    }
  }

  predictionToColor(num) {
    if (num == 0) {
      return "#495057"
    } else {
      return "#ff3d71"
    }
  }

  levelToColor(level) {
    if (level.toUpperCase() in ["ERR", "ERROR", "FATAL", "CRITICAL"]) {
      return "#ff3d71"
    } else {
      return "#495057"
    }
  }

  filterBySeverity(event) {
    this.tableRef.filter(event.value, 'risk_severity', 'equals');
  }

  filterByMessage(event) {
    this.tableRef.filter(event.target.value, 'message', 'contains');
  }

  filterByLevel(event) {
    this.tableRef.filter(event.target.value, 'level', 'contains');
  }

  filterBySemantics(event) {
    this.tableRef.filter(event.target.value, 'semantics', 'contains');
  }


}
