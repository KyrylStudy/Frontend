import { Injectable } from '@angular/core';
import { Hardware } from '../shared/models/hardware';
import { NewHardware } from '../shared/models/hardware';
import { HttpClient } from '@angular/common/http';
import { Software } from '../shared/models/software';
import { NewSoftware } from '../shared/models/software';
import { HardwareProperty } from '../shared/models/hardware_property';
import { NewHardwareProperty } from '../shared/models/hardware_property';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Architecture } from '../shared/models/architectures';
import { NewArchitecture } from '../shared/models/architectures';
import { Service } from '../shared/models/service';
import { newService } from '../shared/models/service';
import { ArchitectureService } from './architecture.service';


@Injectable({
  providedIn: 'root'
})
export class HardwareService {

 
  constructor(private httpClient: HttpClient, private architectureService:ArchitectureService,) { }



  selectedArchitecture: Architecture | null = null;
  //---------------ECU (Hardware)
  private selectedHardwareSubject = new BehaviorSubject<Hardware | null>(null);
  selectedHardware$ = this.selectedHardwareSubject.asObservable();

  setSelectedHardware(selectedHardware: Hardware | null): void {
    this.selectedHardwareSubject.next(selectedHardware);
  }

  getSelectedHardware(): Observable<Hardware | null> {
    return this.selectedHardware$;
  }


  private hardwaresSubject = new BehaviorSubject<Hardware[]>([]);
  hardwares$ = this.hardwaresSubject.asObservable();

  baseHardwareUrl = "http://localhost:8080/api/ecus/";

  loadAllHardwares(architectureId: number): Observable<Hardware[]>{
    const hardwares = this.httpClient.get<Hardware[]>(`${this.baseHardwareUrl  + 'architecture/' + architectureId }`);
    hardwares.pipe(
      tap(hardwares => this.hardwaresSubject.next(hardwares))
    ).subscribe(); 

    return hardwares;
  }

  updateHardware(Hardware: Hardware, id: BigInt): void {
    this.httpClient.put<Hardware>(`${this.baseHardwareUrl + id + '/update'}`, Hardware).pipe(
      tap(() => {
        this.architectureService.getSelectedArchitecture().subscribe(data => {
          this.selectedArchitecture = data;
        })
        if(this.selectedArchitecture)
        this.loadAllHardwares(this.selectedArchitecture.id)
      })  // Обновить список после изменения
    ).subscribe();
  }

  createHardware(NewHardware: NewHardware, architectureId: number): void {
    this.httpClient.post<Hardware>(`${this.baseHardwareUrl + architectureId + '/ecu'}`, NewHardware).pipe(
      tap(() => this.loadAllHardwares(architectureId))  // Обновить список после добавления
    ).subscribe(); 
  }


    deleteHardware(id: BigInt): void {
      this.httpClient.delete<Hardware>(`${this.baseHardwareUrl + id + '/delete'}`).pipe(
        tap(() => {
          this.architectureService.getSelectedArchitecture().subscribe(data => {
            this.selectedArchitecture = data;
          })
          if(this.selectedArchitecture)
          this.loadAllHardwares(this.selectedArchitecture.id)
        })  // Обновить список после удаления
      ).subscribe();
    }
}
