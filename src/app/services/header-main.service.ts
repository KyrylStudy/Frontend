import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Line } from '../shared/models/line';
import { NewLine } from '../shared/models/line';
import { HttpClient } from '@angular/common/http';
import {Architecture} from '../shared/models/architectures'
import { DataStream } from '../shared/models/data_stream';
import { NewDataStream } from '../shared/models/data_stream';

//import { sample_connections } from '../../data';


@Injectable({
  providedIn: 'root'
})
export class LineCreationService {
  private creatingLineSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  creatingLine$: Observable<boolean> = this.creatingLineSubject.asObservable();

  setCreatingLine(value: boolean): void {
    this.creatingLineSubject.next(value);
  }

  baseUrl = "http://localhost:8080/api/bus/"
  constructor(private httpClient: HttpClient) { }


//-----------------------------------------------------Bus------------------
  getAllBus(architectureId: number): Observable<Line[]>{

    return this.httpClient.get<Line[]>(`${this.baseUrl + 'architecture/' + architectureId}`);
  }

  /** PUT: update the hero on the server */
  updateBus(Line: Line, id: BigInt): Observable<any> {
  return this.httpClient.put(`${this.baseUrl + id + '/' + 'update'}`, Line);
  }

  //createBusUrl = 'http://localhost:8080/api/bus';
  createBus(architectureId: number, NewLine: NewLine): Observable<any> {
      //var url = this.baseUrl + "/" + Line.id;
      //console.log(EcuPost);
      return this.httpClient.post<any>(`${this.baseUrl + architectureId}`, NewLine);
  }

  
  //deleteBusUrl = 'http://localhost:8080/api/bus/';
  deleteBus(id: BigInt): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl + id + '/delete'}`);
    }

    //------------------------------------Data---Stream----------

    baseDataStreamUrl = "http://localhost:8080/api/data-stream"
    getAllDataStreams(architectureId: number): Observable<DataStream[]>{

      return this.httpClient.get<DataStream[]>(`${this.baseDataStreamUrl + '/' + 'architecture/' + architectureId}`);
    }
  
    /** PUT: update the hero on the server */
    updateDataStream(DataStream: DataStream, id: BigInt): Observable<any> {
    return this.httpClient.put(`${this.baseDataStreamUrl + '/' + id + '/' + 'update'}`, DataStream);
    }
  
    //createDataStreamUrl = 'http://localhost:8080/api/data-stream';
    createDataStream(architectureId: number, NewDataStream: NewDataStream): Observable<any> {
        //var url = this.baseUrl + "/" + Line.id;
        //console.log(EcuPost);
        return this.httpClient.post<any>(`${this.baseDataStreamUrl + '/' + architectureId}`, NewDataStream);
    }
  
    
    //deleteDataStreamUrl = 'http://localhost:8080/api/baseDataStreamUrl/';
    deleteDataStream(id: BigInt): Observable<any> {
      return this.httpClient.delete(`${this.baseDataStreamUrl + id + '/delete'}`);
      }


}
