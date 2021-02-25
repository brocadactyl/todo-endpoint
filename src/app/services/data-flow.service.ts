import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFlowService {

  constructor() { }

  isDataTransferring = false;
  dataError = false;
}
