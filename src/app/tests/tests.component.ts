import { Component, OnInit } from '@angular/core';
import { StaffReceivingTheGuardSettings } from 'app/interfaces';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {

  settings: StaffReceivingTheGuardSettings = {
    testing: true,
    guardStatus: "REGULAR",
    percentage: 100,
    showTokenField: true,
    showNameField: true,
    showProtocolField: true,
    showHealthConditionField: true,
    showCheckInField: true,
    showGuardStatusField: true,
  }

  constructor() { }

  ngOnInit(): void {
  }

}
