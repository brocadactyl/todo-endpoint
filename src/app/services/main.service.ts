import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Todo} from '../models/Todo.model';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private httpClient: HttpClient) {
  }

  getUrlEndpoint = 'https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/get';
  patchUrlEndpoint = 'https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/patch/';
  apiKey = 'PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c';
  mainData: Todo[];
  listUpdate = new Subject<Todo[]>();

  getList(): void {
    this.getListData(this.getUrlEndpoint).subscribe(
      (response) => {
        this.listUpdate.next(response.body);
        console.log(response);
      }, error => {
        console.log('Error:', error);
      }
    );
  }

  // Observable Type ??
  getListData(listEndpointUrl): Observable<any> {
    return this.httpClient.get<any>(
      listEndpointUrl, {
        headers: {'X-Api-Key': this.apiKey},
        observe: 'response'
      });
  }

  patchTodo(patchEndpointUrl: string, id: string, isComplete: boolean): any {
    this.patchData(patchEndpointUrl + id, isComplete).subscribe(
      (response) => {
        console.log('POST call successful id returned in body', response);
        console.log('data', this.mainData);
        const i = this.findTodoObjIndex(id);
        // if (response.body.status === 'success') {
        //   this.mainData[i].isComplete = isComplete;
        //   console.log('data2', this.mainData);
        // }
      }, error => {
        console.log('Error:', error);
      }
    );
  }

  patchData(patchEndpointUrl, isComplete): Observable<any> {
    return this.httpClient.patch<any>(
      patchEndpointUrl, {isComplete}, {
        headers: new HttpHeaders({'X-Api-Key': this.apiKey, 'Content-Type': 'application/json'}),
        observe: 'response'
      });
  }

  submitCheck(id: string): void {
    console.log(id);
    const i = this.findTodoObjIndex(id);
    const newVal = !this.mainData[i].isComplete;
    this.patchTodo(this.patchUrlEndpoint, id, newVal);
  }

  findTodoObjIndex(id: string): number {
    const todoObj = this.mainData.find(obj => {
      return obj.id === id;
    });
    const i = this.mainData.indexOf(todoObj);
    return i;
  }
}
