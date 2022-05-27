
export class VerificationRequest {
  baselineTags: {};
  candidateTags: {};

  constructor(baselineTags, candidateTags) {
    this.baselineTags = baselineTags
    this.candidateTags = candidateTags
  }

}

export class IssuesKPIVerificationRequest {
  baselineTags: {};

  constructor(baselineTags) {
    this.baselineTags = baselineTags
  }

}

export class UpdateVerificationStatusRequest {
  compareId: string;
  compareStatus: number;

  constructor(compareId: string, compareStatus: number) {
    this.compareId = compareId
    this.compareStatus = compareStatus
  }
}
