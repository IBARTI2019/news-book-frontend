import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';

export interface Chart {
	type: ChartType;
	data: Chartist.IChartistData;
	options?: any;
	responsiveOptions?: any;
	events?: ChartEvent;
}

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnInit {
	donuteChart1!: Chart;
	nro_aptos = 18;
	nro_noaptos = 20;
	constructor() {
	}

	ngOnInit(): void {
		this.donuteChart1 = {
			type: 'Pie',
			data: { series: [this.nro_aptos, this.nro_noaptos] },
			options: {
				donut: true,
				height: 260,
				showLabel: false,
				donutWidth: 20
			}
		};

	}

	ngAfterViewInit() {

	}

}
