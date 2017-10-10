import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import  { StatsBarChart } from '../../models/item';

import { Items } from '../../providers/providers';
import { BarChartComponent } from '../../components/bar-chart/bar-chart';


import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

@IonicPage()
@Component({
  selector: 'page-exercise-detail',
  templateUrl: 'exercise-detail.html'
})
export class ItemDetailPage {
  item: any;
  xlevel = 1;
	xcurrent = 25;
	xtotal = 100;
	progress = 75;

  records = [
    { reps: 1, weight: 0, oneRM: 0, records: 0 },
    { reps: 2, weight: 0, oneRM: 0, records: 0 },
    { reps: 3, weight: 0, oneRM: 0, records: 0 },
    { reps: 4, weight: 0, oneRM: 0, records: 0 },
    { reps: 5, weight: 185, oneRM: 225, records: 1 },
    { reps: 6, weight: 0, oneRM: 0, records: 0 },
    { reps: 8, weight: 0, oneRM: 0, records: 0 },
    { reps: 10, weight: 135, oneRM: 225, records: 1 },
    { reps: 12, weight: 0, oneRM: 0, records: 0 },
    { reps: 15, weight: 0, oneRM: 0, records: 0 }
  ];

  history = [
    { date: '9-20-17', weight: 135, reps: 10, oneRM: 225},
    { date: '9-21-17', weight: 185, reps: 5, oneRM: 225}
  ]

  title = 'D3 Barchart with Ionic 3';

  width: number;
  height: number;
  margin = {top: 20, right: 20, bottom: 30, left: 40};

  x: any;
  y: any;
  svg: any;
  g: any;

  buttonClicked: boolean = false;



  constructor(public navCtrl: NavController, navParams: NavParams, items: Items) {
    this.item = navParams.get('item') || items.defaultItem;
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  onButtonClick() {
    this.initSvg()
    this.initAxis();
    this.drawAxis();
    this.drawBars();
  }

  ionViewDidLoad() {
    this.initSvg()
    this.initAxis();
    this.drawAxis();
    this.drawBars();
  }

  initSvg() {

    this.svg = d3.select("#barChart")
        .append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr('viewBox','0 0 900 500');
    this.g = this.svg.append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  initAxis() {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(StatsBarChart.map((d) => d.company));
    this.y.domain([0, d3Array.max(StatsBarChart, (d) => d.frequency)]);
  }

  drawAxis() {
    this.g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3Axis.axisBottom(this.x));
    this.g.append("g")
        .attr("class", "axis axis--y")
        .call(d3Axis.axisLeft(this.y))
        .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");
  }

  drawBars() {
    this.g.selectAll(".bar")
        .data(StatsBarChart)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d) => this.x(d.company) )
        .attr("y", (d) => this.y(d.frequency) )
        .attr("width", this.x.bandwidth())
        .attr("height", (d) => this.height - this.y(d.frequency) );
  }

}
