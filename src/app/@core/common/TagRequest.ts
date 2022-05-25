import {TagEntry} from "./TagEntry";

export class TagRequest {
  listTags: TagEntry []

  constructor(listTags : TagEntry[]) {
    this.listTags = listTags
  }

}
