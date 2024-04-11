import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LineCreationService {
  private creatingLineSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  creatingLine$: Observable<boolean> = this.creatingLineSubject.asObservable();

  setCreatingLine(value: boolean): void {
    this.creatingLineSubject.next(value);
  }
}
