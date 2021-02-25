import {Component, OnInit} from '@angular/core';
import {MainService} from '../services/main.service';
import {Subscription} from 'rxjs';
import {Todo} from '../models/Todo.model';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private mainService: MainService) {
  }

  getUrlEndpoint = 'https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/get';
  patchUrlEndpoint = 'https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/patch/';
  private dataSub: Subscription;
  form: FormGroup;
  // mainData: Todo[];
  mainData: Todo[] = [
    {id: '1', description: 'File 2020 Taxes', isComplete: true, dueDate: '2020-03-10T17:50:44.673Z'},
    {id: '2', description: 'Fold laundry', isComplete: true, dueDate: null},
    {id: '3', description: 'Call Mom', isComplete: false, dueDate: '2020-06-26T19:00:00.000Z'},
    {id: '4', description: 'Walk the dog', isComplete: false, dueDate: null},
    {id: '5', description: 'Feed the cat', isComplete: false, dueDate: '2020-06-24T15:45:00.000Z'},
    {id: '6', description: 'Run LA marathon', isComplete: false, dueDate: '2021-03-21T13:30:00.000Z'}
  ];

  ngOnInit(): void {
    this.form = new FormGroup({});
    this.dataSub = this.mainService.listUpdate.subscribe(
      (data) => {
        if (data) {
          // this.configureData(data);
        }
      }
    );
    // this.mainService.getList(this.getUrlEndpoint);
    this.configureData(this.mainData);
    for (const item of this.mainData) {
      this.form.addControl('todo' + item.id, new FormControl(item.isComplete));
    }
  }

  configureData(data: any): void {
    // Turn date string into date
    for (const item of data) {
      if (item.dueDate) {
        item.dueDate = new Date(item.dueDate);
      }
    }
    // Create completed array
    const completedItems = data.filter((item) => {
      return item.isComplete;
    });
    // Remove completed items from data
    for (const item of completedItems) {
      const i = data.indexOf(item);
      data.splice(i, 1);
    }
    // Create dateless item array
    const datelessItems = data.filter((item) => {
      return item.dueDate === null;
    });
    // Remove dateless items from data
    for (const item of datelessItems) {
      const i = data.indexOf(item);
      data.splice(i, 1);
    }
    // Sort data that is not complete and has a date
    const sortedData = data.sort((a, b) => a.dueDate - b.dueDate);
    //  Add dateless items to end of array
    for (const item of datelessItems) {
      sortedData.push(item);
    }
    //  Add completed items to end of array
    for (const item of completedItems) {
      sortedData.push(item);
    }
    // Format date into date string according to locale
    for (const item of sortedData) {
      if (item.dueDate) {
        item.dueDate = item.dueDate.toLocaleDateString(undefined, {month: '2-digit', day: '2-digit', year: 'numeric'});
      }
    }
    this.mainData = sortedData;
  }

  submitCheck(id: string): void {
    console.log(id);
    const todoObj = this.mainData.find(obj => {
      return obj.id === id;
    });
    const i = this.mainData.indexOf(todoObj);
    const newVal = !this.mainData[i].isComplete;
    this.mainService.patchTodo(this.patchUrlEndpoint, id, newVal);
    this.mainData[i].isComplete = newVal;
  }

  checkStatusStyle(item: Todo): string {
    if (item.isComplete) {
      return 'complete';
    }
    if (item.dueDate) {
      const d = new Date(item.dueDate);
      const now = new Date();
      if (now > d) {
        return 'overdue';
      }
    }
  }
}
