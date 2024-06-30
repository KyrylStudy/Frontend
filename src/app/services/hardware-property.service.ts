import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HardwareProperty, NewHardwareProperty } from '../shared/models/hardware_property';

@Injectable({
  providedIn: 'root'
})
export class HardwarePropertyService {

  constructor(private httpClient: HttpClient,) { }

  //--------------Hardware(property)

  private hardwareProreriesSubject = new BehaviorSubject<HardwareProperty[]>([]);
  hardwareProreries$ = this.hardwareProreriesSubject.asObservable();

  hardwarePropertyUrl = "http://localhost:8080/api/ecus/"

  loadAllHardwareProperties(hardwareId: BigInt): void{
    this.httpClient.get<HardwareProperty[]>(`${this.hardwarePropertyUrl + hardwareId + '/hardwares' }`).pipe(
      tap(hardwareProreries => this.hardwareProreriesSubject.next(hardwareProreries))
    ).subscribe();
  }

  createHardwareProperty(newHardwareProperty: NewHardwareProperty, hardwareId: BigInt): void {
    this.httpClient.post<HardwareProperty>(`${this.hardwarePropertyUrl + hardwareId + '/hardware'}`, newHardwareProperty).pipe(
      tap(() => this.loadAllHardwareProperties(hardwareId)) 
    ).subscribe(); 
  }

}
