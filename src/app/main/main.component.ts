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

  private dataSub: Subscription;
  private patchSub: Subscription;
  form: FormGroup;
  mainData: Todo[];

  ngOnInit(): void {
    this.form = new FormGroup({});
    this.dataSub = this.mainService.listUpdate.subscribe(
      (data) => {
        if (data) {
          this.configureData(data);
          for (const item of this.mainData) {
            this.form.addControl('todo' + item.id, new FormControl(item.isComplete));
          }
        }
      }
    );
    this.mainService.getList();
    this.patchSub = this.mainService.patchUpdate.subscribe(
      (data) => {
        if (data) {
          this.form.get('todo' + data.id).setValue(data.isComplete);
          this.mainData[this.getTogoObjIndex(data.id)].isComplete = data.isComplete;
          this.configureData(this.mainData);
        }
      }
    );
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

  submitCheck(event: Event, id: string): void {
    // Stop checkbox from being checked, waits for server response
    event.preventDefault();
    const newVal = !this.mainData[this.getTogoObjIndex(id)].isComplete;
    this.mainService.patchTodo(id, newVal);
  }

  getTogoObjIndex(id: string): number {
    const todoObj = this.mainData.find(obj => {
      return obj.id === id;
    });
    return this.mainData.indexOf(todoObj);
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
