import {TagEntry} from "./TagEntry";

export class TagRequest {
  listTags: TagEntry []
  indexType: string

  constructor(listTags : TagEntry[], indexType:string="*") {
    this.listTags = listTags
    this.indexType = indexType
  }

}

export class TagValueRequest {
  tagName: string
  indexType: string

  constructor(tagName : string, indexType:string="*") {
    this.tagName = tagName
    this.indexType = indexType
  }

}
