import {Component, OnInit} from '@angular/core';
import {VerificationService} from '../services/verification.service';
import {VerificationRequest} from "../../@core/common/verification-request";
import {ApiService} from "../../@core/service/api.service";
import {VerificationSharingService} from "../services/verification-sharing.service";
import { TagType } from '../models/tag.model';

@Component({
  selector: 'create-verification',
  templateUrl: './create-verification.component.html',
  styleUrls: ['./create-verification.component.scss']
})
export class CreateVerificationComponent implements OnInit {
  baselineTagType = TagType.Baseline;
  candidateTagType = TagType.Candidate;

  baselineTagMap = new Map<string, string>();
  candidateTagMap = new Map<string, string>();

  isLoading = false;

  constructor(
    private verificationService: VerificationService, 
    private apiService: ApiService, 
    private verificationSharingService: VerificationSharingService) { }

  ngOnInit(): void { }

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
      this.isLoading = false
      setTimeout(_ => {
        this.verificationSharingService.setData(true)
      }, 1000)
    }, error => {
      this.isLoading = false
      this.apiService.handleErrors(error)
    })
  }
}
