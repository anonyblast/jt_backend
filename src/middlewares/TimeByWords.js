// import * as FileReader from "filereader";
import fs from "fs";
import { Sequelize, QueryTypes } from "sequelize";
import config from "../config/config.js";
const sequelize = new Sequelize(config.database, config.user, config.pw, { dialect: 'mysql', host: 'localhost', logging: false });

export default class TimeByWords {
    constructor() {
        this.handleFile = this.handleFile.bind(this);
        this.addKeywords = this.addKeywords.bind(this);
        this.convertTimeToSeconds = this.convertTimeToSeconds.bind(this);
        this.getSubjectByTime = this.getSubjectByTime.bind(this);
        this.arrToTimes = [];
        this.arrKeywords = [];
    }

    addKeywords(words) {
        let separatedKeywords = words.split('|');
        separatedKeywords.forEach(keyword => {
            this.arrKeywords.push(keyword);
        });
        return (this.arrKeywords);
    }

    convertTimeToSeconds(time) {
        let unstructuredTime = time.split(':')

        let hourToSeconds, minToSeconds;

        hourToSeconds = (parseInt(unstructuredTime[0]) * 3600) || 0;
        minToSeconds = (parseInt(unstructuredTime[1]) * 60) || 0;

        let fullSeconds = hourToSeconds + minToSeconds + parseInt(unstructuredTime[2]);
        return (parseInt(fullSeconds));
    }

    getSubjectByTime(timeByChat) {
        return (this.convertTimeToSeconds(timeByChat))
    }

    handleFile(file, keywordsToAdd, recordingID, title) {
        // const reader = new FileReader();
        // let arrTIME_OBJ = new Array();
        // let keywordsToProcess = this.addKeywords(keywordsToAdd);
        // reader.onload = (e) => {
        //     const text = e.target.result;
        //     const lines = text.split('\n');
        //     for (let keyword in keywordsToProcess){
        //         let arr = new Array();
        //         for (let line in lines){
        //             if (lines[line].includes(keywordsToProcess[keyword])){
        //                 arr.push(lines[line]);
        //             }
        //         }
        //         let TIME_OBJ = {
        //             keyword: keywordsToProcess[keyword],
        //             first_time : arr[0],
        //             last_time : arr[arr.length - 1]
        //         }
        //         arrTIME_OBJ.push(TIME_OBJ);
        //     }
        //     for (let time in arrTIME_OBJ)
        //         this.arrToTimes.push(this.convertTimeToSeconds(arrTIME_OBJ[time].first_time));
        //     reader.readAsText(file);
        // }
        // return (this.arrToTimes);
        let arrTIME_OBJ = new Array();
        let keywordsToProcess = this.addKeywords(keywordsToAdd);
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            }
            const lines = data.split('\n');

            for (let keyword in keywordsToProcess) {
                let arr = new Array();
                for (let line in lines) {
                    if (lines[line].match(keywordsToProcess[keyword]) != null && lines[line].match(keywordsToProcess[keyword]) != '')
                        arr.push(lines[line].substring(0, 8));
                }

                let TIME_OBJ = {
                    keyword: keywordsToProcess[keyword],
                    first_time: arr[0],
                    last_time: arr[arr.length - 1]
                }
                arrTIME_OBJ.push(TIME_OBJ);
            }
            for (let time in arrTIME_OBJ)
                this.arrToTimes.push(this.getSubjectByTime(arrTIME_OBJ[time].first_time));
            console.log(this.arrToTimes);
            sequelize.query(`UPDATE \`videos\` SET buttons = '${this.arrToTimes.toString()}' WHERE meeting_id = ${recordingID}`,
                { type: QueryTypes.UPDATE })
                .then(() => {
                    console.log('Updated');
                })
                .catch(err => {
                    console.log('Error');
                });
        });
    }
}