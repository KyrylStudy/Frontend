import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Architecture, NewArchitecture } from '../shared/models/architectures';
import { HttpClient } from '@angular/common/http';
//import { ServiceService } from './service.service';
import { START_ARCHITECTURE } from '../shared/models/architectures';

@Injectable({
  providedIn: 'root'
})
export class ArchitectureService {

  constructor(private httpClient: HttpClient/*, private serviceService: ServiceService*/) { }

  //---------------Architecture

  private selectedArchitectureSubject = new BehaviorSubject<Architecture | null>(START_ARCHITECTURE);
  selectedArchitecture$ = this.selectedArchitectureSubject.asObservable();

  setSelectedArchitecture(selectedArchitecture: Architecture | null): void {
    this.selectedArchitectureSubject.next(selectedArchitecture);
    /*this.selectedArchitectureSubject.pipe(
      tap(selectedArchitecture => this.selectedArchitectureSubject.next(selectedArchitecture))
    ).subscribe();*/
  }

  getSelectedArchitecture(): Observable<Architecture | null> {
    return this.selectedArchitecture$;
  }


  private architecturesSubject = new BehaviorSubject<Architecture[]>([]);
  architectures$ = this.architecturesSubject.asObservable();

  baseArchitectureUrl = "http://localhost:8080/api/architecture"

    loadAllArchitectures(): void{
      this.httpClient.get<Architecture[]>(`${this.baseArchitectureUrl}`).pipe(
        tap(architectures => this.architecturesSubject.next(architectures))
      ).subscribe();
    }

    loadArchitecture(id: BigInt): void {
      this.httpClient.get<Architecture>(`${this.baseArchitectureUrl + '/' + id}`).pipe(
        tap(selectedArchitecture => this.selectedArchitectureSubject.next(selectedArchitecture))
      ).subscribe();
    }

    createArchitecture(newArchitecture: NewArchitecture): void {
      this.httpClient.post<Architecture>(`${this.baseArchitectureUrl}`, newArchitecture).pipe(
        tap(() => this.loadAllArchitectures())  
      ).subscribe(); 
    }

    updateArchitecture(architecture: Architecture, id: BigInt): void {
      this.httpClient.put<Architecture>(`${this.baseArchitectureUrl + '/' + id + '/update'}`, architecture).pipe(
        tap(() => this.loadAllArchitectures())
      ).subscribe();
    }
  
    deleteArchitecture(id: number): void {
      this.httpClient.delete<Architecture>(`${this.baseArchitectureUrl + '/' + id + '/delete'}`).pipe(
        tap(() => {
          this.selectedArchitectureSubject.next(START_ARCHITECTURE)
          this.loadAllArchitectures()
        })  
      ).subscribe();
    }

}
