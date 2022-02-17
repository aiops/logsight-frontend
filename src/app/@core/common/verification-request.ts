
export class VerificationRequest {
  applicationId: string;
  userId: string;
  baselineTag: string;
  compareTag: string;

  constructor(applicationId: string, userId: string, baselineTag: string, compareTag: string) {
    this.applicationId = applicationId
    this.userId = userId
    this.baselineTag = baselineTag
    this.compareTag = compareTag
  }

}
