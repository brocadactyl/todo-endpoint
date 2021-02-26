import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Todo} from '../models/Todo.model';
import {DataFlowService} from './data-flow.service';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private httpClient: HttpClient, public dataFlowService: DataFlowService) {
  }

  getUrlEndpoint = 'https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/get';
  patchUrlEndpoint = 'https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/patch/';
  apiKey = 'PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c';
  listUpdate = new Subject<Todo[]>();
  patchUpdate = new Subject<any>();
  showCompleted = true;

  getList(): void {
    this.dataFlowService.isDataTransferring = true;
    this.getListData(this.getUrlEndpoint).subscribe(
      (response) => {
        this.dataFlowService.isDataTransferring = false;
        this.listUpdate.next(response.body);
      }, error => {
        this.dataFlowService.isDataTransferring = false;
        this.dataFlowService.dataError = true;
        console.log('Error:', error);
      }
    );
  }

  getListData(listEndpointUrl): Observable<HttpResponse<Todo[]>> {
    return this.httpClient.get<Todo[]>(
      listEndpointUrl, {
        headers: {'X-Api-Key': this.apiKey},
        observe: 'response'
      });
  }

  patchTodo(id: string, isComplete: boolean): void {
    this.dataFlowService.isDataTransferring = true;
    this.patchData(this.patchUrlEndpoint + id, isComplete).subscribe(
      (response) => {
        this.dataFlowService.isDataTransferring = false;
        if (response.body.status === 'success') {
          const patchObj = { id, isComplete };
          this.patchUpdate.next(patchObj);
        }
      }, error => {
        this.dataFlowService.isDataTransferring = false;
        this.dataFlowService.dataError = true;
        console.log('Error:', error);
      }
    );
  }

  patchData(patchUrlEndpoint, isComplete): Observable<HttpResponse<any>> {
    return this.httpClient.patch<any>(
      patchUrlEndpoint, { isComplete }, {
        headers: new HttpHeaders({'X-Api-Key': this.apiKey, 'Content-Type': 'application/json'}),
        observe: 'response'
      });
  }

  toggleShowCompleted(): void {
    setTimeout(() => {
      this.showCompleted = !this.showCompleted;
    }, 200);
  }
}
