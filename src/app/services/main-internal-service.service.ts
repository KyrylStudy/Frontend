import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainInternalServiceService { 

  constructor() { }

  private mainInfoSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  mainInfo$: Observable<any | null> = this.mainInfoSubject.asObservable();

  setMainInfo(state: any | null): void {
    this.mainInfoSubject.next(state);
  }

  getMainInfo(): Observable<any | null> {
    return this.mainInfo$;
  }

  //-------------------------------------------------------------------------------

  // Initialize the BehaviorSubject with an empty array
  private hardwareSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  hardware$: Observable<any[]> = this.hardwareSubject.asObservable();

  // Method to set (replace) the entire state with a new array
  setHardware(state: any[]): void {
    this.hardwareSubject.next(state);
  }

  // Method to get the current state as an Observable
  getHardware(): Observable<any[]> {
    return this.hardware$;
  }
}
