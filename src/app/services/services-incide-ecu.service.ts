import { Injectable } from '@angular/core';
import { Service } from '../shared/models/service1';
import { sample_service } from '../../data-for-services';

@Injectable({
  providedIn: 'root'
})
export class ServicesIncideEcuService {

  constructor() { }

  getAll(): Service[]{
    return sample_service
  }
}
