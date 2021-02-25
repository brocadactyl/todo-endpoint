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

  apiKey = 'PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c';
  listUpdate = new Subject<Todo[]>();

  getList(listEndpointUrl: string): void {
    this.getListData(listEndpointUrl).subscribe(
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
    return this.patchData(patchEndpointUrl + id, isComplete).subscribe(
      (response) => {
        console.log('POST call successful id returned in body', response);
        return response.body;
      }, error => {
        console.log('Error:', error);
      }
    );
  }

  patchData(patchEndpointUrl, isComplete): Observable<any> {
    return this.httpClient.patch<any>(
      patchEndpointUrl, { isComplete }, {
        headers: new HttpHeaders({'X-Api-Key': this.apiKey, 'Content-Type': 'application/json'}),
        observe: 'response'
      });
  }
}
