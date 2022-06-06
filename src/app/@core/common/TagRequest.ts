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
  listTags: TagEntry[]

  constructor(tagName : string, indexType:string="*", listTags: TagEntry[]) {
    this.tagName = tagName
    this.indexType = indexType
    this.listTags = listTags
  }

}
