import { Injectable } from '@angular/core';
import { Hardware } from '../shared/models/hardware';
import { NewHardware } from '../shared/models/hardware';
//import { sample_ecu } from '../../data';
//import { Connection } from '../shared/models/connection-model';
//import { sample_lines } from '../../data';
import { HttpClient } from '@angular/common/http';
import { Software } from '../shared/models/software';
import { NewSoftware } from '../shared/models/software';
import { HardwareProperty } from '../shared/models/hardware_property';
import { NewHardwareProperty } from '../shared/models/hardware_property';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Architecture } from '../shared/models/architectures';
import { newArchitecture } from '../shared/models/architectures';
import { Service } from '../shared/models/service';
import { newService } from '../shared/models/service';


@Injectable({
  providedIn: 'root'
})
export class EcuService {

 
  constructor(private httpClient: HttpClient) { }




  //---------------ECU (Hardware)
  private hardwaresSubject = new BehaviorSubject<any[]>([]);
  hardwares$ = this.hardwaresSubject.asObservable();

  baseHardwareUrl = "http://localhost:8080/api/ecus/"

  loadAllHardwares(architectureId: number): void{
    this.httpClient.get<Hardware[]>(`${this.baseHardwareUrl  + 'architecture/' + architectureId }`).pipe(
      tap(hardwares => this.hardwaresSubject.next(hardwares))
    ).subscribe();
  }

  updateHardware(Hardware: Hardware, id: BigInt): void {
    this.httpClient.put<Hardware>(`${this.baseHardwareUrl + id + '/update'}`, Hardware).pipe(
      tap(() => this.loadAllHardwares(1))  // Обновить список после изменения
    ).subscribe();
  }

  createHardware(NewHardware: NewHardware, architectureId: number): void {
    this.httpClient.post<Hardware>(`${this.baseHardwareUrl + architectureId + '/ecu'}`, NewHardware).pipe(
      tap(() => this.loadAllHardwares(architectureId))  // Обновить список после добавления
    ).subscribe(); 
  }


    deleteHardware(id: BigInt): void {
      this.httpClient.delete<Hardware>(`${this.baseHardwareUrl + id + '/delete'}`).pipe(
        tap(() => this.loadAllHardwares(1))  // Обновить список после удаления
      ).subscribe();
    }

  //---------------Architecture

  getAllArchitecturesUrl = "http://localhost:8080/api/architecture"
  getAllArchitectures():Observable<Architecture[]>{
    return this.httpClient.get<Architecture[]>(`${this.getAllArchitecturesUrl}`);
  }

  createArchitecturesUrl = "http://localhost:8080/api/architecture"
  createArchitecture(newArchitecture: newArchitecture): Observable<any> {
    console.log(newArchitecture);
    return this.httpClient.post<any>(`${this.createArchitecturesUrl}`, newArchitecture);
}


  //--------------Software(property)

  softwareUrl = "http://localhost:8080/api/ecus"
  getAllSoftwareByEcuId(id: BigInt):Observable<Software[]>{
    return this.httpClient.get<Software[]>(`${this.softwareUrl + '/' + id + '/softwares' }`);
  }

  createSoftware(NewSoftware: NewSoftware, id: BigInt): Observable<any> {
      console.log(NewSoftware);
      return this.httpClient.post<any>(`${this.softwareUrl + '/' + id + '/software'}`, NewSoftware);
  }


  //--------------Hardware(property)

  hardwareUrl = "http://localhost:8080/api/ecus"
  getAllHardwareByEcuId(id: BigInt):Observable<HardwareProperty[]>{
    return this.httpClient.get<HardwareProperty[]>(`${this.hardwareUrl + '/' + id + '/hardwares' }`);
  }

  createHardwareProperty(NewHardware: NewHardwareProperty, id: BigInt): Observable<any> {
    console.log(NewHardware);
    return this.httpClient.post<any>(`${this.hardwareUrl + '/' + id + '/hardware'}`, NewHardware);
}

//---------------------Service

serviceUrl = "http://localhost:8080/api/services/ecu/"
getAllServicesByEcuId(ecu_id: BigInt):Observable<Service[]>{
  return this.httpClient.get<Service[]>(`${this.serviceUrl + ecu_id }`);
}

creareServiceUrl = 'http://localhost:8080/api/services/';
createService(newService: newService, ecu_id: number): Observable<any> {
    return this.httpClient.post<any>(`${this.creareServiceUrl + ecu_id}`, newService);
}

updateServiceUrl = "http://localhost:8080/api/services/"
updadeService(Service: Service, id: BigInt):Observable<any>{
  return this.httpClient.put(`${this.updateServiceUrl + id  + '/update'}`, Service);
}

deleteServiceUrl = 'http://localhost:8080/api/services/';
deleteService(id: BigInt): Observable<any> {
  return this.httpClient.delete(`${this.deleteServiceUrl + id + '/delete'}`);
  }




}
