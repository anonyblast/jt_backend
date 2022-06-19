// const express = require("express");
// const router = express.Router();
// const token = require("../config/token");
// const rp = require("request-promise");
// const fetch = require("node-fetch");
import { Router } from "express";
import token from "../config/token.js";
import pkg from "request-promise";
import ZoomDownloader from "../middlewares/ZoomDownloader.js";
import Recording from "../models/Recording.js";

const router = Router();

router.get("/:userID/listRecordings", (req, res) => {
    const { userID } = req.params;
    // O formato da data é YYYY-MM-DD
    const {from, to } = req.query;
    const options = {
        method: "GET",
        uri: `https://api.zoom.us/v2/users/${userID}/recordings?from=${from}&to=${to}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        json: true,
    };
    pkg(options)
        .then(function (request) {
            console.log(options.uri);
            console.log(`user : ${JSON.stringify(request)}`);
            let arr = new Array();
            // Se o campo de gravação estiver vazio, ou seja, não houver nenhuma gravação, então retorna um erro
            if (request.total_records === 0) 
                res.status(400).json({error: "No recordings found"});
            for (let element in request.meetings){
                let obj = {
                    id: request.meetings[element].id,
                    start_time: request.meetings[element].start_time,
                    end_time: request.meetings[element].end_time,
                    topic: request.meetings[element].topic,
                    owner : request.meetings[element].host_id
                }
                arr.push(JSON.parse(JSON.stringify(obj)));
            }
            console.log(`arr : ${JSON.stringify(arr)}`);
            return res.status(200).send(request);
        })
        .catch(function (err) {
            console.log(`API call failed, reason ${err}`);
            res.status(404).send(err);
        });
});

router.get('/:recordingID/download', (req, res) => {
    const { recordingID } = req.params;
    const options = {
        method: "GET",
        uri: `https://api.zoom.us/v2/meetings/${recordingID}/recordings`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        json: true,
    };
    pkg(options)
        .then((request) => {
            let arr = [];

            request.recording_files.forEach((file) => {
                console.log(`url ${file.file_type} : ${file.download_url}`);
                arr.push(file.download_url);
            });
            const meeting_id = request.id;
            // Recording.create({
            //     // user_id: request.host_id,
            //     meeting_id: meeting_id.toString(),
            //     name : request.host_email,
            //     description : request.topic,
            //     created_at : request.start_time,
            //     recording_video_url : arr[0],
            //     recording_audio_url : arr[1]
            // });
            // MÉTODO QUE CRIA UM WEB SCRAPER PARA DOWNLOAD DOS ARQUIVOS
            // const zoomDownloader = new ZoomDownloader();
            // zoomDownloader.Access_Info(arr[0], request.password);
            const response = {
                recordings: arr,
                token: request.password
            };
            console.log(`recording password : ${request.password}`);
            console.log(request)
            res.status(200).send(JSON.parse(JSON.stringify(response)));
        })
        .catch((err) => {
            console.log(`API call failed, reason ${err}`);
            res.status(404).send(err);
        });
});

export default router;
