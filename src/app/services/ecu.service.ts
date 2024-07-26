/*import { Injectable } from '@angular/core';
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
export class EcuService {

 
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


  //--------------Software(property)



  /*softwareUrl = "http://localhost:8080/api/ecus"
  getAllSoftwareByEcuId(id: BigInt):Observable<Software[]>{
    return this.httpClient.get<Software[]>(`${this.softwareUrl + '/' + id + '/softwares' }`);
  }

  createSoftware(NewSoftware: NewSoftware, id: BigInt): Observable<any> {
      console.log(NewSoftware);
      return this.httpClient.post<any>(`${this.softwareUrl + '/' + id + '/software'}`, NewSoftware);
  }
*/

  
//---------------------Service

//private servicesSubject = new BehaviorSubject<Service[]>([]);
//services$ = this.servicesSubject.asObservable();

//serviceUrl = "http://localhost:8080/api/services/"

/*getAllServicesByEcuId(ecu_id: BigInt):Observable<Service[]>{
  return this.httpClient.get<Service[]>(`${this.serviceUrl + 'ecu/' + ecu_id }`);
}*/

/*loadAllServices(ecuId: BigInt): void{
  this.httpClient.get<Service[]>(`${this.serviceUrl + 'ecu/' + ecuId }`).pipe(
    tap(services => this.servicesSubject.next(services))
  ).subscribe();
}*/

//creareServiceUrl = 'http://localhost:8080/api/services/';
/*createService(newService: newService, ecu_id: BigInt): Observable<any> {
    return this.httpClient.post<any>(`${this.serviceUrl + ecu_id}`, newService);
}*/

//updateServiceUrl = "http://localhost:8080/api/services/"
/*updadeService(Service: Service, id: BigInt):Observable<any>{
  return this.httpClient.put(`${this.serviceUrl + id  + '/update'}`, Service);
}*/

//deleteServiceUrl = 'http://localhost:8080/api/services/';
/*deleteService(id: BigInt): Observable<any> {
  return this.httpClient.delete(`${this.serviceUrl + id + '/delete'}`);
}*/

/*hardwares: Hardware[] | null = null;
subscribeOnHardwares(){
  this.ecuService.hardwares$.subscribe(
      {
        next: data => {
          this.hardwares = data;
        },
        error: error => {
          console.error(error);
        }
      }
  );
}


servicesCountMap: Map<BigInt, number> = new Map();
servicesMap: Map<BigInt, Service[]> = new Map();

private allServicesInArchitectureSubject = new BehaviorSubject<Map<BigInt, Service[]> >(new Map());
allServicesInArchitecture$ = this.allServicesInArchitectureSubject.asObservable();


  getAllServices(): void {
    // Assuming ecus array is already populated, otherwise, you need to fetch it first
    if (this.ecus.length > 0) {
      //const serviceObservables: Observable<Service[]>[] = this.ecus.map(ecu => this.ecuService.getAllServicesByEcuId(ecu.id)); 
      const serviceObservables = this.ecus.map(ecu => this.ecuService.getAllServicesByEcuId(ecu.id).subscribe(
        data => {
          this.servicesMap.set(ecu.id, data);
          this.servicesCountMap.set(ecu.id, data.length); 
        }
      )); 
      
      /*forkJoin(serviceObservables).subscribe(serviceArrays => {
        serviceArrays.forEach((services, index) => {
          const ecuId = this.ecus[index].id;
          this.servicesCountMap.set(ecuId, services.length); 
          this.servicesMap.set(ecuId, services);
        });
      });*/
    //}
  //}





//}
