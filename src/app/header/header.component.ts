import { Component, OnInit } from '@angular/core';
import {DataFlowService} from '../services/data-flow.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public dataFlowService: DataFlowService) { }

  ngOnInit(): void {
  }

}
