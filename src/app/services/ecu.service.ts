import { Injectable } from '@angular/core';
import { Ecu } from '../shared/models/ecu';
import { EcuPost } from '../shared/models/ecu';
//import { sample_ecu } from '../../data';
import { Line } from '../shared/models/line';
//import { sample_lines } from '../../data';
import { HttpClient } from '@angular/common/http';
import { Software } from '../shared/models/software';
import { NewSoftware } from '../shared/models/software';
import { Hardware } from '../shared/models/hardware';
import { NewHardware } from '../shared/models/hardware';
import { BehaviorSubject, Observable } from 'rxjs';
import { Architecture } from '../shared/models/architectures';
import { newArchitecture } from '../shared/models/architectures';
import { Service } from '../shared/models/service';
import { newService } from '../shared/models/service';


@Injectable({
  providedIn: 'root'
})
export class EcuService {

 
  constructor(private httpClient: HttpClient/*, private mainScreenComponent: MainScreenComponent*/) { }

  //---------------ECU
  baseUrl = "http://localhost:8080/api/ecus/architecture"
  getAll(id: number):Observable<Ecu[]>{
    return this.httpClient.get<Ecu[]>(`${this.baseUrl + '/' + id }`);
  }

  updateEcuUrl = "http://localhost:8080/api/ecus";
  updateEcu(Ecu: Ecu, id: BigInt): Observable<any> {
    return this.httpClient.put(`${this.updateEcuUrl + '/' + id + '/' + 'update'}`, Ecu);
  }

  creareEcuUrl = 'http://localhost:8080/api/ecus';
  createEcu(EcuPost: EcuPost, id: number): Observable<any> {
      console.log(EcuPost);
      return this.httpClient.post<any>(`${this.creareEcuUrl + '/' + id + '/' + 'ecu'}`, EcuPost);
  }

  deleteEcuUrl = 'http://localhost:8080/api/ecus/';
  deleteEcu(id: BigInt): Observable<any> {
    return this.httpClient.delete(`${this.deleteEcuUrl + id + '/delete'}`);
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
  getAllHardwareByEcuId(id: BigInt):Observable<Hardware[]>{
    return this.httpClient.get<Hardware[]>(`${this.hardwareUrl + '/' + id + '/hardwares' }`);
  }

  createHardware(NewHardware: NewHardware, id: BigInt): Observable<any> {
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
