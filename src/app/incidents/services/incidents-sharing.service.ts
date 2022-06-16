import { Observable, BehaviorSubject } from 'rxjs';
import {Injectable} from "@angular/core";

@Injectable()
export class IncidentsSharingService {
  private data = new BehaviorSubject("")
  currentData = this.data.asObservable();

  constructor() {
  }

  setData(data) {
    this.data.next(data);
  }
}
