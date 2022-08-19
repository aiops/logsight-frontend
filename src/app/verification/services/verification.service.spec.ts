import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OverviewItem } from '../models/overview.model';
import { VerificationService } from './verification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../../@core/service/api.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { AnalyticsResponse } from '../models/responses/analytics-response.model';
import * as moment from 'moment';

describe('VerificationService', () => {
  let service: VerificationService;
  let apiServiceSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

  beforeEach(() => {

    TestBed.configureTestingModule({ 
      providers: [
        VerificationService, 
        { provide: ApiService, useValue: apiServiceSpy }
      ] 
    }).compileComponents();
    service = TestBed.inject(VerificationService);
  });

  it('#getOverview returns array of mapped objects', () => {
    const getOverviewResponse = of({
      listCompare: [{
        _id: '111',
        _source: {
          baseline_tags: {version: "v1.0.0", applicationName: "resource_manager"},
          candidate_tags: {version: "v1.1.0", applicationName: "resource_manager"},
          risk: 85,
          severity: 3,
          status: 1,
          timestamp: "2022-06-13T00:00:00.0"
        }
      }]
    });

    apiServiceSpy.get.and.returnValue(getOverviewResponse);

    let expected: OverviewItem[] = [{
      compareId: '111',
      baselineTags: ['version:v1.0.0', 'applicationName:resource_manager'],
      candidateTags: ['version:v1.1.0', 'applicationName:resource_manager'],
      risk: 85,
      severity: 3,
      status: 1,
      timestamp: new Date(2022, 5, 13, 0, 0, 0, 0),
      selected: false
    }];
    
    service.getOverview(new Date(), new Date()).subscribe(actual => {
      expect(actual).toEqual(expected);
    });
  });

  it('#loadBarData returns array of mapped objects', () => {
    const postLoadBarDataResponse = of({
      data: {
        data:[{
          name:"2022-06-12T10:00:00.00Z[UTC]", 
          series:[
            {
              name:"Count", 
              value:1.0,
              applicationId:null
            },
            {
              name:'Count',
              value:0.0,
              applicationId:null
            }
          ]
        }]
      }
    });

    apiServiceSpy.post.and.returnValue(postLoadBarDataResponse);

    let date = new Date('2022-06-12 10:00:00.00 UTC');
    let hours = date.getHours();
    let day = date.getDate();

    let expected: AnalyticsResponse[] = [{
      name: `Jun ${day} ${hours}:00`,
      series: [
        {
          name: "Count", 
          value: 1.0,
          applicationId: null
        },
        {
          name: 'Count',
          value: 0.0,
          applicationId: null
        }
      ]
    }];

    service.loadBarData(null, null).subscribe(actual => {
      console.log(actual, 'Actual: ');
      console.log(expected, 'Expected: ');
      expect(actual).toEqual(expected);
    })
  });
});
