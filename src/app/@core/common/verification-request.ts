
export class VerificationRequest {
  applicationId: string;
  userId: string;
  baselineTag: string;
  candidateTag: string;

  constructor(applicationId: string, userId: string, baselineTag: string, compareTag: string) {
    this.applicationId = applicationId
    this.userId = userId
    this.baselineTag = baselineTag
    this.candidateTag = compareTag
  }

}
