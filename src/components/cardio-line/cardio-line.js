var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HistoryProvider } from '../../providers/providers';
import { User } from '../../providers/providers';
import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
var CardioLineComponent = /** @class */ (function () {
    function CardioLineComponent(navParams, user, history, storage) {
        this.user = user;
        this.history = history;
        this.storage = storage;
        this.margin2 = { top: 20, right: 20, bottom: 80, left: 0 };
        this.loop = 0;
        this.width2 = 1000 - this.margin2.left - this.margin2.right;
        this.height2 = 500 - this.margin2.top - this.margin2.bottom;
        this.exercise = navParams.get('item');
    }
    CardioLineComponent.prototype.makeChart2 = function () {
        var _this = this;
        this.username = localStorage.getItem("username");
        this.history._cardioCharts = [];
        this.getExercises().then(function (val) {
            var keyOne = _this.exercise.name + '-' + _this.exercise.variation;
            var history = val[keyOne].history;
            //console.log(val[keyOne].history);
            if (history) {
                Object.keys(history).forEach(function (keyTwo) {
                    var workout = { date: history[keyTwo].date, miles: history[keyTwo].miles, time: history[keyTwo].time, mph: history[keyTwo].mph };
                    _this.history._cardioCharts.push(workout);
                    console.log(_this.history._cardioCharts);
                });
            }
        }).then(function () {
            _this.setChart2();
        });
    };
    CardioLineComponent.prototype.setChart2 = function () {
        this.initSvg();
        this.initAxis();
        this.drawAxis();
        this.drawLine();
    };
    CardioLineComponent.prototype.initSvg = function () {
        this.svg2 = d3.select("#lineChart")
            .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr('viewBox', '0 0 900 500');
        this.g2 = this.svg2.append("g")
            .attr("transform", "translate(" + this.margin2.left + "," + this.margin2.top + ")");
    };
    CardioLineComponent.prototype.initAxis = function () {
        this.x2 = d3Scale.scaleBand().rangeRound([0, this.width2]).padding(0.1);
        this.y2 = d3Scale.scaleLinear().rangeRound([this.height2, 0]);
        this.x2.domain(this.history._cardioCharts.map(function (d) { return d.date; }));
        this.y2.domain([0, d3Array.max(this.history._cardioCharts, function (d) { return d.mph; })]);
    };
    CardioLineComponent.prototype.drawAxis = function () {
        this.g2.append("g")
            .attr("class", "axis axis--y")
            .call(d3Axis.axisLeft(this.y2))
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", -90)
            .attr("x", (this.height2 / -2) + 20)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("MPH");
    };
    CardioLineComponent.prototype.drawLine = function () {
        var _this = this;
        this.line = d3Shape.line()
            .x(function (d) { return _this.x2(d.date); })
            .y(function (d) { return _this.y2(d.mph); });
        this.g2.append("path")
            .datum(this.history._cardioCharts)
            .attr("class", "line")
            .attr("d", this.line);
    };
    CardioLineComponent.prototype.getExercises = function () {
        return this.storage.get(this.username + '/exercises');
    };
    CardioLineComponent = __decorate([
        Component({
            selector: 'cardio-line',
            templateUrl: 'cardio-line.html'
        }),
        __metadata("design:paramtypes", [NavParams,
            User,
            HistoryProvider,
            Storage])
    ], CardioLineComponent);
    return CardioLineComponent;
}());
export { CardioLineComponent };
//# sourceMappingURL=cardio-line.js.map