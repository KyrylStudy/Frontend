import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Service } from '../shared/models/service';
import { EcuService } from './ecu.service';
import { Hardware } from '../shared/models/hardware';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private httpClient: HttpClient, private ecuService:EcuService,) { }

  hardwares: Hardware[] | null = null;
  subscribeOnHardwares(){
    console.log("srgrdhrthrt", this.hardwares)
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


  
  ngOnInit(): void{
    this.subscribeOnHardwares();
    //this.ecuService.loadAllHardwares(1);
    //console.log("srgrdhrthrt", this.hardwares)

  }


  //---------------------Service

private servicesSubject = new BehaviorSubject<Service[]>([]);
services$ = this.servicesSubject.asObservable();

serviceUrl = "http://localhost:8080/api/services/"

getAllServicesByEcuId(ecu_id: BigInt):Observable<Service[]>{
  return this.httpClient.get<Service[]>(`${this.serviceUrl + 'ecu/' + ecu_id }`);
}

loadAllServices(ecuId: BigInt): void{
  this.httpClient.get<Service[]>(`${this.serviceUrl + 'ecu/' + ecuId }`).pipe(
    tap(services => this.servicesSubject.next(services))
  ).subscribe();
}

//creareServiceUrl = 'http://localhost:8080/api/services/';
/*createService(newService: newService, ecu_id: BigInt): Observable<any> {
    return this.httpClient.post<any>(`${this.serviceUrl + ecu_id}`, newService);
}*/

//updateServiceUrl = "http://localhost:8080/api/services/"
updadeService(Service: Service, id: BigInt):Observable<any>{
  return this.httpClient.put(`${this.serviceUrl + id  + '/update'}`, Service);
}

//deleteServiceUrl = 'http://localhost:8080/api/services/';
deleteService(id: BigInt): Observable<any> {
  return this.httpClient.delete(`${this.serviceUrl + id + '/delete'}`);
}





servicesCountMap: Map<BigInt, number> = new Map();
servicesMap: Map<BigInt, Service[]> = new Map();

private allServicesInArchitectureCountMapSubject = new BehaviorSubject<Map<BigInt, number>>(new Map());
allServicesInArchitectureCountMap$ = this.allServicesInArchitectureCountMapSubject.asObservable();

private allServicesInArchitectureMapSubject = new BehaviorSubject<Map<BigInt, Service[]> >(new Map());
allServicesInArchitectureMao$ = this.allServicesInArchitectureMapSubject.asObservable();


  getAllServices(): void {
    this.subscribeOnHardwares();
    console.log(this.hardwares)
    // Assuming ecus array is already populated, otherwise, you need to fetch it first
    if (this.hardwares?.length) {

      const serviceObservables = this.hardwares.map(hardware => this.getAllServicesByEcuId(hardware.id).subscribe(
        services => {
          this.servicesMap.set(hardware.id, services);
          this.allServicesInArchitectureMapSubject.next(new Map(this.servicesMap));
          this.servicesCountMap.set(hardware.id, services.length); 
          this.allServicesInArchitectureCountMapSubject.next(new Map(this.servicesCountMap));
          
        }
      )); 
      
    }
  }
}
