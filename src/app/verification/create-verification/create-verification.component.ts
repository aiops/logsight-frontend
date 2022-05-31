import {Component, OnInit} from '@angular/core';
import {VerificationService} from '../services/verification.service';
import {Tag} from "../../@core/common/tags";
import {TagRequest, TagValueRequest} from "../../@core/common/TagRequest";
import {TagEntry} from "../../@core/common/TagEntry";
import {VerificationRequest} from "../../@core/common/verification-request";
import {ApiService} from "../../@core/service/api.service";
import {VerificationSharingService} from "../services/verification-sharing.service";

@Component({
  selector: 'create-verification',
  templateUrl: './create-verification.component.html',
  styleUrls: ['./create-verification.component.scss']
})
export class CreateVerificationComponent implements OnInit {

  baselineTags: Tag[];
  baselineTagValues: Tag[];
  baselineTagId: string;
  baselineTagMap = new Map<string, string>();
  baselineTagMapKeys = [];
  baselineTagKey: string;

  candidateTags: Tag[];
  candidateTagValues: Tag[];
  candidateTagId: string;
  candidateTagMap = new Map<string, string>();
  candidateTagMapKeys = [];
  candidateTagKey: string;

  isLoading = false;

  constructor(private verificationService: VerificationService, private apiService: ApiService, private verificationSharingService: VerificationSharingService) {
  }

  ngOnInit(): void {
    this.loadAvailableTagKeys(new TagRequest([]))
  }

  loadAvailableTagKeys(tagRequest: TagRequest) {
    this.loadAvailableBaselineTagKeys(tagRequest)
    this.loadAvailableCandidateTagKeys(tagRequest)
  }

  baselineTagKeySelected(event) {
    this.baselineTagKey = event.value
    this.loadBaselineTagValuesForKey(this.baselineTagKey)
  }


  loadBaselineTagValuesForKey(tagKey: string) {
    this.verificationService.loadTagValueForKey(new TagValueRequest(tagKey)).subscribe(resp => {
      this.baselineTagValues = resp.tagValues
    })
  }

  baselineTagValueSelected(event) {
    this.baselineTagId = event.value
  }

  setBaselineTagKeyValue() {
    this.baselineTagValues = []
    if(this.baselineTagKey && this.baselineTagId){
      this.baselineTagMap.set(this.baselineTagKey, this.baselineTagId)
    if (!this.baselineTagMapKeys.includes(this.baselineTagKey)) {
      this.baselineTagMapKeys.push(this.baselineTagKey)
    }
    let baselineTagList = []
    for (let tagK of this.baselineTagMap.keys()) {
      baselineTagList.push(new TagEntry(tagK, this.baselineTagMap.get(tagK)))
    }
    this.baselineTagKey = null
    this.baselineTagId = null
    this.loadAvailableBaselineTagKeys(new TagRequest(baselineTagList))
    }else{
      this.apiService.handleNotification("Please select tag name and value!")
    }

  }

  onBaselineTagRemove(event) {
    this.baselineTagMap.delete(event.text.split(':')[0])
    this.baselineTagMapKeys = []
    this.baselineTagMap.forEach((value, key) => {
      this.baselineTagMapKeys.push(key)
    })
    let baselineTagList = []
    for (let tagK of this.baselineTagMap.keys()) {
      baselineTagList.push(new TagEntry(tagK, this.baselineTagMap.get(tagK)))
    }
    this.loadAvailableBaselineTagKeys(new TagRequest(baselineTagList))
  }

  loadAvailableBaselineTagKeys(tagRequest: TagRequest) {
    this.verificationService.loadAvailableTagKeys(tagRequest).subscribe(resp => {
      this.baselineTags = resp.tagKeys
    })
  }

  loadCandidateTagValueForKey(tagKey: string) {
    this.verificationService.loadTagValueForKey(new TagValueRequest(tagKey)).subscribe(resp => {
      this.candidateTagValues = resp.tagValues
    })
  }

  candidateTagValueSelected(event) {
    this.candidateTagId = event.value
  }

  candidateTagKeySelected(event) {
    this.candidateTagKey = event.value
    this.loadCandidateTagValueForKey(this.candidateTagKey)
  }


  setCandidateTagKeyValue() {
    this.candidateTagValues = []
    if(this.candidateTagKey && this.candidateTagId){
          this.candidateTagMap.set(this.candidateTagKey, this.candidateTagId)
    if (!this.candidateTagMapKeys.includes(this.candidateTagKey)) {
      this.candidateTagMapKeys.push(this.candidateTagKey)
    }
    let candidateTagList = []
    for (let tagK of this.candidateTagMap.keys()) {
      candidateTagList.push(new TagEntry(tagK, this.candidateTagMap.get(tagK)))
    }
    this.candidateTagKey = null
    this.candidateTagId = null
    this.loadAvailableCandidateTagKeys(new TagRequest(candidateTagList))
    }else{
      this.apiService.handleNotification("Please select tag name and value!")
    }

  }

  createVerification() {
    this.isLoading = true
    const convBaselineMap = {};
    this.baselineTagMap.forEach((val: string, key: string) => {
      convBaselineMap[key] = val;
    });
    const convCandidateMap = {};
    this.candidateTagMap.forEach((val: string, key: string) => {
      convCandidateMap[key] = val;
    });
    let verificationRequest = new VerificationRequest(convBaselineMap, convCandidateMap)
    this.verificationService.createVerification(verificationRequest).subscribe(resp => {
      console.log(resp)
      this.isLoading = false
      setTimeout(_ => {
        this.verificationSharingService.setData(true)
      }, 1000)
    }, error => {
      this.isLoading = false
      this.apiService.handleErrors(error)
    })
  }


  onCandidateTagRemove(event) {
    this.candidateTagMap.delete(event.text.split(':')[0])
    this.candidateTagMapKeys = []
    this.candidateTagMap.forEach((value, key) => {
      this.candidateTagMapKeys.push(key)
    })
    let candidateTagList = []
    for (let tagK of this.candidateTagMap.keys()) {
      candidateTagList.push(new TagEntry(tagK, this.candidateTagMap.get(tagK)))
    }
    this.loadAvailableCandidateTagKeys(new TagRequest(candidateTagList))
  }


  loadAvailableCandidateTagKeys(tagRequest: TagRequest) {
    this.verificationService.loadAvailableTagKeys(tagRequest).subscribe(resp => {
      this.candidateTags = resp.tagKeys
    })
  }

}
