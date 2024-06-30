import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Architecture, NewArchitecture } from '../shared/models/architectures';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArchitectureService {

  constructor(private httpClient: HttpClient) { }

  //---------------Architecture

  private selectedArchitectureSubject = new BehaviorSubject<Architecture | null>(null);
  selectedArchitecture$ = this.selectedArchitectureSubject.asObservable();

  setSelectedArchitecture(selectedArchitecture: Architecture | null): void {
    this.selectedArchitectureSubject.next(selectedArchitecture);
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

    loadArchitecture(id: BigInt): void{
      this.httpClient.get<Architecture>(`${this.baseArchitectureUrl + '/' + id}`).pipe(
        tap(selectedArchitecture => this.selectedArchitectureSubject.next(selectedArchitecture))
      ).subscribe();
  }

  createArchitecture(newArchitecture: NewArchitecture): void {
    this.httpClient.post<Architecture>(`${this.baseArchitectureUrl}`, newArchitecture).pipe(
      tap(() => this.loadAllArchitectures())  // Обновить список после добавления
    ).subscribe(); 
  }

}
