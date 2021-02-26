import {Component, OnInit, ViewChild} from '@angular/core';
import {DataFlowService} from '../services/data-flow.service';
import {MatMenuTrigger} from '@angular/material/menu';
import {MainService} from '../services/main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor(public dataFlowService: DataFlowService, public mainService: MainService) {
  }

  ngOnInit(): void {
  }

}
