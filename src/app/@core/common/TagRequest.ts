import {TagEntry} from "./TagEntry";

export class TagRequest {
  listTags: TagEntry []
  applicationId: string

  constructor(listTags : TagEntry[], applicationId: string) {
    this.listTags = listTags
    this.applicationId = applicationId
  }

}
