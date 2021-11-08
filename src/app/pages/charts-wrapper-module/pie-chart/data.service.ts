import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class dataService{
  colorScheme =  { domain: ['#00ff00', '#ff0000', '#d9bc00', '#8338ec', '#3a86ff']}
  constructor() { }

  changeColor(colorArray){
    this.colorScheme={domain:colorArray}
  }
  getColor() {
    return this.colorScheme
  }

}
