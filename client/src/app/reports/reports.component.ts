import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReportsService} from "./reports.service";
import {AppService} from "../app.service";
import {Emoji} from '../emoji';
import {MatTabChangeEvent} from '@angular/material';

import * as Chart from 'chart.js';

@Component({
    selector: 'app-reports-component',
    templateUrl: 'reports.component.html',
    styleUrls: ['./reports.component.css'],
})





export class ReportsComponent implements AfterViewInit, OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public emojis: Emoji[];
    public filteredEmojis: Emoji[];
    public userID: string = localStorage.getItem('userID');
    public dateFilteredEmojis: Emoji[] = [];
    public pastWeekEmojis: Emoji[] = [];
    public pastMonthEmojis: Emoji[] = [];
    public pastYearEmojis: Emoji[] = [];

    public userEmail: string = localStorage.getItem('email');

    public prefilteredEmojis: Emoji[];
    public chartEmojis: Emoji[];

    //filter date will be used
    public startDate: any;
    public endDate: any;
    getDate: any;

    moodOneColor: string;
    moodTwoColor: string;
    moodThreeColor: string;
    moodFourColor: string;
    moodFiveColor: string;

    nowStamp = new Date(Date.now());
    nowUnix = this.nowStamp.getTime();
    nowDay = this.nowStamp.getDay();
    nowDate = this.nowStamp.getDate();
    nowMonth = this.nowStamp.getMonth();

    lastWeekUnix = this.nowUnix - 604800000;
    lastWeekStamp = new Date(this.lastWeekUnix);
    lastMonthUnix = this.nowUnix - 2628000000;
    lastMonthStamp = new Date(this.lastMonthUnix);
    lastMonth = this.lastMonthStamp.getMonth();
    lastYearUnix = this.nowUnix - 31540000000;
    lastYearStamp = new Date(this.lastYearUnix);

    /** --------------------------------------- **/
    timeZone: number = -5;
    //timeZone offsets the hour from UTC.
    //Currently everything is passed around as UTC.
    //This changes it to CDT for display
    /** --------------------------------------- **/


    canvas: any;
    ctx: any;
    myChart:any;

    limitedPast = false;
    graphMode = 'line';
    chart = 'myChart';
    public inputType = "week";



    // Inject the EmojiListService into this component.
    constructor(public reportsService: ReportsService, public appService: AppService) {

    }



//Filters are not include in the shopping, but Song thinks we may need that in the future.
    public filterEmojis(start, end): Emoji[] {

        this.filteredEmojis = this.emojis;

        // Filter by startDate
        if (start != null) {

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate >= start;
            });
        }

        // Filter by endDate
        if (end != null) {

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate <= end;
            });
        }

        this.prefilteredEmojis = this.filteredEmojis;
        return this.filteredEmojis;
    }

    //define the list for emojis of a week
    public pastWeekEmotions():Emoji[]{
        this.pastWeekEmojis = this.filterEmojis(this.lastWeekStamp,this.nowStamp);
        return this.pastWeekEmojis;
    }

    //define the list for emojis of a month
    public pastMonthEmotions():Emoji[]{
        this.pastMonthEmojis = this.filterEmojis(this.lastMonthStamp,this.nowStamp);
        return this.pastMonthEmojis;
    }

    //define the list for emojis of a year
    public pastYearEmotions():Emoji[]{
        this.pastYearEmojis = this.filterEmojis(this.lastYearStamp,this.nowStamp);
        return this.pastYearEmojis;
    }


    filterGraphData(dateValue,mood):number{

        let filterChartData = this.filteredEmojis.filter(emoji => {
            return !mood.toString() || emoji.mood.toString().indexOf(mood.toString()) !== -1;
        });

        if (this.inputType == "week"){
            if(this.inputType == "week") {
                if(this.limitedPast) {
                    filterChartData = this.pastWeekEmotions();
                }
            filterChartData = filterChartData.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate.getDay() == dateValue;
            });
        }

        /*We didn't sell this
        else if(this.inputType == "month"){
                if(this.limitedPast) {
                    filterChartData = this.pastMonthEmotions();
                }
                filterChartData = filterChartData.filter(emoji => {
                    this.getDate = new Date(emoji.date);
                    return this.getDate.getDate() == dateValue;
                });
            }
            */
        }

        else if(this.inputType == "year"){
            if(this.limitedPast) {
                filterChartData = this.pastYearEmotions();
            }
            filterChartData = filterChartData.filter(emoji => {
                this.getDate = new Date(emoji.date);
                return this.getDate.getMonth() == dateValue;
            });

        }

        return filterChartData.length;

    }


    public modDay(day: number): Number {
        if(this.limitedPast){
            return (this.nowDay + 1 + day)%7;
        }
        else {
            return day;
        }
    }


    public modMonth(month: number): Number {
        if(this.limitedPast){
            return (this.nowMonth + 1 + month)%12;
        }
        else {
            return month;
        }
    }



    public getPastDays(weekDay: number): String {

        let thisDay = (this.nowDay + 1 + weekDay)%7;

        let strDay = '';

        if(thisDay == 0){
            strDay = 'Sun';
        }
        if(thisDay == 1){
            strDay = 'Mon';
        }
        if(thisDay == 2){
            strDay = 'Tues';
        }
        if(thisDay == 3){
            strDay = 'Wed';
        }
        if(thisDay == 4){
            strDay = 'Thurs';
        }
        if(thisDay == 5){
            strDay = 'Fri';
        }
        if(thisDay == 6){
            strDay = 'Sat';
        }
        return strDay;
    }

    public getPastMonths(monthNum: number): String {
        let thisMonth = (this.nowMonth + 1 + monthNum)%12;

        let strMonth = '';

        if(thisMonth == 0){
            strMonth = 'Jan';
        }
        if(thisMonth == 1){
            strMonth = 'Feb';
        }
        if(thisMonth == 2){
            strMonth = 'Mar';
        }
        if(thisMonth == 3){
            strMonth = 'Apr';
        }
        if(thisMonth == 4){
            strMonth = 'May';
        }
        if(thisMonth == 5){
            strMonth = 'June';
        }
        if(thisMonth == 6){
            strMonth = 'July';
        }
        if(thisMonth == 7){
            strMonth = 'Aug';
        }
        if(thisMonth == 8){
            strMonth = 'Sep';
        }
        if(thisMonth == 9){
            strMonth = 'Oct';
        }
        if(thisMonth == 10){
            strMonth = 'Nov';
        }
        if(thisMonth == 11){
            strMonth = 'Dec';
        }
        return strMonth;
    }


    public getDailyData(mood){
        return [
            this.filterGraphData(this.modDay(0), mood),
            this.filterGraphData(this.modDay(1), mood),
            this.filterGraphData(this.modDay(2), mood),
            this.filterGraphData(this.modDay(3), mood),
            this.filterGraphData(this.modDay(4), mood),
            this.filterGraphData(this.modDay(5), mood),
            this.filterGraphData(this.modDay(6), mood)
        ]

    }

    public getMonthlyData(mood){
        return [
            this.filterGraphData(this.modMonth(0), mood),
            this.filterGraphData(this.modMonth(1), mood),
            this.filterGraphData(this.modMonth(2), mood),
            this.filterGraphData(this.modMonth(3), mood),
            this.filterGraphData(this.modMonth(4), mood),
            this.filterGraphData(this.modMonth(5), mood),
            this.filterGraphData(this.modMonth(6), mood),
            this.filterGraphData(this.modMonth(7), mood),
            this.filterGraphData(this.modMonth(8), mood),
            this.filterGraphData(this.modMonth(9), mood),
            this.filterGraphData(this.modMonth(10), mood),
            this.filterGraphData(this.modMonth(11), mood),
        ]
    }

    public getTypeData(type,mood){
        if(type == "week"){
            return this.getDailyData(mood);
        }
        else{
            return this.getMonthlyData(mood);
        }

    }

    public pastDays = [
        this.getPastDays(0),
        this.getPastDays(1),
        this.getPastDays(2),
        this.getPastDays(3),
        this.getPastDays(4),
        this.getPastDays(5),
        this.getPastDays(6)
    ];

    public pastMonths = [
        this.getPastMonths(0),
        this.getPastMonths(1),
        this.getPastMonths(2),
        this.getPastMonths(3),
        this.getPastMonths(4),
        this.getPastMonths(5),
        this.getPastMonths(6),
        this.getPastMonths(7),
        this.getPastMonths(8),
        this.getPastMonths(9),
        this.getPastMonths(10),
        this.getPastMonths(11)
    ];

    buildChart(){
        let stackStatus = false;
        if(this.graphMode == 'bar'){
            stackStatus = true;
        }

        this.canvas = document.getElementById(this.chart);
        this.ctx = this.canvas;

        let xLabel;
        let days;
        let months;


        if(this.limitedPast){
            days = this.pastDays;
            months = this.pastMonths;
        }
        else {
            days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

            months = [
                'Jan', 'Feb', 'Mar','Apr', 'May', 'June',
                'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        }

        if (this.inputType == "week") {
            xLabel = days;
        }
        else {
            xLabel = months;
        }

        this.moodOneColor = "rgb(64,255,0)";
        this.moodTwoColor = "rgb(0,128,255)";
        this.moodThreeColor = "rgb(100,100,100)";
        this.moodFourColor = "rgb(255,0,0)";
        this.moodFiveColor = "rgb(255,128,0)";

        console.log(this.inputType);


        this.myChart = new Chart(this.ctx, {
            type: this.graphMode,
            data: {
                labels: xLabel,
                datasets: [
                    {
                        "label": "Frustrated/Angry",
                        "data": this.getTypeData(this.inputType, '1'),
                        hidden: false,
                        "fill": false,
                        "borderColor": this.moodOneColor,
                        "lineTension": 0.2,
                        "backgroundColor": this.moodOneColor,
                    },
                    {
                        "label": "Worried/Anxious",
                        "data": this.getTypeData(this.inputType, '2'),
                        hidden: false,
                        "fill": false,
                        "borderColor": this.moodTwoColor,
                        "lineTension": 0.2,
                        "backgroundColor": this.moodTwoColor,
                    },
                    {
                        "label": "Happy/Content/Ecstatic",
                        "data": this.getTypeData(this.inputType, '3'),
                        hidden: false,
                        "fill": false,
                        "borderColor": this.moodThreeColor,
                        "lineTension": 0.2,
                        "backgroundColor": this.moodThreeColor,
                    },
                    {
                        "label": "Meh/Bleh",
                        "data": this.getTypeData(this.inputType, '4'),
                        hidden: false,
                        "fill": false,
                        "borderColor": this.moodFourColor,
                        "lineTension": 0.2,
                        "backgroundColor": this.moodFourColor,
                    },
                    {
                        "label": "Unhappy/Sad/Miserable",
                        "data": this.getTypeData(this.inputType, '5'),
                        hidden: false,
                        "fill": false,
                        "borderColor": this.moodFiveColor,
                        "lineTension": 0.2,
                        "backgroundColor": this.moodFiveColor,
                    }
                ]
            },
            options: {
                scales: {
                    xAxes: [{ stacked:stackStatus}],
                    yAxes: [{
                        stacked: stackStatus,
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }



    /**<mat-tab label="Line Chart">
     <div id="chartdiv" layout="row" layout-align="center">
     <canvas id="myChart" width="500" height="500"></canvas>
     </div>
     </mat-tab>
     * Starts an asynchronous operation to update the emojis list
     *
     */

    ngAfterViewInit(): void {
        //this.buildFakeChart();
        this.buildChart();
    }

    refreshEmojis(): Observable<Emoji[]> {
        // Get Emojis returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const emojiListObservable: Observable<Emoji[]> = this.reportsService.getEmojis();
        emojiListObservable.subscribe(
            emojis => {
                this.emojis = emojis;
                this.filterEmojis(this.startDate, this.endDate);
            },
            err => {
                console.log(err);
            });
        return emojiListObservable;
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        console.log(tabChangeEvent.tab.textLabel);
        this.graphMode = 'bar';
        this.chart = 'myBar';
        this.buildChart();
    }


    ngOnInit(): void {
        this.refreshEmojis();
    }

}
