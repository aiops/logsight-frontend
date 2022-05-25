
export class VerificationRequest {
  applicationId: string;
  baselineTags: {};
  candidateTags: {};

  constructor(applicationId: string, baselineTags, candidateTags) {
    this.applicationId = applicationId
    this.baselineTags = baselineTags
    this.candidateTags = candidateTags
  }

}
