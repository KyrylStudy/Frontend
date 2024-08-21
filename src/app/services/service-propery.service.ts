import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ServiceProperty, NewServiceProperty } from '../shared/models/service_property';

@Injectable({
  providedIn: 'root'
})
export class ServiceProperyService {

  constructor(private httpClient: HttpClient,) { }

  //--------------Hardware(property)

  private serviceProreriesSubject = new BehaviorSubject<ServiceProperty[]>([]);
  serviceProreries$ = this.serviceProreriesSubject.asObservable();

  servicePropertyUrl = "http://localhost:8080/api/"

  loadAllServiceProperties(serviceId: BigInt): void{
    this.httpClient.get<ServiceProperty[]>(`${this.servicePropertyUrl + "service_properties/" + serviceId }`).pipe(
      tap(serviceProreries => this.serviceProreriesSubject.next(serviceProreries))
    ).subscribe();
  }

  createServiceProperty(newServiceProperty: NewServiceProperty, serviceId: BigInt): void {
    this.httpClient.post<NewServiceProperty>(`${this.servicePropertyUrl + "service_property/" + serviceId}`, newServiceProperty).pipe(
      tap(() => this.loadAllServiceProperties(serviceId))  
    ).subscribe(); 
  }

  updateServiceProperty(serviceProperty: ServiceProperty, id: BigInt, serviceId: BigInt): void {
    this.httpClient.put<ServiceProperty>(`${this.servicePropertyUrl + 'service_property/' + id + '/update'}`, serviceProperty).pipe(
      tap(() => this.loadAllServiceProperties(serviceId))  
    ).subscribe();
  }

  deleteServiceProperty(id: BigInt, serviceId: BigInt): void {
    this.httpClient.delete<ServiceProperty>(`${this.servicePropertyUrl + 'service_property/' + id + '/delete'}`).pipe(
      tap(() => this.loadAllServiceProperties(serviceId))  
    ).subscribe(); 
  }
}
