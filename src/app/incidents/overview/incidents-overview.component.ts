import {AfterViewInit, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {Severity} from '../models/severity.enum';
import {Status} from '../models/status.enum';
import {IncidentsService} from '../services/incidents.service';
import {ActivatedRoute, Router} from "@angular/router";
import {IncidentsSharingService} from "../services/incidents-sharing.service";
import {ConfirmationService} from "primeng/api";
import {IncidentData} from "../../@core/common/incident-data";
import {PredefinedTime} from "../../@core/common/predefined-time";
import {DashboardService} from "../../pages/dashboard/dashboard.service";
import {NbPopoverDirective} from "@nebular/theme";
import * as moment from 'moment';
import {UpdateIncidentStatusRequest} from "../../@core/common/incident-request";

interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'incidents-overview',
  templateUrl: './incidents-overview.component.html',
  styleUrls: ['./incidents-overview.component.scss']
})
export class IncidentsOverviewComponent implements OnInit, AfterViewInit {

  @Output() onInsightsActivated = new EventEmitter<void>();
  items: IncidentData[] = [];
  @ViewChild('overviewTable') tableRef: Table;
  selectedItems: IncidentData[] = [];

  rowsPerPageOptions: number[] = [20, 50, 100];

  Severity = Severity;
  Status = Status;

  severityOptions: DropdownOption[] = [{value: Severity.Low, label: Severity[Severity.Low]}, {
    value: Severity.Medium,
    label: Severity[Severity.Medium]
  }, {value: Severity.High, label: Severity[Severity.High]}];

  statusOptions: DropdownOption[] = [{value: Status.Raised, label: Status[Status.Raised]}, {
    value: Status.Assigned,
    label: Status[Status.Assigned]
  }, {value: Status.Resolved, label: Status[Status.Resolved]}];


  predefinedTimes: PredefinedTime[] = [];
  @ViewChild('dateTimePicker', {read: TemplateRef}) dateTimePicker: TemplateRef<any>;
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

  tagOptions = [];
  riskSlider = [0, 100]
  riskSliderValues = [0, 100]

  addedStateSlider = [0, Number.MAX_SAFE_INTEGER]
  addedStateSliderValues = [0, Number.MAX_SAFE_INTEGER]

  startDateTime = 'now-720m';
  endDateTime = 'now'

  userId = ""

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private incidentService: IncidentsService, private router: Router, private incidentSharingService: IncidentsSharingService, private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    let selectedTime = localStorage.getItem("selectedTime")
    if (selectedTime) {
      let params = JSON.parse(selectedTime)
      this.startDateTime = params['startTime'];
      this.endDateTime = params['endTime'];
    }
    this.route.queryParamMap.subscribe(queryParams => {
      if(queryParams.get("sample")){
        this.startDateTime = queryParams.get("startTime")
        this.endDateTime = queryParams.get("endTime")
      }
    });
    this.userId = localStorage.getItem('userId')
    this.incidentSharingService.currentData.subscribe(() => {
      this.getOverview()
    });
    this.loadPredefinedTimes(this.userId)
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
        if (!tags.includes(filter)) return false;
      }

      return true;
    });
  }

  getOverview() {
    this.items = [];
    this.incidentService.getOverview(moment(this.startDateTime).format(), moment(this.endDateTime).format()).subscribe(r => {
      let resp = r.listIncident
      for (let i of resp) {
        i._source["incidentId"] = i._id
        i._source["tags_keys"] = Object.keys(i._source['tags'])
        i._source["tags_map"] = new Map(Object.entries(i._source['tags']));
        let tagList = []
        for (let j of i._source["tags_keys"]) {
          tagList.push(`${j}:${i._source["tags_map"].get(j)}`)
        }
        i._source["tags_keys"] = tagList
        this.items.push(i._source)
      }
      this.getTags()
    });
  }

  statusChanged(event: { value: DropdownOption }, item: IncidentData) {
    let request = new UpdateIncidentStatusRequest(item.incidentId, event.value.value)
    this.incidentService
      .changeStatus(request)
      .subscribe(() => {
        item.status = event.value.value
      });
  }

  viewInsights(incidentId) {
    this.router.navigate(['/pages', 'incidents', 'insights'], {
      queryParams: {
        incidentId: incidentId
      }
    })
    this.onInsightsActivated.emit();
  }

  deleteItems() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?', accept: () => {
        for (let i of this.selectedItems) {
          this.incidentService.delete(i.incidentId).subscribe(() => {
            this.tableRef.value = this.tableRef.value.filter(item => i.incidentId != item.incidentId)
          })
        }
      }
    });

  }

  onDeletePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.deleteTimeRange(this.userId, predefinedTime).subscribe(() => this.loadPredefinedTimes(this.userId))
  }

  onSavePredefinedTime(predefinedTime: PredefinedTime) {
    this.dashboardService.createTimeRange(this.userId, predefinedTime).subscribe(() => this.loadPredefinedTimes(this.userId))
  }

  onDateTimeSearch(event) {
    localStorage.setItem('selectedTime', JSON.stringify(event));
    let dateTimeType = 'absolute';
    if (event.relativeTimeChecked) {
      this.startDateTime = event.relativeDateTime
      this.endDateTime = 'now'
      dateTimeType = 'relative';
    } else if (event.absoluteTimeChecked) {
      this.startDateTime = moment(event.absoluteDateTime.startDateTime).format()
      this.endDateTime = moment(event.absoluteDateTime.endDateTime).format()
    }
    localStorage.setItem("selectedTime", JSON.stringify({
      startTime: this.startDateTime, endTime: this.endDateTime, dateTimeType
    }))
    this.getOverview()
  }


  onSelectPredefinedTime(pt: PredefinedTime) {
    if (pt.dateTimeType == 'RELATIVE') {
      this.onDateTimeSearch({relativeTimeChecked: true, relativeDateTime: pt.startTime})
    } else {
      this.onDateTimeSearch({
        absoluteTimeChecked: true, absoluteDateTime: {
          startDateTime: pt.startTime, endDateTime: pt.endTime
        }
      })
    }
  }

  loadPredefinedTimes(userId: string) {
    this.dashboardService.getAllTimeRanges(userId).subscribe(resp => {
      this.predefinedTimes = resp.timeSelectionList
    })
  }


  filterByIncidentId(event) {
    this.tableRef.filter(event.target.value, 'incidentId', 'contains');
  }

  filterByMessage(event) {
    this.tableRef.filter(event.target.value, 'message', 'startsWith');
  }

  filterByTags(event) {
    this.tableRef.filter(event.value, 'tags_keys', 'includesTags');
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
    let tagList = []
    for (let j of this.items) {
      let tagMap = new Map(Object.entries(j.tags))
      for (let i of Array.from(tagMap.keys())){
          tagList.push(`${i}:${tagMap.get(i)}`)
      }
    }
    let uniqueTags = [...new Set(tagList)].sort();
    this.tagOptions = uniqueTags.map(tag => {
      return {label: tag, value: tag}
    });
  }

}
