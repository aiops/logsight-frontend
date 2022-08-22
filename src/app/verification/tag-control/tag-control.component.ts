import { Component, Input, OnInit } from '@angular/core';
import { TagEntry } from '../../@core/common/TagEntry';
import { TagRequest, TagValueRequest } from '../../@core/common/TagRequest';
import { Tag } from '../../@core/common/tags';
import { ApiService } from '../../@core/service/api.service';
import { TagType } from '../models/tag.model';
import { VerificationService } from '../services/verification.service';

@Component({
  selector: 'tag-control',
  templateUrl: './tag-control.component.html',
  styleUrls: ['./tag-control.component.scss']
})

// A generic component which deals with adding and removing tags (candidate or baseline).
// This component can be moved to a Shared/Common module if it needs to be used in different modules.
export class TagControlComponent implements OnInit {
  @Input() tagType: TagType;
  @Input() tagMap: Map<string, string> = new Map<string, string>();
  @Input() indexType?: string = '*';

  tagKeyOptions: Tag[];
  tagValueOptions: Tag[];
  tagId: string;
  tagMapKeys = [];
  tagKey: string;

  tooltipText: string = '';

  baselineTooltipText: string = 'Used to select the log data which is used as baseline (for example, the past version of the application. Click on the dropdown menu, select the tags and set them by clicking Add.';
  candidateTooltipText: string = 'Used to select the log data which we want to verify against the selected baseline. Multiple tags can be selected by adding them sequentially.';
  
  constructor(private verificationService: VerificationService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadAvailableTagKeys(new TagRequest([], this.indexType));

    this.tooltipText = this.tagType === TagType.Baseline ? this.baselineTooltipText : this.candidateTooltipText;
  }

  loadAvailableTagKeys(tagRequest: TagRequest) {
    // Because currently there is no difference between the requests for baseline and candidate keys this is the method used to load both types. 
    // However, if in the future there is a difference in the requests this change should be reflected in the service and the type of tag should be passed to the service in the below call or in the TagRequest object. */
    this.verificationService.loadAvailableTagKeys(tagRequest).subscribe(resp => {
      this.tagKeyOptions = resp.tagKeys;
    })
  }

  tagKeySelected(event) {
    this.tagKey = event.value;
    this.loadTagValuesForKey(this.tagKey);
  }

  loadTagValuesForKey(tagKey: string) {
    let tagList = []
    for (let tagK of this.tagMap.keys()) {
      tagList.push(new TagEntry(tagK, this.tagMap.get(tagK)))
    }
    this.verificationService.loadTagValueForKey(new TagValueRequest(tagKey, this.indexType, tagList)).subscribe(resp => {
      this.tagValueOptions = resp.tagValues
    })
  }

  tagValueSelected(event) {
    this.tagId = event.value
  }

  setTagKeyValue() {
    this.tagValueOptions = []
    if(this.tagKey && this.tagId){
      this.tagMap.set(this.tagKey, this.tagId)
    if (!this.tagMapKeys.includes(this.tagKey)) {
      this.tagMapKeys.push(this.tagKey)
    }
    let tagList = []
    for (let tagK of this.tagMap.keys()) {
      tagList.push(new TagEntry(tagK, this.tagMap.get(tagK)))
    }
    this.tagKey = null
    this.tagId = null
    this.loadAvailableTagKeys(new TagRequest(tagList))
    } else{
      this.apiService.handleNotification("Please select tag name and value!")
    }
  }

  onTagRemove(event) {
    this.tagMap.delete(event.text.split(':')[0])
    this.tagMapKeys = []
    this.tagMap.forEach((value, key) => {
      this.tagMapKeys.push(key)
    })
    let tagList = []
    for (let tagK of this.tagMap.keys()) {
      tagList.push(new TagEntry(tagK, this.tagMap.get(tagK)))
    }
    this.loadAvailableTagKeys(new TagRequest(tagList))
  }
}
