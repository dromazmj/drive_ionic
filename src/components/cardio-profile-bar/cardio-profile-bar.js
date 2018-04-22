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
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { User } from '../../providers/providers';
import { Records } from '../../providers/providers';
import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
var CardioProfileBarComponent = /** @class */ (function () {
    function CardioProfileBarComponent(navParams, navCtrl, user, records, storage) {
        this.navCtrl = navCtrl;
        this.user = user;
        this.records = records;
        this.storage = storage;
        this.margin = { top: 20, right: 20, bottom: 80, left: 0 };
        this.loop = 0;
        this.checkRec = false;
        this.history = [];
        this.tempRec = [];
        this.width = 1000 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.exercise = navParams.get('item');
        this.tempRec = this.records._cardio;
    }
    CardioProfileBarComponent.prototype.makeChart = function () {
        var _this = this;
        this.username = localStorage.getItem("username");
        this.getExercises().then(function (val) {
            var keyOne = _this.exercise.name + '-' + _this.exercise.variation;
            var history = val[keyOne].history;
            _this.loop = 0;
            //console.log(val[keyOne].history);
            if (history) {
                Object.keys(history).forEach(function (workout) {
                    _this.tempRec.forEach(function (value, index) {
                        if (history[workout].minutes >= value.min && history[workout].minutes < value.max) {
                            if (history[workout].mph > value.mph) {
                                _this.tempRec[index].miles = history[workout].miles;
                                _this.tempRec[index].time = history[workout].time;
                                _this.tempRec[index].mph = history[workout].mph;
                                _this.tempRec[index].records++;
                                _this.records._cardioRecords.push(_this.tempRec[index]);
                            }
                        }
                    });
                    if (_this.loop == _this.history.length) {
                        console.log(_this.records._cardioRecords);
                        _this.sortRecords();
                    }
                });
            }
        });
    };
    CardioProfileBarComponent.prototype.sortRecords = function () {
        this.tempRec.sort(function (a, b) {
            if (a.reps < b.reps) {
                return -1;
            }
            else if (a.reps > b.reps) {
                return 1;
            }
            else {
                return 0;
            }
        });
        this.setChart();
    };
    CardioProfileBarComponent.prototype.setChart = function () {
        //d3.selectAll("svg > *").remove();
        this.initSvg();
        this.initAxis();
        this.drawAxis();
        this.drawBars();
    };
    CardioProfileBarComponent.prototype.initSvg = function () {
        this.svg = d3.select("#barCardio")
            .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr('viewBox', '0 0 900 500');
        this.g = this.svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    };
    CardioProfileBarComponent.prototype.initAxis = function () {
        this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
        this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
        this.x.domain(this.records._cardioRecords.map(function (d) { return d.max; }));
        this.y.domain([0, d3Array.max(this.records._cardioRecords, function (d) { return d.mph; })]);
    };
    CardioProfileBarComponent.prototype.drawAxis = function () {
        this.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3Axis.axisBottom(this.x))
            .append("text")
            .attr("class", "axis-title")
            .attr("y", 70)
            .attr("x", this.width / 2)
            .attr("text-anchor", "end")
            .text("Max Minutes");
        this.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3Axis.axisLeft(this.y))
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", -90)
            .attr("x", (this.height / -2) + 20)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("MPH");
    };
    CardioProfileBarComponent.prototype.drawBars = function () {
        var _this = this;
        this.g.selectAll(".bar")
            .data(this.records._cardioRecords)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return _this.x(d.max); })
            .attr("y", function (d) { return _this.y(d.mph); })
            .attr("width", this.x.bandwidth())
            .attr("height", function (d) { return _this.height - _this.y(d.mph); });
    };
    CardioProfileBarComponent.prototype.getExercises = function () {
        return this.storage.get(this.username + '/exercises');
    };
    CardioProfileBarComponent = __decorate([
        Component({
            selector: 'cardio-profile-bar',
            templateUrl: 'cardio-profile-bar.html'
        }),
        __metadata("design:paramtypes", [NavParams,
            NavController,
            User,
            Records,
            Storage])
    ], CardioProfileBarComponent);
    return CardioProfileBarComponent;
}());
export { CardioProfileBarComponent };
//# sourceMappingURL=cardio-profile-bar.js.map