import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-header',
  templateUrl: './new-header.component.html',
  styleUrls: ['./new-header.component.css']
})
export class NewHeaderComponent implements OnInit {
  @Input() new: any;
  @Input() client: any;
  constructor() { }

  ngOnInit(): void {
  }

}
